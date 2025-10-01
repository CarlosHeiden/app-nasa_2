/**
 * ARQUIVO: APODListScreen.js
 * DESCRIÇÃO: Tela principal de consulta.
 * Busca os dados da API APOD e exibe em uma FlatList.
 * * Refatorado para a Raiz: O nome do arquivo foi simplificado.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { fetchApods } from './nasa'; // Importação direta
import APODCard from './APODCard'; // Importação direta

const APODListScreen = ({ navigation }) => {
    // Estado para armazenar os dados da API
    const [apods, setApods] = useState([]);
    // Estado para gerenciar o carregamento
    const [isLoading, setIsLoading] = useState(true); // <--- CORREÇÃO AQUI: USANDO useState(true)
    // Estado para gerenciar erros
    const [error, setError] = useState(null);
    // Estado para gerenciar o refresh manual (pull to refresh)
    const [isRefreshing, setIsRefreshing] = useState(false);

    /**
     * Função para buscar os dados da API
     */
    const loadApods = useCallback(async () => {
        setIsRefreshing(true);
        setError(null);
        try {
            const data = await fetchApods();
            setApods(data);
        } catch (e) {
            console.error("Erro ao carregar APODs:", e);
            setError("Não foi possível carregar os dados. Verifique sua conexão com a internet ou a chave da API.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    // Efeito para carregar os dados ao montar o componente
    useEffect(() => {
        loadApods();
    }, [loadApods]);

    // ===============================================
    // Funções de Renderização
    // ===============================================

    // 1. Renderiza o Estado de Carregamento Inicial
    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando maravilhas espaciais...</Text>
            </View>
        );
    }

    // 2. Renderiza o Estado de Erro
    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>ERRO DE CONEXÃO</Text>
                <Text style={styles.errorMessage}>{error}</Text>
            </View>
        );
    }

    // 3. Função para lidar com o clique no card (CRÍTICO)
    const handlePressCard = (item) => {
        // Navega para a tela 'Detalhes', passando o objeto 'item' como parâmetro
        // O nome 'item' deve ser EXATAMENTE 'item' para a tela de detalhes
        navigation.navigate('Detalhes', { item: item }); 
    };

    // 4. Renderiza cada item da FlatList
    const renderItem = ({ item }) => (
        <APODCard 
            item={item} 
            onPress={() => handlePressCard(item)} // Passa a função de navegação
        />
    );

    // 5. Renderização Principal (Lista)
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={apods}
                renderItem={renderItem}
                keyExtractor={(item) => item.date}
                contentContainerStyle={styles.listContent}
                refreshControl={ // Adiciona a funcionalidade de "pull to refresh"
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadApods}
                        tintColor="#FFFFFF" // Cor do ícone de refresh
                    />
                }
            />
        </SafeAreaView>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A', // Fundo preto espacial
    },
    listContent: {
        padding: 8,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#E0E0E0',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorMessage: {
        color: '#BBBBBB',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 30,
    }
});

export default APODListScreen;
