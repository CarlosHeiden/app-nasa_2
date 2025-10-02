// Configuração da chave de API da NASA (APOD)
const NASA_API_KEY = "dLFQvAYzFZUXVqCQLEUFkCWTCoGOoh8KP7rNsLNw";
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";

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
 * Busca os dados da NASA APOD dos últimos 5 dias.
 * Retorna os dados com explicações originais em inglês.
 * @returns {Promise<Array<Object>>} Lista de APODs formatados.
 */
export const fetchApods = async () => {
    try {
        const endDate = getFormattedDate(0); // Hoje
        const startDate = getFormattedDate(5); // Últimos 5 dias

        const url = `${NASA_APOD_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados da NASA: ${response.status}`);
        }

        let apods = await response.json();
        apods.reverse();

        const filteredApods = apods.filter(apod =>
            apod.media_type === 'image' || (apod.media_type === 'video' && apod.url)
        );

        const formattedApods = filteredApods.map((apod) => {
            const finalUrl = apod.media_type === 'video'
                ? apod.url.replace("youtube.com/watch?v=", "youtube.com/embed/")
                : apod.url;

            return {
                ...apod,
                url: finalUrl,
                explanation: apod.explanation,
                date: apod.date,
                id: apod.date,
                displayDate: new Date(apod.date).toLocaleDateString('pt-BR'),
            };
        });

        return formattedApods;

    } catch (error) {
        console.error("Erro fatal em fetchApods:", error);
        return [];
    }
};
