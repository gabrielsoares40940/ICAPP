import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { collection, getDocs, doc, updateDoc } from '@firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';
import { Card } from 'react-native-elements';

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
      const filterAgendamentos = agendamentosData.filter((item) => !item.hasOwnProperty('compareceu'))
      setAgendamentos(filterAgendamentos);
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

  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const dayOfWeek = getDayOfWeek(agendamento.dia);
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(agendamento);
    return acc;
  }, {});

  const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  const agendamentosOrdenados = diasSemana.map(dia => [dia, agendamentosAgrupados[dia] || []]);

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
      <FlatList 
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchAgendamentos} />}
        data={agendamentosOrdenados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View key={item[0]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{item[0]}</Text>
            {item[1].map(agendamento => (
              <Animatable.View key={agendamento.id} delay={50} animation="fadeInUp">
                <Card containerStyle={{ width: 350, height: 200, borderRadius: 20 }}>
                  <TouchableOpacity onPress={() => { setModalVisible(true) }}>
                    <Card.Title>Escala</Card.Title>
                    <Card.Divider>
                      <Text style={{ fontWeight: "bold", textAlign: "center" }}>Nome: {agendamento.nome}</Text>
                      <Text style={{ fontWeight: "bold", textAlign: "center" }}>Dia: {agendamento.dia}</Text>
                      <Text style={{ fontWeight: "bold", textAlign: "center", paddingBottom: 10 }}>Hora: {agendamento.hora}</Text>
                      <View style={styles.AreaCompareceu}>
                        <TouchableOpacity style={styles.botaoExcluir} onPress={() => presenteAusente(agendamento.id, "ausente")}>
                          <Text style={styles.TextoExcluir}>Não compareceu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoCompareceu} onPress={() => presenteAusente(agendamento.id, "presente")}>
                          <Text style={styles.TextoCompareceu}>Compareceu</Text>
                        </TouchableOpacity>
                      </View>
                    </Card.Divider>
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
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Insira o novo nome</Text>
                <TextInput 
                  onChangeText={(e) => setNome(e)}
                  value={nome}
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 }}
                />
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Insira o novo dia</Text>
                <TextInput 
                  onChangeText={(e) => setNome(e)}
                  value={nome}
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 }}
                />
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Insira o novo horário</Text>
                <TextInput 
                  onChangeText={(e) => setNome(e)}
                  value={nome}
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 }}
                />
                <Button title="Alterar Escala" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}
