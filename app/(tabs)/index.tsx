// PAGINA DE Preload
import React,{ useEffect } from 'react';
import {View, Image, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {styles} from './css/css';
import { NavigationProp, useNavigation } from '@react-navigation/native';

//import UserContextProvider from '../contexts/UserContext';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home() {

  const navigation = useNavigation();

  useEffect(()=>{
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if(token !== null ){

        //validar token

      } else {
        navigation.navigate('SingIn' as never); //DEPOIS VER SE FUNCIONA
        
      }

    }
    checkToken();
  },[]);


// colocar UserContextProvider

  return (
        <View style={styles.container}>
          <Image
          style={styles.img}
          source={require('../(tabs)/assets/imaculada.png')}
          />
          <Text/>
          <ActivityIndicator
            size='large'
            color='#fff'
            animating={true}
          />
        </View>
  );
}
