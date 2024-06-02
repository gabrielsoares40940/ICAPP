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

import {  } from '@expo/vector-icons';

export default function Tela2() {

  const [agendamentos, setAgendamentos] = useState([]);
  const [pdfUri, setPdfUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false)
  const [nome, setNome] = useState("")

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função de Atualizar sem alerta!
  async function fetchAgendamentos() {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "123"));
      const agendamentosData = querySnapshot.docs.map(doc => (
        {
          id: doc.id,
          ...doc.data()
        }
      ));
      setAgendamentos(agendamentosData);
    } catch (error) {
      console.error("Erro ao buscar escalas: ", error);
    }
  }

  async function presenteAusente(id, situation) {
    try {
      await updateDoc(doc(FIRESTORE_DB, "123", id), {
        compareceu: situation // Novo campo para indicar se a pessoa compareceu
      });
      Alert.alert("Sucesso", "Status de comparecimento atualizado!");
      fetchAgendamentos(); // Atualizar a lista após a atualização do documento
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

  console.log(nome)
  return (
    /*Adicionando o modal para editar as informações  */

    <View style={styles.container}>
      <View style={{flexDirection:"row"}}>
         <Text style={styles.titleAgendamento}>Escalas</Text>
          <View style={{marginTop:50,marginLeft:40}}>
            <TouchableOpacity style={{backgroundColor:'#63c2d1',borderRadius:10,padding:10,width:40,marginBottom:10, left: 30}} onPress={gerarPdf}>
              <AntDesign name='pdffile1' style={{color:'#fff',fontSize:20}}/>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'#63c2d1',borderRadius:10,padding:10,width:40, left: 30}} onPress={compartilharPdf} disabled={!pdfUri}>
              <AntDesign name='sharealt' style={{color:'#fff',fontSize:20}}/>
            </TouchableOpacity>
          </View>
      </View>
      
      <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
      <FlatList 
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchAgendamentos} />}
        data={agendamentos.filter(item => !item.hasOwnProperty('compareceu'))}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Animatable.View delay={50} animation="fadeInUp">
            <Card containerStyle={{ width: 350, height: 200, borderRadius: 20 }}>
              <TouchableOpacity onPress={() => {setModalVisible(true)}}>
                <Card.Title>Escala</Card.Title>

                <Card.Divider/>
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>Nome: {item.nome}</Text>
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>Dia: {item.dia}</Text>
                  <Text style={{ fontWeight: "bold", textAlign: "center", paddingBottom: 10 }}>Hora: {item.hora}</Text>
                  <View style={styles.AreaCompareceu}>
                  <Card.Divider/>                
                    <TouchableOpacity style={styles.botaoExcluir} onPress={() => presenteAusente(item.id, "Ausente")}>
                      <Text style={styles.TextoExcluir}>Não compareceu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoCompareceu} onPress={() => presenteAusente(item.id, "Presente")}>
                      <Text style={styles.TextoCompareceu}>Compareceu</Text>
                    </TouchableOpacity>
                  </View>
              </TouchableOpacity>
            </Card>
          </Animatable.View>
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
                  style={{    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 10,}}
                />
                <Button title="Fechar Modal" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>



  );
}
