import { View, Image, TextInput, TouchableOpacity, Alert, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_APP } from '@/firebaseConfig';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { styles } from './css/css';

import {Ionicons} from '@expo/vector-icons';

import * as Animatable from 'react-native-animatable';

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(FIREBASE_APP);

  async function validateLogin() {
    if (email !== '' && password !== '') {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log("Deu bom", response);
        navigation.navigate('Logado' as never);
      } catch (e) {
        console.error("Deu ruim", e);
        Alert.alert("Erro", "E-mail ou senha incorretos.");
      }
    } else {
      Alert.alert("Erro!","Preencha os campos de e-mail e senha.");
    }
  }

  const[hidePass, setHidePassa] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.titleApp}>ICAPP</Text>
      <Text style={styles.titleApp2}>Imaculada Conceição APP</Text>
      <Image
        style={styles.imgMenor}
        source={require('../(tabs)/assets/imaculada.png')}
      />
      <Animatable.View delay={1000} animation="fadeInUp" style={styles.container2}>
        <Text style={styles.titleEmailSenha}>E-mail</Text>
        <View style={styles.inputArea}>
        <Ionicons name="mail" color="#808080" size={22} style={{paddingRight:3}}/>
        <TextInput
          placeholderTextColor="#808080"
          placeholder='Digite seu e-mail'
          style={styles.input2}
          onChangeText={text => setEmail(text)}
          value={email}
        />
        </View>
        <Text style={styles.titleEmailSenha}>Senha</Text>
        <View style={styles.inputArea}>
          <Ionicons name="lock-closed" color="#808080" size={22} style={{paddingRight:3}}/>
          <TextInput
            placeholderTextColor="#808080"
            placeholder='Digite sua senha'
            style={styles.input2}
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={hidePass}
          />
          <TouchableOpacity style={styles.icon} onPress={()=> setHidePassa(!hidePass)}>
            {hidePass ?
            <Ionicons name="eye-off" color="#808080" size={22} />
            :
            <Ionicons name="eye" color="#808080" size={22} />
            }
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.button}
          onPress={validateLogin}
        >
        <Text>Logar-se</Text>
        </TouchableOpacity>
        <Text onPress={()=>navigation.navigate('SingUp' as never)} style={styles.texto}>
          Não possui conta? Clique aqui para <Text style={styles.bold}>Cadastrar-se!</Text>
        </Text>
      </Animatable.View>
    </View>
  );
}
