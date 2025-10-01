/**
 * ARQUIVO: APODDetailScreen.js
 * DESCRIÇÃO: Tela de Detalhes para um item APOD específico.
 * Exibe a imagem/vídeo e a explicação completa.
 * * Refatorado para a Raiz: O nome do arquivo foi simplificado.
 * * NOTA: Requer 'expo install react-native-webview'
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
// Importação do WebView (componente para exibir conteúdo web/vídeos)
import WebView from 'react-native-webview';

// Obtém a largura da tela
const { width } = Dimensions.get('window');

/**
 * Componente para a Tela de Detalhes
 * @param {object} route - Contém os parâmetros passados na navegação (o item APOD).
 * @param {object} navigation - Objeto de navegação.
 */
const APODDetailScreen = ({ route, navigation }) => {
    // Extrai o item APOD dos parâmetros da rota
    // Adiciona o encadeamento opcional (?.) para proteção contra 'undefined'
    const item = route.params?.item; 
    
    // ===============================================
    // VERIFICAÇÃO DE SEGURANÇA CRUCIAL
    // ===============================================
    if (!item) {
        // Se o item não for encontrado nos parâmetros de navegação
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Dados do APOD não encontrados.</Text>
                <Text style={styles.errorMessage}>Por favor, retorne à lista e selecione um item.</Text>
            </View>
        );
    }
    // ===============================================

    // Estado para gerenciar o carregamento da imagem/vídeo
    const [mediaLoading, setMediaLoading] = useState(true);

    // Define a imagem de placeholder/fallback para URLs inválidas
    const placeholderUri = 'https://placehold.co/600x400/0A0A0A/FFFFFF?text=NASA%20APOD';

    // 1. Definição da Mídia
    const isVideo = item.media_type === 'video';
    const mediaUri = isVideo ? item.url : (item.hdurl || item.url);

    /**
     * Função auxiliar para renderizar a mídia (Imagem ou Vídeo)
     */
    const renderMedia = () => {
        // Altura padrão para a área de mídia
        const mediaHeight = width * 0.65; // Proporção 65% da largura

        if (isVideo) {
            // Se for vídeo, renderiza WebView
            return (
                <View style={[styles.mediaArea, { height: mediaHeight }]}>
                    {/* Indicador de carregamento enquanto o WebView inicia */}
                    {mediaLoading && (
                        <View style={styles.loadingOverlay}>
                             <ActivityIndicator size="large" color="#4A90E2" />
                             <Text style={styles.loadingText}>Carregando Vídeo...</Text>
                        </View>
                    )}
                    <WebView
                        source={{ uri: mediaUri }}
                        style={styles.webView}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={true}
                        // O onLoadStart e onLoadEnd são usados para gerenciar o estado de carregamento do WebView
                        onLoadStart={() => setMediaLoading(true)}
                        onLoadEnd={() => setMediaLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            // Exibe um erro amigável ao usuário
                            Alert.alert("Erro de Vídeo", `Não foi possível carregar o vídeo. Tente o link: ${nativeEvent.url}`);
                            setMediaLoading(false);
                        }}
                    />
                </View>
            );
        } else {
            // Se for imagem, renderiza Image
            return (
                <View style={[styles.mediaArea, { height: mediaHeight }]}>
                    <Image
                        source={{ uri: mediaUri }}
                        style={styles.image}
                        resizeMode="cover"
                        // Gerencia o estado de carregamento da Imagem
                        onLoadEnd={() => setMediaLoading(false)}
                        onError={() => {
                            setMediaLoading(false);
                            // Se a URL principal falhar, tenta o placeholder
                            // Nota: Para este projeto, vamos apenas usar o placeholder como fallback visual
                        }}
                        defaultSource={{ uri: placeholderUri }}
                    />
                    {/* Indicador de carregamento para a imagem */}
                    {mediaLoading && (
                        <View style={styles.loadingOverlay}>
                             <ActivityIndicator size="large" color="#4A90E2" />
                        </View>
                    )}
                </View>
            );
        }
    };
    
    // Altera o título do cabeçalho dinamicamente
    React.useLayoutEffect(() => {
        // navigation.setOptions({ title: item.title }); // Já configurado no App.js
    }, [navigation, item.title]);


    return (
        // ScrollView é essencial para permitir que o conteúdo (a explicação longa) seja rolado
        <ScrollView style={styles.container}>
            {/* Renderiza o container de mídia (Imagem ou Vídeo) */}
            {renderMedia()}

            <View style={styles.content}>
                {/* Título e Data */}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>Publicado: {item.displayDate}</Text>
                
                {/* Crédito do Autor/Fotógrafo */}
                {item.copyright && (
                    <Text style={styles.copyright}>© {item.copyright}</Text>
                )}

                {/* Linha Divisória */}
                <View style={styles.divider} />
                
                {/* Explicação completa */}
                <Text style={styles.explanationHeader}>Explicação</Text>
                <Text style={styles.explanationText}>{item.explanation}</Text>
            </View>
        </ScrollView>
    );
};

// Estilos para a Tela de Detalhes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A', // Fundo preto espacial
    },
    mediaArea: {
        width: width,
        backgroundColor: '#000000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    webView: {
        flex: 1,
        backgroundColor: '#000000', // Fundo preto para o WebView
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#E0E0E0',
        marginTop: 10,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    date: {
        fontSize: 16,
        color: '#A0A0A0',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 14,
        color: '#505050',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#2C2C2C',
        marginVertical: 16,
    },
    explanationHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E0E0',
        marginBottom: 8,
    },
    explanationText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#BBBBBB',
    },
    centerContent: { // Estilos adicionados para a verificação de segurança
        justifyContent: 'center',
        alignItems: 'center',
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

export default APODDetailScreen;
