import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // **Importante:** Você precisa instalar esta biblioteca!
import { Image } from 'expo-image'; // Usando expo-image para melhor performance

// Instalação necessária:
// npx expo install react-native-webview expo-image

const { width } = Dimensions.get('window');

const APODDetailScreen = () => {
    const route = useRoute();
    // Pega o objeto APOD completo que foi passado como 'item'
    const apod = route.params.item; 
    
    // Se por algum motivo o objeto não for encontrado
    if (!apod) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Dados da imagem não encontrados.</Text>
            </View>
        );
    }

    const isVideo = apod.media_type === 'video';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{apod.title}</Text>
            <Text style={styles.date}>Data: {apod.displayDate}</Text>
            
            {/* Área de Mídia */}
            <View style={styles.mediaContainer}>
                {isVideo ? (
                    // Exibe o vídeo usando WebView (ideal para YouTube embed)
                    <WebView
                        style={styles.media}
                        source={{ uri: apod.url }}
                        allowsFullscreenVideo
                    />
                ) : (
                    // Exibe a imagem
                    <Image
                        style={styles.media}
                        source={{ uri: apod.url }}
                        contentFit="cover" // Ajusta a imagem
                    />
                )}
            </View>

            {/* Créditos (Optional) */}
            {apod.copyright && (
                <Text style={styles.copyright}>Créditos: {apod.copyright}</Text>
            )}

            {/* Explicação */}
            <Text style={styles.explanationTitle}>Explicação</Text>
            <Text style={styles.explanation}>{apod.explanation}</Text>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    content: {
        padding: 15,
        paddingBottom: 40,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#AAA',
        marginBottom: 15,
    },
    mediaContainer: {
        width: width - 30, // Largura da tela menos o padding
        height: width * 0.6, // Proporção 16:10 para a mídia
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    media: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333',
    },
    copyright: {
        fontSize: 12,
        color: '#777',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    explanationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 10,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 5,
    },
    explanation: {
        fontSize: 16,
        color: '#E0E0E0',
        lineHeight: 24,
    },
    errorText: {
        color: '#FF6B6B',
    }
});

export default APODDetailScreen;