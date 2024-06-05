import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert, RefreshControl, Modal, TextInput, Platform, Pressable } from 'react-native';
import { collection, getDocs, doc, updateDoc, deleteDoc } from '@firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';
import { Card } from 'react-native-elements';
import { Feather } from "@expo/vector-icons";

import DateTimePicker from '@react-native-community/datetimepicker';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import * as Animatable from 'react-native-animatable';

import { AntDesign } from '@expo/vector-icons';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Para o formato de data em português

export default function Tela2() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pdfUri, setPdfUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState(''); 
  const [hora, setHora] = useState('');
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState(null);
  const [dataAtual] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hora2, setHora2] = useState(new Date());
  const [showPickerHora, setShowPickerHora] = useState(false);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  async function fetchAgendamentos() {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "123"));
      const agendamentosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const filterAgendamentos = agendamentosData.filter((item) => !item.hasOwnProperty("compareceu"))
      setAgendamentos(filterAgendamentos);
    } catch (error) {
      console.error("Erro!","Erro ao buscar escalas: ", error);
    }
  }

  async function presenteAusente(id, situation) {
    try {
      await updateDoc(doc(FIRESTORE_DB, "123", id), {
        compareceu: situation
      });
      Alert.alert("Sucesso!", "Status de comparecimento atualizado!");
      // Filtra o agendamento atualizado para remover da tela
      setAgendamentos(prevAgendamentos => prevAgendamentos.filter(agendamento => agendamento.id !== id ));
    } catch (error) {
      console.error("Erro!","Erro ao atualizar o status de comparecimento: ", error);
    }
  }

  async function alterarEscala(id) {
    console.log(id)
    try {
      await updateDoc(doc(FIRESTORE_DB, "123", id), {
        nome: nome,
        dia: dia,
        hora: hora
      });
      Alert.alert("Sucesso!", "Escala atualizada!");
      fetchAgendamentos();
      setModalVisible(false);
    } catch (error) {
      console.error("Erro!","Erro ao atualizar escala: ", error);
    }
  }

  async function deleteItems(id){
    console.log('Meu', id)
    try {
      //await deleteDoc(doc(FIRESTORE_DB, "123", id));
      Alert.alert(
        'Deletar escala?', // Título do alerta
        'Tem certeza de que quer deletar a escala?', // Mensagem do alerta
        [
          {
            text: 'SIM', // Texto do botão
            onPress: () => deleteDoc(doc(FIRESTORE_DB, "123", id)), // Ação ao pressionar o botão
          },
          
          {
            text: 'NÃO', // Texto do botão
            onPress: () => fetchAgendamentos() // Ação ao pressionar o botão
          },
          
        ],
        {cancelable: false} // O alerta não pode ser cancelado ao tocar fora dele
      );
      // Atualizar a lista após a deleção
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro!", "Erro ao buscar escala: ", error);
    }
  }

  const gerarPdf = async () => {
    const agendamentosFiltrados = agendamentos.filter(item => !item.hasOwnProperty('compareceu'));
    const listaHtml = agendamentosFiltrados.map(item => `
      <div>
        <h3>Nome: ${item.nome}</h3>
        <p>Dia: ${item.dia}</p>
        <p>Hora: ${item.hora}</p>
      </div>
    `).join('');

    const html = `
      <html>
        <body>
          <h1>Segue a escala desta semana!</h1>
          ${listaHtml}
        </body>
      </html>
    `;

    const file = await printToFileAsync({ html });
    
    const newFileName = `${FileSystem.documentDirectory}Escala_Semana.pdf`;
    await FileSystem.moveAsync({
      from: file.uri,
      to: newFileName
    });

    setPdfUri(newFileName);
    Alert.alert("Sucesso!", "PDF gerado com sucesso!");
  };

  const compartilharPdf = async () => {
    if (pdfUri) {
      await shareAsync(pdfUri);
    } else {
      Alert.alert("Erro!", "Por favor, gere o PDF primeiro.");
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = parse(dateString, 'dd/MM/yyyy', new Date(), { locale: ptBR });
    return format(date, 'EEEE', { locale: ptBR });
  };

  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const dayOfWeek = getDayOfWeek(agendamento.dia);
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(agendamento);
    return acc;
  }, {});

  const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  // Substitua esta linha
  const agendamentosOrdenados = diasSemana
    .map(dia => [dia, agendamentosAgrupados[dia] || []])
    .filter(([dia, agendamentos]) => agendamentos.length > 0); // Filtra apenas os dias com agendamentos

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setDia(formatDate(currentDate));
      if (Platform.OS === 'android') {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setDia(formatDate(date));
    toggleDatePicker();
  }

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${day}/${month}/${year}`;
  }

  const toggleHoraPicker = () => {
    setShowPickerHora(!showPickerHora);
  };

  const onChangeHora = (event, selectedHora) => {
    if (event.type === "set" && selectedHora) {
      const currentHora = selectedHora || hora2;
      setHora2(currentHora);
      setHora(formatHora(currentHora));
      if (Platform.OS === 'android') {
        toggleHoraPicker();
      }
    } else {
      toggleHoraPicker();
    }
  };

  const confirmIOSHora = () => {
    setHora(formatHora(hora2));
    toggleHoraPicker();
  }

  const formatHora = (rawDate) => {
    let hora2 = new Date(rawDate);

    let Hora = hora2.getHours();
    let Minutos = hora2.getMinutes();

    Hora = Hora < 10 ? '0' + Hora : Hora;
    Minutos = Minutos < 10 ? '0' + Minutos : Minutos;
    
    return `${Hora}:${Minutos}`;
  }

  const openModal = (id, nome, dia, hora) => {
    setSelectedAgendamentoId(id);
    setNome(nome);
    setDia(dia);
    setHora(hora);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.titleAgendamento}>Escalas</Text>
        <View style={{ marginTop: 50, marginLeft: 40 }}>
          <TouchableOpacity style={{ backgroundColor: '#63c2d1', borderRadius: 10, padding: 10, width: 40, marginBottom: 10 }} onPress={gerarPdf}>
            <AntDesign name='pdffile1' style={{ color: '#fff', fontSize: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#63c2d1', borderRadius: 10, padding: 10, width: 40 }} onPress={compartilharPdf} disabled={!pdfUri}>
            <AntDesign name='sharealt' style={{ color: '#fff', fontSize: 20 }} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
      <FlatList style={{marginBottom:50}}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchAgendamentos} />}
        data={agendamentosOrdenados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View key={item[0]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{item[0]}</Text>
            {item[1].map(agendamento => (
              <Animatable.View key={agendamento.id} delay={50} animation="fadeInUp">
                <Card containerStyle={{ width: 350, borderRadius: 20, justifyContent:"space-between", padding: 10 }}>
                    <Card.Title style={{fontSize:20}}>Escala</Card.Title>
                    <Feather name="trash" style={{ width:20, height:20, marginLeft:'auto', bottom:45}} color={'gray'} size={20} onPress={() => deleteItems(agendamento.id)}/>
                    <Feather name="edit" color={'gray'} size={20} style={{ position:'absolute' , width:20, height:20}} onPress={() => openModal(agendamento.id, agendamento.nome, agendamento.dia, agendamento.hora)}/>
                    <Card.Divider/>
                      <Text style={{ textAlign: "center" }}>Nome: {agendamento.nome}</Text>
                      <Text style={{ textAlign: "center" }}>Dia: {agendamento.dia}</Text>
                      <Text style={{ textAlign: "center", paddingBottom: 10 }}>Hora: {agendamento.hora}</Text>
                      <View style={styles.AreaCompareceu}>
                        <TouchableOpacity style={styles.botaoExcluir} onPress={() => presenteAusente(agendamento.id, "Ausente")}>
                          <Text style={styles.TextoExcluir}>Não compareceu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoCompareceu} onPress={() => presenteAusente(agendamento.id, "Presente")}>
                          <Text style={styles.TextoCompareceu}>Compareceu</Text>
                        </TouchableOpacity>
                      </View>
                </Card>
              </Animatable.View>
            ))}
          </View>
        )}
      />

    {modalVisible && (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 50, borderRadius: 30, width: 390, height:500 }}>
              <Feather name="x-square" color={'red'} size={30} style={{right: -300, top: -30}} onPress={() => setModalVisible(false)}/>
              <Text style={{ fontSize: 25, marginBottom: 20, fontWeight:'bold', justifyContent: 'center', textAlign: 'center' }}>EDITAR</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
              />
              <Pressable onPress={toggleDatePicker}>
                <TextInput
                  style={styles.input}
                  placeholder="Dia"
                  value={dia}
                  onChangeText={setDia}
                  editable={false}
                />
              </Pressable>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onChange}
                />
              )}
              {showPicker && Platform.OS === 'ios' && (
                <Button title="Confirmar" onPress={confirmIOSDate} />
              )}
              <Pressable onPress={toggleHoraPicker}>
                <TextInput
                  style={styles.input}
                  placeholder="Hora"
                  value={hora}
                  onChangeText={setHora}
                  editable={false}
                />
              </Pressable>
              {showPickerHora && (
                <DateTimePicker
                  value={hora2}
                  mode="time"
                  display="spinner"
                  onChange={onChangeHora}
                />
              )}
              {showPickerHora && Platform.OS === 'ios' && (
                <Button title="Confirmar" onPress={confirmIOSHora} />
              )}
              <TouchableOpacity style={styles.button2} onPress={() => alterarEscala(selectedAgendamentoId)}>
                <Text style={styles.input2}>Alterar escala</Text>
              </TouchableOpacity>  
            </View>
          </View>
        </Modal>
      </View>
    )}
    </View>
  );
}