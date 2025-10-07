import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { fetchApods } from './nasa';
import APODCard from './APODCard'; 

const APODListScreen = ({ navigation }) => {
    const [apods, setApods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        loadApods();
    }, [loadApods]);

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

    // 3. Função para lidar com o clique no card (Navegação)
    const handlePressCard = (item) => {
        // Navega para a tela 'Detalhes', passando o objeto na chave 'item'
        navigation.navigate('Detalhes', { item: item }); 
    };

    // 4. Renderiza cada item da FlatList
    const renderItem = ({ item }) => (
        <APODCard 
            item={item} 
            onPress={() => handlePressCard(item)}
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
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadApods}
                        tintColor="#FFFFFF" 
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
        backgroundColor: '#0A0A0A',
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