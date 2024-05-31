import { Text } from 'react-native';
import { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Alert , KeyboardAvoidingView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './css/css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { FIREBASE_APP } from '../../firebaseConfig';

import {Ionicons} from '@expo/vector-icons';


import * as Animatable from 'react-native-animatable';

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
        Alert.alert('Bemvindo!', 'Conta criada com sucesso!');
        navigation.navigate('Logado' as never);
      } catch (error) {
        console.error('Deu ruim', error);
        Alert.alert('Erro', 'Não foi possível criar a conta. Verifique os dados e tente novamente.');
      }
    } else {
      Alert.alert('Erro!','Preencha os campos de e-mail e senha.');
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
      <KeyboardAvoidingView behavior='position' enabled>
        <Text style={styles.titleEmailSenha}>E-mail</Text>
        <View style={styles.inputArea}>
          <Ionicons name="mail" color="#808080" size={22} style={{paddingTop:3,marginRight:5,justifyContent:'center',alignItems:'center'}}/>
          <TextInput
            placeholderTextColor="#808080"
            onChangeText={(text) => setEmail(text)}
            placeholder='Digite seu e-mail'
            style={styles.input2}
            value={email}
          />
        </View>

        <Text style={styles.titleEmailSenha}>Senha</Text>
        <View style={styles.inputArea}>
        <Ionicons name="lock-closed" color="#808080" size={22} style={styles.iconLock}/>

          <TextInput
            placeholderTextColor="#808080"
            onChangeText={(text) => setPassword(text)}
            placeholder='Digite sua senha'
            style={styles.input2}
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
          </KeyboardAvoidingView>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignUp}
          >
          <Text>Cadastrar-se</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
