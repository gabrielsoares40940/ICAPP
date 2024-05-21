import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from 'react-native';
import { collection, getDocs } from '@firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';
import { Card, Icon } from 'react-native-elements'

export default function Tela2() {
  const [agendamentos, setAgendamentos] = useState([]);
  
  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, "123"));
        const agendamentosData = querySnapshot.docs.map(doc => doc.data());
        setAgendamentos(agendamentosData);
      } catch (error) {
        console.error("Erro ao buscar escalas: ", error);
      }
    }

    fetchAgendamentos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleAgendamento}>Escalas</Text>
      <FlatList
        data={agendamentos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Card>
              <Card.Title>Escala</Card.Title>
              <Card.Divider/>
              <Text style={{fontWeight: "bold"}}>Nome: {item.nome}</Text>
              <Text style={{fontWeight: "bold"}}>Dia: {item.dia}</Text>
              <Text style={{fontWeight: "bold"}}>Hora: {item.hora}</Text>
              <Text>Criado em: {item.createdAt.toDate().toLocaleString()}</Text>
            </Card>
          </View>
        )}
      />
    </View>
  );
}
