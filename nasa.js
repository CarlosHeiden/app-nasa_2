/**
 * ARQUIVO: nasa.js
 * DESCRIÇÃO: Funções utilitárias para consumir a API Astronomy Picture of the Day (APOD) da NASA.
 * CONFIGURAÇÃO: Busca os dados dos últimos 15 dias.
 * TRADUÇÃO: Lógica de tradução removida para evitar erros de rede/cobrança.
 */

// Configuração da chave de API da NASA (APOD)
// ATENÇÃO: Esta é uma chave de demonstração. Em produção, use sua chave ou oculte-a.
const NASA_API_KEY = "dLFQvAYzFZUXVqCQLEUFkCWTCoGOoh8KP7rNsLNw";
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";

// Define a quantidade de dias para buscar a partir de hoje
const DAYS_TO_FETCH = 15; 

/**
 * Função utilitária para converter uma data subtraindo um número específico de dias.
 * @param {number} days - Número de dias a subtrair.
 * @returns {string} Data no formato 'YYYY-MM-DD'.
 */
const getFormattedDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Busca os dados da NASA APOD dos últimos 15 dias.
 * Retorna os dados com explicações originais em inglês.
 * @returns {Promise<Array<Object>>} Lista de APODs formatados.
 */
export const fetchApods = async () => {
    try {
        const endDate = getFormattedDate(0); // Hoje
        const startDate = getFormattedDate(DAYS_TO_FETCH); // Últimos 15 dias

        const url = `${NASA_APOD_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
        console.log(`Buscando APODs de ${startDate} até ${endDate}...`);
        
        const response = await fetch(url);

        if (!response.ok) {
            // Lança um erro se a resposta HTTP não for 200 (OK)
            throw new Error(`Erro ao buscar dados da NASA: Status ${response.status}`);
        }

        let apods = await response.json();
        
        // A API da NASA retorna em ordem ascendente (data mais antiga primeiro).
        // Invertemos para que as imagens mais recentes apareçam primeiro na lista.
        apods.reverse(); 

        // Filtra resultados para manter apenas imagens e vídeos com URL válida
        const filteredApods = apods.filter(apod =>
            apod.media_type === 'image' || (apod.media_type === 'video' && apod.url)
        );

        // Formata os dados
        const formattedApods = filteredApods.map((apod) => {
            // Ajusta URLs de vídeo do YouTube para o formato 'embed' compatível com WebViews/IFrames
            const finalUrl = apod.media_type === 'video'
                ? apod.url.replace("youtube.com/watch?v=", "youtube.com/embed/")
                : apod.url;

            return {
                ...apod,
                url: finalUrl,
                explanation: apod.explanation, // Explicação original (em Inglês)
                date: apod.date,
                id: apod.date, // Usado como keyExtractor na FlatList
                // Formata a data para exibição em Português-BR
                displayDate: new Date(apod.date).toLocaleDateString('pt-BR'),
            };
        });

        return formattedApods;

    } catch (error) {
        console.error("Erro fatal em fetchApods:", error);
        // Retorna um array vazio em caso de falha para evitar quebrar a FlatList
        return []; 
    }
};