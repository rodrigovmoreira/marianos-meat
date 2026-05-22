Passo 1: O Schema de Configuração (Backend)
Vamos criar uma coleção no MongoDB chamada Configuracao que conterá apenas um único documento global.

Campos do Schema (models/Configuracao.js):

nomeEmpresa: String

corPrincipal: String (Ex: #813532)

logoUrl: String (Link vindo do seu sistema de upload)

whatsapp: String

emailContato: String

updatedAt: Date

Passo 2: Rotas de Configuração (Backend)
O backend servirá essas informações para que o frontend "se monte" dinamicamente.

GET /api/config: Pública. O Frontend chama isso assim que a página carrega.

PUT /api/config: Protegida pelo authMiddleware (só para admins). Permite alterar as cores e o logo no banco.

Passo 3: Injeção Dinâmica no Frontend (React + Chakra UI)
Aqui está o "pulo do gato" técnico. Em vez de definir as cores no código, vamos usar o useEffect para buscar as configurações e aplicar o tema via código.

3.1. Estado Global de Configuração: Usaremos um ConfigContext.tsx que busca os dados no GET /api/config e disponibiliza para todos os componentes.

3.2. Aplicando Cores em Tempo Real: O Chakra UI v3 permite sobrescrever o tema dinamicamente.

TypeScript
// Exemplo lógico dentro do seu App ou Provider
const theme = createSystem(defaultSystem, {
  theme: {
    tokens: {
      colors: {
        brand: { value: config.corPrincipal }, // O valor vem do banco!
      },
    },
  },
})
Ao fazer isso, todos os botões ou elementos que usam colorPalette="brand" mudarão de cor automaticamente em todo o site quando o admin salvar uma nova cor no painel.

Passo 4: Painel de "Personalização" (Admin)
Na lateral do painel admin (criado no Roadmap 1), adicionaremos uma aba "Aparência".

Input de Cor: Usaremos um input type="color" para o Bruno Mariano escolher a cor da marca.

Upload de Logo: Um campo que integra com o seu Squamata-upload (Roadmap 2) para ele subir o logo e salvar a URL no campo logoUrl.

Por que esta é a melhor prática?
Sem Dívida Técnica: Você não cria um novo serviço para gerenciar, apenas uma nova rota no backend que já existe.

Escalabilidade: Se amanhã você quiser vender essa landing page para uma hamburgueria, você não toca no código. Você entra no painel, muda a logo, a cor para o tom de laranja do cliente, e o site "nasce" com a cara dele.

Performance: O fetch inicial busca apenas 1 documento pequeno (JSON). O impacto na performance é nulo.