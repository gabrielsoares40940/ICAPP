import { Text } from 'react-native';
import { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './css/css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { FIREBASE_APP } from '../../firebaseConfig';

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(FIREBASE_APP);

  async function handleSignUp() {
    if (email !== '' && password !== '') {
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Deu bom, ' + response);
        Alert.alert('Bem vindo!', 'Conta criada com sucesso!');
        navigation.navigate('Logado' as never);
      } catch (error) {
        console.error('Deu ruim', error);
        Alert.alert('Erro', 'Não foi possível criar a conta. Verifique os dados e tente novamente.');
      }
    } else {
      Alert.alert('Erro!','Preencha os campos de e-mail e senha.');
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
        onChangeText={(text) => setEmail(text)}
        placeholder='Digite seu e-mail'
        style={styles.input}
        value={email}
      />
      <Text style={styles.titleEmailSenha}>Senha</Text>
      <TextInput
        onChangeText={(text) => setPassword(text)}
        placeholder='Digite sua senha'
        style={styles.input}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
}
