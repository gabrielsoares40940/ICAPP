import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert , RefreshControl} from 'react-native';
import { collection, getDocs, doc, deleteDoc } from '@firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';
import { Card } from 'react-native-elements'

import * as Animatable from 'react-native-animatable';

export default function Tela2() {

  const [agendamentos, setAgendamentos] = useState([]);
  
  useEffect(() => {
    fetchAgendamentos()
  },[])

  async function fetchAgendamentos() {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "123"));
      const agendamentosData = querySnapshot.docs.map(doc => (
        {
          id: doc.id,
          ...doc.data()
        }
      ));
      setAgendamentos(agendamentosData as never);
    } catch (error) {
      console.error("Erro ao buscar escalas: ", error);
    }
  }

  async function deleteItems(id: any){
    console.log('Meu', id)
    try {
      await deleteDoc(doc(FIRESTORE_DB, "123", id));
      Alert.alert("Sucesso", "Agendamento deletado com sucesso!");
      // Atualizar a lista após a deleção
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao buscar agendamentos: ", error);
    }
  }

// Ajeitar o botao compareceu, adionando uma coluna no fire base de comparecimento!

  return (
    <View style={styles.container}>
      <Text style={styles.titleAgendamento}>Escalas</Text>
      <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
      <FlatList
      refreshControl={<RefreshControl
        refreshing={false}
        onRefresh={() => fetchAgendamentos()}
      />}
        data={agendamentos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Animatable.View delay={50} animation="fadeInUp">
            <Card containerStyle={{width:350, height:200, borderRadius:20}}>
              <Card.Title>Escala</Card.Title>
              <Card.Divider>
              <Text style={{fontWeight: "bold", textAlign:"center"}}>Nome: {item.nome} {console.log(item)}</Text>
              <Text style={{fontWeight: "bold", textAlign:"center"}}>Dia: {item.dia}</Text>
              <Text style={{fontWeight: "bold", textAlign:"center", paddingBottom:10}}>Hora: {item.hora}</Text>
              <View style={styles.AreaCompareceu}>
                <TouchableOpacity style={styles.botaoExcluir} onPress={() => deleteItems(item.id)}>
                  <Text style={styles.TextoExcluir}>Não compareceu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoCompareceu} onPress={() => deleteItems(item.id)}> 
                <Text style={styles.TextoCompareceu}>Compareceu</Text>
                </TouchableOpacity>
              </View>
              </Card.Divider>
            </Card>
          </Animatable.View>
        )}
      />
    </View>
  );
}