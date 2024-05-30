import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert , Button, Platform, Pressable} from 'react-native';
import {addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';

import * as Animatable from 'react-native-animatable';



import DateTimePicker, { EvtTypes } from '@react-native-community/datetimepicker'


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

  const [dataAtual] = useState(new Date()); //Criado para barrar as datas anteriores

  const [date,setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

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
        setDia(currentDate.toLocaleDateString());
      }
    } else {
      toggleDatePicker();
    }
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
          {showPicker && (
          <DateTimePicker 
          value={date}
          mode={'date'}
          is24Hour={true}
          display='spinner'
          minimumDate={dataAtual}
          onChange={onChange}
          locale="pt-BR"
          timeZoneName=""
          style={styles.datePicker}
          />   
          )} 

          {showPicker && Platform.OS==="ios" &&(
          <View
            style={{flexDirection:"row", justifyContent:"space-around" }}>
              <TouchableOpacity 
              style={[styles.pickerButton,{backgroundColor:"#808080"}]}
              onPress={toggleDatePicker}
              >
                  <Text
                  style={[styles.buttonText,{color:"#075985"}]}
                  >Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style={[styles.pickerButton,]}
              onPress={toggleDatePicker}
                >
                  <Text
                  style={[styles.buttonText,{color:"#075985"}]}
                  >Confirmar</Text>
              </TouchableOpacity>
          </View>
        )}

          {!showPicker && (
            <Pressable onPress={toggleDatePicker}>
                  
              <TextInput
                placeholderTextColor="#808080"      
                style={styles.input}
                placeholder="Dia"
                value={dia}
                onChangeText={setDia}
                editable={false}
                onPressIn={toggleDatePicker}
                />
            </Pressable>
          )}

          

          

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