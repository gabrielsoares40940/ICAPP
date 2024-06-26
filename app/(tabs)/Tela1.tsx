//ARQUIVO DA CRIAÇÃO DE ESCALAS

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert , Platform, Pressable, Button} from 'react-native';
import {addDoc, collection } from "firebase/firestore";
import RNPickerSelect from 'react-native-picker-select';

import { FIRESTORE_DB } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { styles } from './css/css';

import * as Animatable from 'react-native-animatable';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function Tela1({navigation}) {

  const [nome, setNome] = useState('');
  const [dia, setDia] = useState(''); 
  const [hora, setHora] = useState('');
  const [funcao, setFuncao] = useState('');
    
  async function handleCreateAppointment() {
    //Criando variáveis
    if (nome !== '' && dia !== '' && hora !== '' && funcao !== '') {
      try {
        const docRef = await addDoc(collection(FIRESTORE_DB, "123"), {
          nome,
          dia,
          hora,
          funcao,
          createdAt: new Date()
        });
        
        Alert.alert("Sucesso!", "Escala criada com sucesso!");

        setNome('');
        setDia('');
        setHora('');
        setFuncao('');
        } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
        Alert.alert("Erro!", "Não foi possível criar a escala.");
      }
    } else {
      Alert.alert("Erro!", "Por favor, preencha todos os campos.");
    }
  }

  //Trabalhando com datas!
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

  //Formatar data
  const formatDate = (rawDate)=>{
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${day}/${month}/${year}`;
  }

  //Trabalhando com Horas
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

  //Formatar hora
  const formatHora = (rawDate)=>{
    let hora2 = new Date(rawDate);

    let Hora = hora2.getHours();
    let Minutos= hora2.getMinutes();

    Hora = Hora < 10 ? '0' + Hora : Hora;
    Minutos = Minutos < 10 ? '0' + Minutos : Minutos;
    
    return `${Hora}:${Minutos}`;
  }

  const [showFuncao, setShowFuncao] =useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.titleAgendamento2}>Criar Escala</Text>
        <Animatable.View delay={50} animation="fadeInUp">
        <Animatable.View delay={100} animation="fadeInUp">
          <TextInput
            placeholderTextColor="#fff"
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={text => setNome(text)}
          />
        </Animatable.View>
        {/*  Trabalhando com Datas  */}
        <Animatable.View delay={150} animation="fadeInUp" style={{alignItems:"center",justifyContent:"center", width:320}}>
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
            <View style={{flexDirection:"row", justifyContent:"space-around"}}>
              <TouchableOpacity 
                style={[styles.pickerButton,{backgroundColor:"#ec5353",borderRadius:20,margin:10,justifyContent:"center",alignItems:'center',width:"50%"}]}
                onPress={toggleDatePicker}
              >
              <Text style={[styles.buttonText,{color:"#fff"}]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pickerButton,{backgroundColor:"#4169e1",borderRadius:20,margin:10,justifyContent:"center",alignItems:'center',width:"50%"}]}
                onPress={confirmIOSDate}
              >
              <Text style={[styles.buttonText,{color:"#fff"}]}>Confirmar</Text>
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
                onChangeText={setDia}
                editable={false}
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          )}
          </Animatable.View>
          <Animatable.View delay={200} animation="fadeInUp" style={{alignItems:"center",justifyContent:"center", width:320}}>
          {/*  Trabalhando com Horas  */}
          {showPickerHora && (
            <DateTimePicker 
            timeZoneName="America/Fortaleza"
            value={hora2}
            mode={'time'}
            is24Hour={true}
            display='spinner'
            minimumDate={new Date()}
            onChange={onChangeHora}
            style={styles.datePicker}
            locale='pt-BR'
            minuteInterval={30}

            />   
          )} 

          {showPickerHora && Platform.OS==="ios" &&(
            <View style={{flexDirection:"row", justifyContent:"space-around" }}>
              <TouchableOpacity 
                style={[styles.pickerButton,{backgroundColor:"#ec5353",borderRadius:20,margin:5,justifyContent:"center",alignItems:'center',width:"50%"}]}
                onPress={toggleHoraPicker}
              >
              <Text style={[styles.buttonText,{color:"#fff"}]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pickerButton,{backgroundColor:"#4169e1",borderRadius:20,margin:5,justifyContent:"center",alignItems:'center',width:"50%"}]}
                onPress={confirmIOSHora}
              >
              <Text style={[styles.buttonText,{color:"#fff"}]}>Confirmar</Text>
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
                onChangeText={setHora}
                editable={false}
                onPressIn={toggleHoraPicker}
              />
            </Pressable>
          )}
          </Animatable.View>

          {!showFuncao && (
            <RNPickerSelect
            onValueChange={(value) => setFuncao(value)}
            items={[
              { label: 'Turíbulo', value: 'Turíbulo' },
              { label: 'Naveta', value: 'Naveta' },
              { label: 'Livre', value: 'Livre' },
            ]}
            placeholder={{
              label: 'Selecione uma função...',
              value: null,
              color: '#9EA0A4',
            }}
          />
          )}
          
          <Animatable.View delay={250} animation="fadeInUp" style={styles.container2}>
          <TouchableOpacity style={styles.button2} onPress={handleCreateAppointment}>
            <Text style={styles.input3}>Salvar Escala</Text>
          </TouchableOpacity>  
      {/* BOTÃO PARA VOLTAR <Button title="oi" onPress={() => navigation.goBack()} />*/}
      </Animatable.View>
      </Animatable.View>
    </View>
  );
}