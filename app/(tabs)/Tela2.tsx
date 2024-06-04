import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert, RefreshControl, Modal, TextInput,Platform, Pressable } from 'react-native';
import { collection, getDocs, doc, updateDoc } from '@firebase/firestore';
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
  console.log('teste')
  const [agendamentos, setAgendamentos] = useState([]);
  const [pdfUri, setPdfUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState(''); 
  const [hora, setHora] = useState('');
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState(null);

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
      setAgendamentos(agendamentosData);
    } catch (error) {
      console.error("Erro ao buscar escalas: ", error);
    }
  }

  async function presenteAusente(id, situation) {
    try {
      await updateDoc(doc(FIRESTORE_DB, "123", id), {
        compareceu: situation
      });
      Alert.alert("Sucesso", "Status de comparecimento atualizado!");
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao atualizar o status de comparecimento: ", error);
    }
  }

  async function alterarEscala(id) {
    try {
      await updateDoc(doc(FIRESTORE_DB, "123", id), {
        nome: nome,
        dia: dia,
        hora: hora
      });
      Alert.alert("Sucesso", "Escala atualizada!");
      fetchAgendamentos();
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao atualizar escala: ", error);
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
          <h1>Segue a lista de agendamentos desta semana!</h1>
          ${listaHtml}
        </body>
      </html>
    `;

    const file = await printToFileAsync({ html });
    
    const newFileName = `${FileSystem.documentDirectory}Agendamentos_Semana.pdf`;
    await FileSystem.moveAsync({
      from: file.uri,
      to: newFileName
    });

    setPdfUri(newFileName);
    Alert.alert("Sucesso", "PDF gerado com sucesso!");
  };

  const compartilharPdf = async () => {
    if (pdfUri) {
      await shareAsync(pdfUri);
    } else {
      Alert.alert("Erro", "Por favor, gere o PDF primeiro.");
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = parse(dateString, 'dd/MM/yyyy', new Date(), { locale: ptBR });
    return format(date, 'EEEE', { locale: ptBR });
  };

   //Trabalhando com datas!
   const [dataAtual] = useState(new Date()); //Criado para barrar as datas anteriores
   const [date,setDate] = useState(new Date());
   const [showPicker, setShowPicker] = useState(false);

  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const dayOfWeek = getDayOfWeek(agendamento.dia);
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(agendamento);
    return acc;
  }, {});

  const diasSemana = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];

  const agendamentosOrdenados = diasSemana.map(dia => [dia, agendamentosAgrupados[dia] || []]);

  const toggleDatePicker = () =>{
    setShowPicker(!showPicker)
  };

  const onChange = ({ type }, selectedDate) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      throw new Error("selectedDate deve ser uma instância válida de Date");
    }
  
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatePicker();
        setDia(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () =>{
    setDia(formatDate(date));
    toggleDatePicker();
  }

  const formatDate = (rawDate)=>{
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${day}/${month}/${year}`;
  }

  // Trabalhando com Horas
  const [hora2,setHora2] = useState(new Date());
  const [showPickerHora, setShowPickerHora] = useState(false);

  const toggleHoraPicker = () =>{
    setShowPickerHora(!showPickerHora)
  };
  const onChangeHora = ({ type }, selectedHora) => {
    if (!(selectedHora instanceof Date) || isNaN(selectedHora.getTime())) {
      throw new Error("selectedDate deve ser uma instância válida de Date");
    }
  
    if (type === "set") {
      const currentHora = selectedHora;
      setHora2(currentHora);
      if (Platform.OS === 'android') {
        toggleHoraPicker();
        setHora(formatHora(currentHora));
      }
    } else {
      toggleHoraPicker();
    }
  };

  const confirmIOSHora = () =>{
    setHora(formatHora(hora2));
    toggleHoraPicker();
  }

  const formatHora = (rawDate)=>{
    let hora2 = new Date(rawDate);

    let Hora = hora2.getHours();
    let Minutos= hora2.getMinutes();

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
                <Card containerStyle={{ width: 350, height: 200, borderRadius: 20 }}>
                  <TouchableOpacity onPress={() => openModal(agendamento.id, agendamento.nome, agendamento.dia, agendamento.hora)}>
                    <Card.Title>Escala</Card.Title>
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
                  </TouchableOpacity>
                </Card>
              </Animatable.View>
            ))}
          </View>
        )}
      />

      {modalVisible && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
                <Feather name="x" color={'red'} size={30} style={{left: 180, top: -30}} onPress={() => setModalVisible(false)}/>
                <Text style={{ fontSize: 25, marginBottom: 20, fontWeight:'bold', justifyContent: 'center', textAlign: 'center' }}>EDITAR</Text>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Insira o novo nome</Text>
                <TextInput 
                  onChangeText={(e) => setNome(e)}
                  value={nome}
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 }}
                />

                {/* Trabalhando com datas*/}
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Insira o novo dia</Text>
                {showPicker && (
                  <DateTimePicker 
                  timeZoneName="America/Fortaleza"
                  value={date}
                  mode={'date'}
                  is24Hour={true}
                  display='default'
                  minimumDate={dataAtual}
                  onChange={onChange}
                  style={styles.datePicker}
                  locale='pt-BR'
                  
                  />   
                  )} 

                  {showPicker && Platform.OS==="ios" &&(
                    <View
                        style={{flexDirection:"row", justifyContent:"space-around"}}>
                          <TouchableOpacity 
                          style={[styles.pickerButton,{backgroundColor:"#ec5353",borderRadius:20,margin:10,justifyContent:"center",alignItems:'center',width:"50%"}]}
                          onPress={toggleDatePicker}
                          >
                              <Text
                              style={[styles.buttonText,{color:"#fff"}]}
                              >Cancelar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.pickerButton,{backgroundColor:"#4169e1",borderRadius:20,margin:10,justifyContent:"center",alignItems:'center',width:"50%"}]}
                          onPress={confirmIOSDate}
                            >
                              <Text
                              style={[styles.buttonText,{color:"#fff"}]}
                              >Confirmar</Text>
                          </TouchableOpacity>
                    </View>
                  )}

                  {!showPicker && (
                    <Pressable onPress={toggleDatePicker}>
                      <TextInput
                        placeholderTextColor="#fff"      
                        style={styles.input}
                        placeholder="Dia"
                        value={dia}
                        onChangeText={(e)=>setDia(e)}
                        editable={false}
                        onPressIn={toggleDatePicker}
                        />
                    </Pressable>
                  )}


                <Text style={{ fontSize: 20, marginBottom: 10 }}>Insira o novo horário</Text>
                  {showPickerHora && (
                    <DateTimePicker 
                    timeZoneName="America/Fortaleza"
                    value={hora2}
                    mode={'time'}
                    is24Hour={false}
                    display='spinner'
                    minimumDate={new Date()}
                    onChange={onChangeHora}
                    style={styles.datePicker}
                    locale='pt-BR'
                    />   
                    )} 

                    {showPickerHora && Platform.OS==="ios" &&(
                      <View
                          style={{flexDirection:"row", justifyContent:"space-around" }}>
                            <TouchableOpacity 
                            style={[styles.pickerButton,{backgroundColor:"#ec5353",borderRadius:20,margin:5,justifyContent:"center",alignItems:'center',width:"50%"}]}
                            onPress={toggleHoraPicker}
                            >
                                <Text
                                style={[styles.buttonText,{color:"#fff"}]}
                                >Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={[styles.pickerButton,{backgroundColor:"#4169e1",borderRadius:20,margin:5,justifyContent:"center",alignItems:'center',width:"50%"}]}
                            onPress={confirmIOSHora}
                              >
                                <Text
                                style={[styles.buttonText,{color:"#fff"}]}
                                >Confirmar</Text>
                            </TouchableOpacity>
                      </View>
                    )}

                    {!showPickerHora && (
                      <Pressable onPress={toggleHoraPicker}>
                        <TextInput
                          placeholderTextColor="#fff"      
                          style={styles.input}
                          placeholder="Horário"
                          value={hora}
                          onChangeText={(e)=>setHora(e)}
                          editable={false}
                          onPressIn={toggleHoraPicker}
                          />
                      </Pressable>
                    )}
                <TouchableOpacity style={styles.button} onPress={() => alterarEscala(selectedAgendamentoId)}>
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
