Roadmap 2: Sistema de Uploads de Imagens (Squamata-upload + Firebase)
A lógica de negócio (O Fluxo Perfeito):

O Bruno Mariano entra no Painel Admin e escolhe a foto de uma Picanha.

O Frontend (React) pega essa imagem física e manda um POST direto para o seu Squamata-upload.

O Squamata-upload processa, joga no Firebase, pega o link público (ex: https://firebasestorage.../picanha.jpg) e devolve para o Frontend.

O Frontend, com o link em mãos, manda os dados de texto (Nome: Picanha, Preço: 89,90, ImagemUrl: [link do firebase]) para o backend do Mariano's Meat.

O backend do Mariano salva apenas a String (o texto do link) no MongoDB, mantendo o banco extremamente leve.

Passo 1: Preparação do Squamata-upload
Garantir que o microsserviço está no ar e pronto para receber requisições do painel do Mariano.

1.1. Subir o Container: Adicionar o Squamata-upload no seu ambiente local (ou no Optiplex) rodando na porta específica dele (ex: 3001) e garantir que o .env dele está com as credenciais do Firebase ativas.

1.2. Configuração de CORS: Certificar-se de que o Squamata-upload aceita requisições do domínio do frontend do Mariano's Meat (http://localhost:5175 ou o domínio final).

Passo 2: O Componente de Upload no Frontend (React)
O navegador precisa saber lidar com arquivos físicos (objetos do tipo File) antes de enviá-los.

2.1. Criar o botão de Upload (Chakra UI): Fazer um componente visual agradável onde o usuário pode clicar ou arrastar uma imagem. Vamos usar um input type="file" escondido atrás de um botão bonitão do Chakra UI.

2.2. Lógica de FormData: Arquivos de imagem não podem ser enviados como JSON normal. Criaremos uma função no React que pega o arquivo, encapsula em um objeto FormData e faz o fetch ou axios apontando para o seu container do Squamata-upload.

2.3. Estado de Loading: Fazer o upload de uma imagem demora alguns segundos. Precisamos colocar um Spinner no botão para o Bruno Mariano não clicar 10 vezes achando que travou.

Passo 3: Adaptação dos Schemas no Backend (Mariano's Meat)
O backend da casa de carnes não vai encostar na imagem, ele só quer saber a URL.

3.1. Criar Schema de Produtos (Product.js): Criar a coleção no MongoDB com os campos:

nome: String

descricao: String

preco: Number

imagemUrl: String (Aqui vai o link do Firebase)

3.2. Atualizar Configurações (Config.js): O Schema global da Landing Page vai ganhar os campos logoHeroUrl e logoFooterUrl.

Passo 4: Exibição Dinâmica na Landing Page (O Resultado Final)
Depois de salvar as imagens e os produtos no banco de dados, precisamos fazer o site "ganhar vida".

4.1. Substituir os Mocks: Ir no arquivo Home.tsx que fizemos no roadmap anterior e trocar aquela lista estática (const products = [...]) por uma requisição GET /api/produtos no backend.

4.2. Injeção de Imagem: Fazer o componente <Image src={produto.imagemUrl} /> puxar a imagem diretamente da nuvem, de forma dinâmica.