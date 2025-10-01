/**
 * ARQUIVO: nasa.js
 * DESCRIÇÃO: Serviço de consumo da API 'Astronomy Picture of the Day (APOD)' da NASA.
 * Responsável por montar a URL, fazer a requisição HTTP e tratar a resposta.
 * * Refatorado para a Raiz: O nome do arquivo foi simplificado.
 */

// Chave da API da NASA fornecida pelo aluno
const NASA_API_KEY = 'dLFQvAYzFZUXVqCQLEUFkCWTCoGOoh8KP7rNsLNw';
// URL base para a API APOD
const APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

/**
 * Função utilitária para formatar uma data como 'YYYY-MM-DD'.
 * @param {Date} date - Objeto Date a ser formatado.
 * @returns {string} Data formatada.
 */
const formatDate = (date) => {
    const year = date.getFullYear();
    // getMonth() retorna 0-11. Adiciona 1 e formata com zero à esquerda.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // getDate() retorna o dia, formatado com zero à esquerda.
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Função para buscar os dados APOD dos últimos 30 dias.
 * A API da NASA é chamada com um intervalo de datas.
 * @returns {Promise<Array<Object>>} Uma Promise que resolve para um array de objetos APOD.
 * @throws {Error} Se a requisição falhar ou a resposta for inválida.
 */
export const fetchApods = async () => {
    // 1. Calcula a data final (hoje)
    const endDate = new Date();
    
    // 2. Calcula a data inicial (30 dias atrás)
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 dias, incluindo hoje.

    // 3. Formata as datas para a URL da API
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // 4. Monta a URL completa com a chave e o intervalo
    const url = `${APOD_BASE_URL}?api_key=${NASA_API_KEY}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

    console.log(`Buscando dados da URL: ${url}`);
    
    try {
        const response = await fetch(url);

        // Verifica se a resposta HTTP é bem-sucedida (status 200)
        if (!response.ok) {
            // Tenta obter a mensagem de erro do corpo da resposta
            const errorData = await response.json();
            const errorMessage = errorData.msg || `Erro HTTP: ${response.status}`;
            throw new Error(`Falha ao carregar dados da NASA: ${errorMessage}`);
        }

        const data = await response.json();

        // A API APOD retorna um array de objetos (um para cada dia no intervalo)
        // Inverte a ordem para que os mais recentes apareçam primeiro na lista.
        const sortedData = data.reverse().map((item, index) => ({
            // Adiciona um ID único para o FlatList e mantém as propriedades originais
            id: item.date || index.toString(), // Usa a data como ID ou índice como fallback
            ...item,
            // Normaliza a data para exibição
            displayDate: new Date(item.date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }));

        // Filtra quaisquer itens que não sejam imagens ou vídeos (como 'audio' ou 'other')
        const filteredData = sortedData.filter(item => 
            item.media_type === 'image' || item.media_type === 'video'
        );

        return filteredData;

    } catch (error) {
        // Lança um erro mais amigável para a UI
        throw new Error(`Não foi possível conectar ao servidor da NASA. Verifique sua rede. Detalhe: ${error.message}`);
    }
};
