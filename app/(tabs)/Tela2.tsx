import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { collection, getDocs, doc, deleteDoc } from '@firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';
import { Card } from 'react-native-elements'

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

  return (
    <View style={styles.container}>
      <Text style={styles.titleAgendamento}>Escalas</Text>
      <FlatList
        data={agendamentos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Card wrapperStyle={{width:350, height:150}}>
              <Card.Title>Escala</Card.Title>
              <Card.Divider/>
              <Text style={{fontWeight: "bold", textAlign:"center"}}>Nome: {item.nome} {console.log(item)}</Text>
              <Text style={{fontWeight: "bold", textAlign:"center"}}>Dia: {item.dia}</Text>
              <Text style={{fontWeight: "bold", textAlign:"center", paddingBottom:10}}>Hora: {item.hora}</Text>
              <TouchableOpacity>
                <Button title={"Deletar"} onPress={() => deleteItems(item.id)}/>
              </TouchableOpacity>
            </Card>
          </View>
        )}
      />
    </View>
  );
}
