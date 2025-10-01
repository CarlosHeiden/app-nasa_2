/**
 * ARQUIVO: App.js
 * DESCRIÇÃO: Componente raiz do aplicativo.
 * Responsável pela configuração do React Navigation e pela definição das rotas (telas).
 * * Refatorado para a Raiz: Todas as telas estão no mesmo nível de App.js.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// IMPORTAÇÕES AGORA SÃO DIRETAS (no mesmo nível)
import APODListScreen from './APODListScreen'; 
import APODDetailScreen from './APODDetailScreen';
// É necessário instalar: npx expo install @react-navigation/native @react-navigation/native-stack

// Cria o objeto Stack Navigator
const Stack = createNativeStackNavigator();

// Opções de estilo de cabeçalho que serão aplicadas a todas as telas
const screenOptions = {
    // Cor de fundo do cabeçalho (Preto espacial)
    headerStyle: {
        backgroundColor: '#0A0A0A', 
    },
    // Cor do título e dos botões (Branco suave)
    headerTintColor: '#E0E0E0', 
    // Estilo do texto do título
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    // Estilo do fundo da tela (para o momento de transição)
    contentStyle: {
        backgroundColor: '#0A0A0A', 
    },
    // Desativa a animação de gesto de swipe para evitar confusão em algumas plataformas
    gestureEnabled: false, 
};

export default function App() {
    return (
        // NavigationContainer gerencia o estado da navegação
        <NavigationContainer>
            {/* Define o tema para a barra de status */}
            <StatusBar style="light" backgroundColor="#0A0A0A" /> 
            
            {/* Stack.Navigator gerencia a pilha de telas */}
            <Stack.Navigator
                // Define a tela inicial que será carregada
                initialRouteName="Consulta"
                screenOptions={screenOptions} // Aplica os estilos globais
            >
                {/* 1. Tela de Consulta (Lista de APODs) */}
                <Stack.Screen 
                    name="Consulta" 
                    component={APODListScreen} 
                    options={{ title: 'App-NASA | Explorador APOD' }}
                />

                {/* 2. Tela de Detalhes (Visualização do Item) */}
                <Stack.Screen 
                    name="Detalhes" 
                    component={APODDetailScreen} 
                    options={({ route }) => {
                        // ADICIONAMOS A VERIFICAÇÃO DE SEGURANÇA AQUI
                        const item = route.params?.item;
                        let title = 'Detalhes'; // Título padrão

                        if (item && item.title) {
                            // Se o item e o título existirem, aplicamos a lógica de truncagem
                            title = item.title.length > 30 
                                ? item.title.substring(0, 30) + '...' 
                                : item.title;
                        }

                        return { title };
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
