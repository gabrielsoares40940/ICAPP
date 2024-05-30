import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert , Button, Platform} from 'react-native';
import {addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';

import * as Animatable from 'react-native-animatable';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

export default function Tela1({navigation}) {

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
            createdAt: new Date().toLocaleDateString()
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

  const [dataAtual] = useState(new Date()); // criado para barrar as datas anteriores

  const [data,setData] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, data?: Date)=>{
    console.log(event,data);
    if(data) setData(data);
    

    setShow(false);
  };

  const handleShow = () =>{
    setShow(true);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.titleAgendamento}>Criar Escala</Text>
        <Animatable.View delay={50} animation="fadeInUp">
        <Animatable.View delay={100} animation="fadeInUp">
          <TextInput
            placeholderTextColor="#808080"
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={text => setNome(text)}
          />
        </Animatable.View>
        <Animatable.View delay={150} animation="fadeInUp">


         <Button onPress={handleShow} title="Escolha sua data"/>
          {show && 
            
          <DateTimePicker 
          testID="dateTimePicker"
          value={data}
          mode={'date'}
          is24Hour={true}
          display='default'
          minimumDate={dataAtual}
          onChange={handleChange}
          locale="pt-Br"
          
          
          />   
          } 
          <Text> {data.toLocaleDateString()}</Text>

           <TextInput
            placeholderTextColor="#808080"      
            style={styles.input}
            placeholder="Dia"
            value={dia}
            onChangeText={text => setDia(text)}
            editable={false}
            />

          

          

{/* <TextInput
            placeholderTextColor="#808080"      
            keyboardType={'numeric'}
            style={styles.input}
            placeholder="Dia"
            value={dia}
            onChangeText={text => setDia(text)}
            />
*/}
        </Animatable.View>
        <Animatable.View delay={200} animation="fadeInUp">
          <TextInput
            placeholderTextColor="#808080"
            keyboardType="numeric"
            style={styles.input}
            placeholder="Hora"
            value={hora}
            onChangeText={text => setHora(text)}
          />
          </Animatable.View>
          <Animatable.View delay={250} animation="fadeInUp" style={styles.container2}>
          <TouchableOpacity style={styles.button} onPress={handleCreateAppointment}>
            <Text >Salvar Escala</Text>
          </TouchableOpacity>  
        </Animatable.View>
        <TouchableOpacity style={styles.botaoLogoff} onPress={()=> navigation.navigate("SingIn")}>
            <Text>Logoff</Text>
          </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}