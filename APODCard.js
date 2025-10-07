import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

// Importa um ícone simples para o vídeo (você pode precisar instalar 'react-native-vector-icons' ou usar uma imagem)
// Se não quiser instalar icons, remova a importação e o <Text> com "VÍDEO"
import { MaterialIcons } from '@expo/vector-icons'; 

const APODCard = ({ item, onPress }) => {
    // Verifica se é um vídeo para decidir o que exibir na prévia
    const isVideo = item.media_type === 'video';

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                {isVideo ? (
                    <View style={styles.videoPlaceholder}>
                        <MaterialIcons name="videocam" size={40} color="#FFF" />
                        <Text style={styles.videoText}>VÍDEO</Text>
                        <Text style={styles.videoTextTitle}>{item.title}</Text>
                    </View>
                ) : (
                    <Image
                        source={{ uri: item.url }}
                        style={styles.image}
                        // Adicione um indicador de carregamento se for complexo
                    />
                )}
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.dateText}>{item.displayDate}</Text>
                <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#505050',
    },
    videoText: {
        color: '#FFF',
        marginTop: 5,
        fontWeight: 'bold',
    },
    videoTextTitle: {
        color: '#CCC',
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 10,
        fontSize: 12,
    },
    infoContainer: {
        padding: 15,
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default APODCard;