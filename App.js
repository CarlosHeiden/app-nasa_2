import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import APODListScreen from './APODListScreen';
import APODDetailScreen from './APODDetailScreen';

// Cria o objeto Stack Navigator
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Lista"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A0A0A', // Cor de fundo do cabeçalho
          },
          headerTintColor: '#FFFFFF', // Cor do texto/botões no cabeçalho
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Lista" 
          component={APODListScreen} 
          options={{ title: 'NASA APOD - 15 Dias' }} 
        />
        
        {/* CRÍTICO: O nome da rota DEVE ser 'Detalhes' */}
        <Stack.Screen 
          name="Detalhes" 
          component={APODDetailScreen} 
          options={{ title: 'Detalhes da Imagem' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;