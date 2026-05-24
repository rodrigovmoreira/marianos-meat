Roadmap 4: O Coração do CMS (Ferramentas de Conteúdo)
Este roadmap será executado após a infraestrutura base (Roadmaps 1 a 3) estar rodando, pois ele dependerá do Login (R1) e do Upload de Imagens (R2).

Passo 1: Módulo de Gestão de Produtos (Açougue)

Backend: Criação do Schema Produto.js (Nome, Descrição, Preço por Kg, Categoria, imagemUrl). Endpoints de CRUD completo (GET, POST, PUT, DELETE).

Frontend Admin: Uma tela com uma tabela listando as carnes cadastradas. Um botão "Adicionar Novo Corte" que abre um modal com formulário (com campo de upload de foto).

Frontend Público: O arquivo Home.tsx passará a ler esses dados do banco e montará os cards dinamicamente.

Passo 2: Módulo de Gestão de Receitas

Backend: Schema Receita.js (Título, Tempo de Preparo, Ingredientes, Modo de Preparo, imagemUrl).

Frontend Admin: Formulário focado em passos para a receita. Onde o Mariano pode cadastrar sua famosa "Picanha Invertida".

Frontend Público: Atualização da seção de receitas na Home para puxar essas dicas dinâmicas.

Passo 3: Aprimoramento do Módulo de Blog

Nós já temos o "esqueleto" do Blog salvo no banco, mas agora adicionaremos a funcionalidade de "Editar" e "Excluir" publicações no painel.

Substituiremos o <Textarea> simples por um componente de Rich Text Editor (como o React Quill), permitindo que ele coloque textos em negrito, listas e imagens no meio da publicação.