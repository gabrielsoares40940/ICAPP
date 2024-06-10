//ARQUIVO DA TELA DE LOGIN

import { View, Image, TextInput, TouchableOpacity, Alert, Text, KeyboardAvoidingView,StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import React, { useState } from 'react';
import {Ionicons} from '@expo/vector-icons';

import { styles } from './css/css';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_APP } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(FIREBASE_APP);

  //Validar login
  async function validateLogin() {
    if (email !== '' && password !== '') {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        await AsyncStorage.setItem('token', JSON.stringify(response.user));
        navigation.navigate('Logado' as never);
      } catch (e) {
        console.error("Deu ruim", e);
        Alert.alert("Erro!", "E-mail ou senha incorretos.");
      }
    } else {
      Alert.alert("Erro!","Preencha os campos de e-mail e senha.");
    }
  }

  const[hidePass, setHidePassa] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#63c2d1' barStyle='light-content'/>
      <Text style={styles.titleApp}>ICAPP</Text>
      <Text style={styles.titleApp2}>Imaculada Conceição APP</Text>
      <Image
        style={styles.imgMenor}
        source={require('../(tabs)/assets/imaculada.png')}
      />
      <Animatable.View delay={1000} animation="fadeInUp" style={styles.container2}>
        <KeyboardAvoidingView behavior='position' enabled>
          <View style={styles.inputArea}>
            <Ionicons name="mail" color="#fff" size={22} style={{ paddingTop:3,marginRight:5,justifyContent:'center',alignItems:'center'}}/>
            <TextInput
              placeholderTextColor="#fff"
              placeholder='Digite seu e-mail'
              style={styles.input2}
              onChangeText={text => setEmail(text)}
              value={email}
            />
          </View>
          <View style={styles.inputArea}>
            <Ionicons name="lock-closed" color="#fff" size={22} style={styles.iconLock}/>
            <TextInput
              placeholderTextColor="#fff"
              placeholder='Digite sua senha'
              style={styles.input2}
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={hidePass}
            />
            <TouchableOpacity style={styles.icon} onPress={()=> setHidePassa(!hidePass)}>
              {hidePass ?
              <Ionicons name="eye-off" color="#fff" size={22} />
              :
              <Ionicons name="eye" color="#fff" size={22} />
              }
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
          <TouchableOpacity style={styles.button} onPress={validateLogin}>
            <Text style={styles.input3}>Login</Text>
          </TouchableOpacity>
          <Text onPress={()=>navigation.navigate('SingUp' as never)} style={styles.texto}>
            Não possui conta? Clique aqui para <Text style={styles.bold}>Cadastrar-se!</Text>
          </Text>
      </Animatable.View>
    </View>
  );
}
