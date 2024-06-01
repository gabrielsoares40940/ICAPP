//Rotas pós logado tipo tabs

import React from 'react';
import {Feather} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Tela1 from './Tela1';
import Tela2 from './Tela2';
import Historico from './Historico';

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
        }
      }}
      
      >
        <Tab.Screen
          name="Tela1"
          component={Tela1}
          options={{
              tabBarIcon:() => <Feather name='plus' color={"#fff"} size={30}/>,
              tabBarLabel:'Criar Escala',
              headerShown: false,
              tabBarActiveTintColor:"#fff",
              tabBarInactiveTintColor:"#fff",
          }}
        />
        <Tab.Screen 
          name="Escalas"
          component={Tela2} 
          options={{ 
            tabBarIcon:() => <Feather name='list' color={"#fff"} size={30}/>,
            tabBarBadge: "!" ,
            headerShown: false,
            tabBarActiveTintColor:"#fff",
            tabBarInactiveTintColor:"#fff",
          }} 
          
        />

        <Tab.Screen
          name='Histórico'
          component={Historico}
          options={{
            tabBarIcon: () => <Feather name='book-open' color={"#fff"} size={30} />,
            headerShown: false,
            tabBarActiveTintColor:"#fff",
            tabBarInactiveTintColor:"#fff",
          }}  
        />
      </Tab.Navigator>
  );
}


