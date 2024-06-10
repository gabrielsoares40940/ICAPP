//ARQUIVO DA TELA DAS ESCALAS

import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert, RefreshControl, Modal, TextInput, Platform, Pressable } from 'react-native';
import { Card } from 'react-native-elements';
import { Feather } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Animatable from 'react-native-animatable';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Para o formato de data em português

import { styles } from './css/css';

import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { collection, getDocs, doc, updateDoc, deleteDoc } from '@firebase/firestore';

export default function Tela2({navigation}) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pdfUri, setPdfUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState(''); 
  const [hora, setHora] = useState('');
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hora2, setHora2] = useState(new Date());
  const [showPickerHora, setShowPickerHora] = useState(false);

  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && /defaultProps/.test(args[0])) {
        return;
      }
    originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  //Atualizar escalas puxando do firebase
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

  //Atualiza se o coroinha está presente ou ausente
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

  //Editar escala
  async function alterarEscala(id) {
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

  //Deletar escala
  async function deleteItems(id){
    try {
      Alert.alert(
        'Deletar escala?',
        'Tem certeza de que quer deletar a escala?',
        [
          {
            text: 'SIM',
            onPress: () => deleteDoc(doc(FIRESTORE_DB, "123", id)),
          },
          
          {
            text: 'NÃO',
            onPress: () => fetchAgendamentos()
          },
          
        ],
        {cancelable: false} 
      );
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro!", "Erro ao buscar escala: ", error);
    }
  }

  //Função que gera e compartilha o PDF com a escala
  const gerarPdf = async () => {
    const agendamentosFiltrados = agendamentos.filter(item => !item.hasOwnProperty('compareceu'));
    const listaHtml = agendamentosFiltrados.map(item => `
      <div>
        <p>Nome: ${item.nome}</hp>
        <p>Dia: ${item.dia}</p>
        <p>Hora: ${item.hora}</p>
        <p>------------------------------------</p>
      </div>
    `).join('');

    const html = `
      <html>
        <body align="center">
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
    Alert.alert("Sucesso!", "PDF gerado e pronto para ser compartilhado!",
    [
      {
        text: 'COMPARTILHAR',
        onPress: () => shareAsync(newFileName),
      },
    ],
    {cancelable: false} 
  )
  fetchAgendamentos();
  };

  //Pegar os dias da semana
  const getDayOfWeek = (dateString) => {
    const date = parse(dateString, 'dd/MM/yyyy', new Date(), { locale: ptBR });
    return format(date, 'EEEE', { locale: ptBR });
  };

  //Agrupar as escalas pelo dia da semana
  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const dayOfWeek = getDayOfWeek(agendamento.dia);
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(agendamento);
    return acc;
  }, {});

  const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  };

  const agendamentosOrdenados = diasSemana
    .map(dia => [dia, agendamentosAgrupados[dia] || []])
    .filter(([dia, agendamentos]) => agendamentos.length > 0); // Filtra apenas os dias com agendamentos

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  //Edita a data
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

  //Formata a data
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

  //Edita a hora
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

  //Formata a hora
  const formatHora = (rawDate) => {
    let hora2 = new Date(rawDate);

    let Hora = hora2.getHours();
    let Minutos = hora2.getMinutes();

    Hora = Hora < 10 ? '0' + Hora : Hora;
    Minutos = Minutos < 10 ? '0' + Minutos : Minutos;
    
    return `${Hora}:${Minutos}`;
  }

  //Abrir modal de edição da escala
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
          <TouchableOpacity onPress={gerarPdf}>
            <Feather name='share-2' style={{ color: '#fff', fontSize: 20,backgroundColor: '#63c2d1', borderRadius: 10, padding: 10, width: 40, marginBottom: 10, left:'28%'}}/>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
      <FlatList 
        style={{marginBottom:50}}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchAgendamentos} />}
        data={agendamentosOrdenados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View key={item[0]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{capitalize(item[0])}</Text>
            {item[1].map(agendamento => (
              <Animatable.View key={agendamento.id} delay={50} animation="fadeInUp">
                <Card containerStyle={{ width: 350, borderRadius: 20, justifyContent:"space-between", padding: 10 }}>
                  <Card.Title style={{fontSize:20}}>Escala</Card.Title>
                  <Feather name="trash" style={{ width:20, height:20, position:'absolute', top:'auto'}} color={'gray'} size={20} onPress={() => deleteItems(agendamento.id)}/>
                  <Feather name="edit" color={'gray'} size={20} style={{ left:'95%',bottom:'20%', width:20, height:20}} onPress={() => openModal(agendamento.id, agendamento.nome, agendamento.dia, agendamento.hora)}/>
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
      <View style={styles.container}>
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: '10%', borderRadius: 30, width: '100%', height:'60%', alignItems:'center' }}>
              <Feather name="x-square" color={'red'} size={30} style={{left: '50%', bottom:'5%'}} onPress={() => setModalVisible(false)}/>
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
                  minimumDate={new Date()}
                  textColor="#808080"
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
              <TouchableOpacity style={styles.button3} onPress={() => alterarEscala(selectedAgendamentoId)}>
                <Text style={styles.input4}>Alterar escala</Text>
              </TouchableOpacity>  
            </View>
          </View>
        </Modal>
      </View>
    )}
    </View>
  );
}