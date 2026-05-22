Roadmap 3: Motor de Temas Dinâmicos (White-Label)
A Lógica de Negócio:
O objetivo aqui é permitir que o dono do site altere a identidade visual (logo, cores, número de contato) sem que você precise abrir o código no VS Code ou realizar um novo deploy no servidor.

Passo 1: O Schema de Configuração (Backend)
Vamos criar uma coleção no MongoDB chamada Configuracao. A regra de ouro aqui é que essa coleção sempre terá apenas 1 único documento (o documento global do site).

Criar o Schema (Configuracao.js):

nomeEmpresa: String (ex: "Mariano's Meat")

corPrincipal: String (ex: "#813532")

logoUrl: String (Link vindo do seu sistema de upload)

whatsapp: String

A Rota Pública (GET /api/config): Uma rota super rápida, sem autenticação, que o frontend vai chamar assim que o usuário abrir o site para saber como se "pintar".

A Rota Privada (PUT /api/config): Rota protegida pelo JWT (do Roadmap 1) para o administrador atualizar esses dados.

Passo 2: O Frontend "Camaleão" (React + Chakra UI)
O seu código React atual tem as cores (#813532ff) e o logo chumbados (hardcoded) direto no arquivo. Vamos tornar isso dinâmico.

O Fetch Inicial (O Estado Global): No seu App.tsx (ou em um Contexto), faremos uma requisição para /api/config assim que a página carregar.

Injeção de Cores Dinâmicas: O Chakra UI permite sobrescrever variáveis CSS ou o tema em tempo real. Nós pegaremos a corPrincipal que veio do banco e aplicaremos nos botões e no fundo do Header. Assim, se o cliente mudar para "Verde", todos os botões de "Fazer Pedido" e links mudarão automaticamente.

Troca de Variáveis: Nos locais onde o logo da Mariano's Meat é chamado, usaremos a variável <Image src={config.logoUrl} />. O mesmo vale para o link de WhatsApp no botão de pedido.

Passo 3: O Painel de Personalização (Admin UI)
Na barra lateral do painel admin (que desenhamos no Roadmap 1), adicionaremos uma aba chamada "Aparência & Contato".

Input de Cor: Usaremos um input nativo (type="color") para o Bruno Mariano abrir aquela paleta visual e escolher a cor da marca com o mouse.

Upload de Logo: Um campo que integra diretamente com o fluxo do Squamata-upload (do Roadmap 2) para ele subir o logo do computador dele, gerando o link que será salvo.