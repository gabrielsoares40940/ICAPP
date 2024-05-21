import { View, Image, TextInput, TouchableOpacity, Alert, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_APP } from '@/firebaseConfig';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { styles } from './css/css';

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

  return (
    <View style={styles.container}>
      <Text style={styles.titleApp}>ICAPP</Text>
      <Text style={styles.titleApp2}>Imaculada Conceição APP</Text>
      <Image
        style={styles.imgMenor}
        source={require('../(tabs)/assets/imaculada.png')}
      />
      <Text style={styles.titleEmailSenha}>E-mail</Text>
      <TextInput
        placeholder='Digite seu e-mail'
        style={styles.input}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <Text style={styles.titleEmailSenha}>Senha</Text>
      <TextInput
        placeholder='Digite sua senha'
        style={styles.input}
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={validateLogin}
      >
        <Text>Logar-se</Text>
      </TouchableOpacity>

        <Text onPress={()=>navigation.navigate('SingUp')} style={styles.texto}>
          Não possui conta? Clique aqui para cadastrar!
          </Text>
    </View>
  );
}
