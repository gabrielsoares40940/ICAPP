
//ARQUIVO DE ROTAS

import { Stack , Tabs} from 'expo-router';
import React from 'react';



export default function TabLayout() {
  return (
    <Stack
      initialRouteName='SingIn'
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen
        name="index"
        />
      <Stack.Screen
        name="SingIn"
        />
      <Stack.Screen
        name="SingUp"
        />
      <Stack.Screen
        name="Logado"
        />
    </Stack>
  );
}
