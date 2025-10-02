Documentação Breve do Projeto App-NASA
Este documento explica os requisitos de entrega do projeto acadêmico de Explorador de APIs Públicas com React Native, conforme solicitado no Item 4.

1. Escolha da API: NASA Astronomy Picture of the Day (APOD)
A API escolhida é a Astronomy Picture of the Day (APOD), fornecida pela NASA.

Razões para a Escolha:
A APOD é uma API pública robusta e amplamente utilizada, ideal para demonstrar consumo de dados em um projeto acadêmico.
Mas fator mais importante o desenvolvedor adora  ficcao cientifica, nada mais interessante no mundo  das api's  que uma api sobre o espaco

Conteúdo Visual: A API fornece imagens e vídeos de alta qualidade, o que permitiu focar na Criatividade na Interface e Experiência do Usuário (Item 5), um dos critérios de avaliação.

Variedade de Mídia: A APOD retorna tanto URLs de imagens quanto embeds de vídeo (YouTube), exigindo o uso de componentes diferentes (<Image> e <WebView>), o que enriquece a complexidade técnica do aplicativo.

2. Estrutura do Aplicativo
O projeto segue uma arquitetura modular, onde todas as classes de código-fonte foram movidas para a raiz do projeto para simplificar a resolução de módulos (após enfrentar desafios iniciais com caminhos relativos).

Arquivo/Módulo

Tipo

Responsabilidade

App.js

Configuração

Contém a configuração do React Navigation (Native Stack), gerenciando a navegação entre as duas telas principais. Define o estilo padrão do cabeçalho.

APODListScreen.js

Tela

Tela de Consulta. Responsável por buscar os dados da APOD, gerenciar estados de loading e error e renderizar a lista de cards via FlatList.

APODDetailScreen.js

Tela

Tela de Detalhes. Recebe o objeto APOD via navegação (route.params.item) e exibe o título, data, mídia (Image/WebView) e a explicação completa em um ScrollView.

APODCard.js

Componente

Componente de interface reutilizável para cada item na FlatList. Exibe a thumbnail e o título, e trata o evento de toque (onPress) para navegar.

nasa.js

Serviço

Lógica da API. Contém a função fetchApods() que faz a requisição HTTP (usando a key da NASA), formata o intervalo de datas (últimos 30 dias) e trata a resposta JSON.

3. Desafios Enfrentados e Soluções
O desenvolvimento do projeto passou por desafios comuns em React Native, todos resolvidos com sucesso:

O bundler do Expo falhou consistentemente ao resolver caminhos relativos (./screens/... ou ../api/...). Solução: O projeto foi refatorado, e todos os arquivos de código (Telas, Componentes, API) foram movidos para a raiz do projeto.

TypeError: Cannot read property 'item' of undefined

Ocorreu um crash na inicialização, pois o React tentava acessar o estado de forma incorreta na APODListScreen.js. A linha de estado estava como: const [isLoading, setIsLoading] = setIsLoading(true);.

Solução: O estado foi corrigido para a sintaxe padrão do Hook useState: const [isLoading, setIsLoading] = useState(true);.



Visualização de Vídeos (Mídia Mista)

A API APOD retorna tanto imagens (image) quanto vídeos (video).

Solução: Foi implementada uma lógica de verificação de media_type na APODDetailScreen.js. Para vídeos, foi utilizado o componente WebView (requerendo a instalação de react-native-webview) para embeddar o player do YouTube, e para imagens, o componente nativo Image.



Aparência/Estilização

Para garantir o apelo visual, foi adotado um tema escuro consistente (#0A0A0A e #E0E0E0) e componentes de sugestão foram utilizados, como FlatList (com RefreshControl para recarregar a lista) e SafeAreaView.

4. Requisitos Técnicos Atendidos
O projeto final demonstrou o atendimento integral aos requisitos técnicos:

React Navigation: Utilizado para navegar entre APODListScreen e APODDetailScreen.

Duas Telas: A Tela de Consulta lista os APODs, e a Tela de Detalhes exibe o conteúdo completo.

Consumo de API: Os dados são consumidos com sucesso do serviço da NASA e exibidos.

Este documento encerra a documentação breve solicitada para o projeto.