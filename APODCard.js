/**
 * ARQUIVO: APODCard.js
 * DESCRIÇÃO: Componente reutilizável para renderizar um item da lista APOD.
 * Exibe a imagem de pré-visualização, título e data.
 * * Refatorado para a Raiz: O nome do arquivo foi simplificado.
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

// Obtém a largura da tela para responsividade
const { width } = Dimensions.get('window');

/**
 * Componente funcional APODCard
 * @param {object} item - O objeto APOD (Astronomy Picture of the Day).
 * @param {function} onPress - Função a ser chamada ao pressionar o card.
 */
const APODCard = ({ item, onPress }) => {
    // Define a imagem de placeholder/fallback para vídeos ou URLs inválidas
    const placeholderUri = 'https://placehold.co/600x400/0A0A0A/FFFFFF?text=NASA%20APOD';
    
    // Verifica se a mídia é um vídeo ou se a URI não é válida para Image
    const isVideo = item.media_type === 'video';
    
    // A URL da imagem a ser exibida. Usa o placeholder se for vídeo.
    const imageUri = isVideo ? placeholderUri : (item.url || item.hdurl || placeholderUri);

    // Handler para navegar para a tela de Detalhes
    const handlePress = () => {
        onPress(item);
    };

    return (
        // TouchableOpacity adiciona feedback visual ao toque
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.imageContainer}>
                {/* 1. Imagem de Pré-visualização */}
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    // Adiciona um fallback simples se a imagem falhar ao carregar
                    defaultSource={{ uri: placeholderUri }}
                />
                
                {/* 2. Ícone ou Indicador de Vídeo */}
                {isVideo && (
                    <View style={styles.videoOverlay}>
                        <Text style={styles.videoText}>▶ VÍDEO</Text>
                    </View>
                )}
            </View>

            {/* 3. Conteúdo de Texto */}
            <View style={styles.content}>
                {/* Título (limitado a duas linhas) */}
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                
                {/* Data Formatada */}
                <Text style={styles.date}>{item.displayDate}</Text>
            </View>
        </TouchableOpacity>
    );
};

// Estilos para o Card
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1C1C1C', // Fundo escuro para o card
        borderRadius: 12, // Bordas arredondadas
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        overflow: 'hidden', // Importante para o borderRadius
    },
    imageContainer: {
        width: '100%',
        height: width * 0.55, // Altura baseada na largura (aspect ratio)
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Garante que a imagem preencha a área
    },
    videoOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    videoText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF', // Título branco
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#A0A0A0', // Data cinza claro
    },
});

export default APODCard;
