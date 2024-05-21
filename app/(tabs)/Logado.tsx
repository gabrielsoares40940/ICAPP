//Rotas pós logado tipo tabs

import React from 'react';
import {Feather} from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Tela1 from './Tela1';
import Tela2 from './Tela2';

const Tab = createBottomTabNavigator();

export default function Logado() {
  return (
      <Tab.Navigator
      screenOptions={{headerShown:true}}
      >
        <Tab.Screen
          name="Tela1"
          component={Tela1}
          options={{
              tabBarIcon:() => <Feather name='plus' color={"#fff"} size={30}/>,
              tabBarLabel:'Criar',
              headerShown: false
          }}
        />
        <Tab.Screen 
          name="Escalas"
          component={Tela2} 
          options={{ 
            tabBarIcon:() => <Feather name='list' color={"#fff"} size={30}/>,
            tabBarBadge: "!" ,
            headerShown: false
          }} 
          
        />
      </Tab.Navigator>
  );
}


