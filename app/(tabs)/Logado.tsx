//ARQUIVO DE ROTAS PÓS LOGIN DO TIPO TABS

import React from 'react';
import { View } from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Tela1 from './Tela1';
import Tela2 from './Tela2';
import Historico from './Historico';

import { styles } from './css/css'

const Tab = createBottomTabNavigator();

export default function Logado() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown:true,
        tabBarStyle:{
          position:"absolute",
          backgroundColor:'#63c2d1',
          borderTopWidth:0,
          bottom:14,
          left:14,
          right:14,
          elevation:0,
          borderRadius:7,
          paddingBottom: 5,
          paddingTop:5
        }
      }}
    >
      <Tab.Screen 
        name="Escalas"
        component={Tela2} 
        options={{ 
          tabBarIcon:({size, color}) => <Feather name='list' color={color} size={size} />,
            //tabBarBadge: "!" ,
            headerShown: false,
            tabBarActiveTintColor:"#fff",
            tabBarInactiveTintColor:"#808080",
        }} 
      />

      <Tab.Screen
        name="Tela1"
        component={Tela1}
        options={{
          tabBarIcon:({size, focused}) => (
            <View style={[styles.tabIcons, {backgroundColor: focused ? '#fff' : '#56A9B6'}]}>
              <Entypo name='plus' color={focused ? '#56A9B6' : '#fff'} size={size} />
            </View>
          ),
            tabBarLabel:'',
            headerShown: false,
            tabBarActiveTintColor:"#fff",
            tabBarInactiveTintColor:"#808080",
        }}
      />

      <Tab.Screen
        name='Histórico'
        component={Historico}
        options={{
          tabBarIcon:({size, color}) => <Feather name='book-open' color={color} size={size} />,
            headerShown: false,
            tabBarActiveTintColor:"#fff",
            tabBarInactiveTintColor:"#808080",
        }}  
      />
    </Tab.Navigator>
  );
}