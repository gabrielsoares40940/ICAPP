import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert, RefreshControl, Modal, TextInput, Platform, Pressable } from 'react-native';
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
      Alert.alert("Erro", "Por favor, gere o PDF primeiro.");
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

  const diasSemana = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];

  const agendamentosOrdenados = diasSemana.map(dia => [dia, agendamentosAgrupados[dia] || []]);

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
          <Animatable.View animation="fadeInUp" delay={500} duration={1000} useNativeDriver>
            <Card containerStyle={{ borderRadius: 20, padding: 10 }}>
              <Text style={styles.text}>{item[0]}</Text>
              {item[1].map(agendamento => (
                <Card containerStyle={{ borderRadius: 10, padding: 10 }} key={agendamento.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text}>{agendamento.nome}</Text>
                    <Text style={styles.text}>{agendamento.dia}</Text>
                    <Text style={styles.text}>{agendamento.hora}</Text>
                    <Feather
                      name='edit'
                      size={20}
                      color='#000'
                      onPress={() => openModal(agendamento.id, agendamento.nome, agendamento.dia, agendamento.hora)}
                    />
                    <TouchableOpacity onPress={() => presenteAusente(agendamento.id, true)}>
                      <Text style={[styles.buttonText, styles.buttonYes]}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => presenteAusente(agendamento.id, false)}>
                      <Text style={[styles.buttonText, styles.buttonNo]}>Não</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </Card>
          </Animatable.View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Alterar Escala</Text>
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
          <Button title="Salvar Alterações" onPress={() => alterarEscala(selectedAgendamentoId)} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>
    </View>
  );
}
