import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';
import { Card } from 'react-native-elements'

export default function Tela1() {
  const [nome, setNome] = useState('');
  const [dia, setDia] = useState(''); 
  const [hora, setHora] = useState('');
    
  async function handleCreateAppointment() {
    if (nome !== '' && dia !== '' && hora !== '') {
      try {
        
        //const docRef = doc(FIRESTORE_DB, "appointments");
        const docRef = await addDoc(collection(FIRESTORE_DB, "123"), {
            nome,
            dia,
            hora,
            createdAt: new Date()
          });
        // addDoc(colRef, {
        //     title,
        //     description,
        //     createdAt: new Date()
        // });
        
        Alert.alert("Sucesso!", "Escala criada com sucesso!");

        setNome('');
        setDia('');
        setHora('');
        } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
        Alert.alert("Erro!", "Não foi possível criar a escala.");
      }
    } else {
      Alert.alert("Erro!", "Por favor, preencha todos os campos.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleAgendamento}>Criar Escala</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={text => setNome(text)}
      />
      <TextInput
        keyboardType={'numeric'}
        style={styles.input}
        placeholder="Dia"
        value={dia}
        onChangeText={text => setDia(text)}
      />
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        placeholder="Hora"
        value={hora}
        onChangeText={text => setHora(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateAppointment}>
        <Text >Salvar Escala</Text>
      </TouchableOpacity>
    </View>
  );
}
