//ARQUIVO DE PRELOAD

import React,{ useEffect } from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {useNavigation } from '@react-navigation/native';

import {styles} from './css/css';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const navigation = useNavigation();

  useEffect(()=>{
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if(token !== null){
        navigation.navigate('Logado' as never)
      } else {
        navigation.navigate('SingIn' as never);
      }
    }
    checkToken();
  },[]);

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../(tabs)/assets/imaculada.png')}/>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('SingIn' as never)}>
        <Text style={styles.input3}>Acessar</Text>
      </TouchableOpacity>
    </View>
  );
}