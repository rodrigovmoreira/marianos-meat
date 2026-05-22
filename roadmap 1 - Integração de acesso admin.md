Roadmap 1: Integração JWT e Painel Administrativo de Aprovação
A lógica de negócio será:

O usuário digita e-mail e senha na Landing Page.

O React manda isso para o Squamata-login, que devolve um JWT válido.

O React pega esse JWT e manda para o backend do Mariano's Meat.

O Mariano's verifica: "Esse token é autêntico? O e-mail deste token está na minha coleção de Admins com status 'aprovado'?"

Passo 1: O "Guarda de Trânsito" no Backend (Middlewares e Schemas)
A primeira ação é preparar o backend para entender os tokens do Squamata e ter sua própria tabela de permissões.

1.1. Instalação do JWT: Adicionar a biblioteca jsonwebtoken no backend do Mariano's para que ele consiga ler e validar o Token gerado pelo Squamata.

1.2. Criar o Schema Admin.js: Criaremos uma nova coleção no MongoDB contendo:

email: string (único)

status: enum ('pendente', 'aprovado', 'rejeitado')

role: enum ('super_admin' para o Mariano, 'editor' para funcionários)

dataSolicitacao: Date

1.3. O Middleware de Proteção (authMiddleware.js): Criar uma função interceptadora. Antes de qualquer requisição chegar nas rotas de criação de Posts ou listagem de usuários, esse middleware vai abrir o Token JWT, ler o e-mail, buscar no banco do Mariano's e ver se o status está aprovado. Se não estiver, ele devolve erro 403 Forbidden.

Passo 2: Rotas de Gestão de Acesso no Backend
Precisamos criar os "endpoints" (URLs) que o painel administrativo vai usar para gerenciar essas pessoas.

2.1. Rota de Solicitação (POST /api/auth/solicitar): Se o login no Squamata der certo, mas o usuário não existir no banco do Mariano, o Frontend bate nessa rota para criar o usuário com status pendente.

2.2. Rota de Verificação (GET /api/auth/me): Retorna as permissões atuais do usuário logado (para o Frontend saber se mostra a tela bloqueada ou o painel completo).

2.3. Rotas de Aprovação (Protegidas por Super Admin):

GET /api/admins/pendentes -> Lista todo mundo aguardando aprovação.

PUT /api/admins/aprovar/:id -> Muda o status do usuário para aprovado.

Passo 3: A Blindagem no Frontend (Contexto e Rotas Privadas)
No React (usando Vite e Chakra UI), precisamos criar a barreira visual e o gerenciamento de estado global.

3.1. Criar o AuthContext.tsx: Um contexto global no React que vai guardar o Token JWT no localStorage e saber em tempo real se o usuário está logado ou não.

3.2. Criar o PrivateRoute.tsx: Um componente que "envelopa" as rotas administrativas no App.tsx.

Cenário A: Não tem token? Redireciona para /login.

Cenário B: Tem token, mas o backend diz que o status é "pendente"? Mostra a tela: "Seu acesso está em análise pelo administrador."

Cenário C: Aprovado? Libera o carregamento do Painel.

Passo 4: A Tela de Login (A Ponte com o Squamata)
Criar a interface onde a mágica da integração acontece.

4.1. Construir Login.tsx: Um formulário limpo e corporativo pedindo E-mail e Senha.

4.2. Integração Dupla (Fetch):

O formulário fará um POST para a porta do container do Squamata-login (ex: http://localhost:3000/api/auth/login).

Recebendo o Token do Squamata, ele salva no navegador e redireciona o usuário para o dashboard do Mariano's, onde a barreira construída no Passo 3 fará o resto.

Passo 5: Construção do Painel Administrativo Inicial (Layout e Aprovação)
Por fim, construir a "casca" do CMS e a tela onde o Bruno Mariano vai clicar em "Aprovar".

5.1. Criar o AdminLayout.tsx: Uma tela dividida. Um menu lateral esquerdo (Sidebar) fixo escuro (com Chakra UI) listando: "Visão Geral", "Aprovações", "Blog", "Configurações". E o conteúdo principal na direita.

5.2. Criar a tela Aprovacoes.tsx: Uma tabela (ou lista de Cards) que faz um fetch na nossa rota de pendentes (criada no passo 2.3) e mostra botões verdes de "Aprovar" e vermelhos de "Rejeitar".