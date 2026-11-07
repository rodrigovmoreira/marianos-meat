# MEMORY — marianos-meat

> Memória consolidada do repositório. Registra **estado atual**, **armadilhas já encontradas** e **próximos passos**.
> Não é changelog: quem ler daqui a três meses deve entender o processo, não a cronologia.
>
> - **Última atualização:** 2026-11-06
> - **Commit de referência:** `39772a4` (`feat: update API routes to include versioning and modify frontend API URL`)
> - **Branch verificada:** `backend_frontend` (limpa, sincronizada com `origin/backend_frontend`)

**Fonte de verdade em caso de divergência:** ADR > roadmap > MEMORY > spec > README.
Norma do ecossistema: [`Calango-docs`](c:/project/Calango-docs) — `constitution.md`, `Architecture.md`, `docs/spec/ai-rules.md`, `.github/copilot-instructions.md`.

---

## 1. Regras de entrega (ler antes de codar)

| Item | Regra vigente |
| --- | --- |
| Branch base do PR | **`backend_frontend`** — decisão do time: é a principal **no momento atual**, substituindo `main` enquanto a integração backend/frontend está aberta |
| Branch de trabalho | `<tipo>/<escopo-curto>` em minúsculas, ex.: `feat/roadmap1-aprovacao-acesso`, `docs/memory-estado-atual` |
| Commit | Conventional Commits + escopo, PT-BR, imperativo, sem ponto final, trailer `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` |
| Proibido | commit direto em `backend_frontend`, `git push --force` em branch com PR aberto |
| PR | branch → commit → push → PR, com corpo contendo: o que mudou, por quê, como foi verificado (saída real), riscos, pendências, links |
| Memória | este arquivo entra **no mesmo PR** da mudança |

> ⚠️ **Divergência registrada:** `Calango-docs/docs/spec/ai-rules.md` §4.1 ainda lista `main` como base do PR de `marianos-meat`. O uso de `backend_frontend` é decisão local deste repositório e deve ser atualizada naquela tabela quando a integração for mergeada.

---

## 2. Stack real do repositório

| Camada | O que está em uso | Observação |
| --- | --- | --- |
| Backend | Node.js **ESM** (`"type": "module"`), Express 5, Mongoose 9, `jsonwebtoken` 9, `dotenv` 17, `cors` | `require`/`module.exports` proibidos |
| Frontend | React 19 + **Vite 8** + Chakra UI 3 + `react-router-dom` 7 + `axios` + `react-icons` | Arquivos `.tsx` (TypeScript) |
| Banco | MongoDB | Produção na porta **27018** (servidor dedicado); o código ainda assume 27017 |
| Portas locais | backend **3020**, frontend **5175** | `3000` é proibida no ecossistema (default ambíguo) |

> ⚠️ `ai-rules.md` manda frontend em `.jsx`. Este repositório já nasceu em `.tsx` (template Vite + TS). **Manter `.tsx`** é a decisão prática até que se faça uma migração consciente — não converter arquivos de passagem.

---

## 3. Estado do backend (verificado)

```
backend/
├── server.js
└── src/
    ├── config/db.js
    ├── controllers/{authController,postController,contatoController}.js
    ├── middleware/authMiddleware.js
    ├── models/{Admin,Post,Contato}.js
    └── routes/{authRoutes,postRoutes,contatoRoutes}.js
```

| Arquivo | O que faz hoje |
| --- | --- |
| `server.js` | `dotenv` de `../.env` (relativo ao cwd = `backend/`), `connectDB()`, `cors()` aberto, `express.json()`, `GET /api/v1/health`, monta `contatoRoutes` e `postRoutes` em `/api/v1` e `authRoutes` em `/api/v1/auth` |
| `config/db.js` | `mongoose.connect(MONGO_URI \|\| 'mongodb://127.0.0.1:27017/marianos_meat')`, `process.exit(1)` se falhar |
| `models/Admin.js` | `email` (único, lowercase), `nome`, `status` (`pendente`/`aprovado`/`rejeitado`), `role` (`super_admin`/`editor`), `dataSolicitacao` |
| `middleware/authMiddleware.js` | `verificarAcesso`: exige `Bearer`, faz `jwt.verify(token, process.env.JWT_SECRET)`, lê `payload.email`, busca `Admin`, devolve **403** se não existir ou não estiver `aprovado`, injeta `req.admin` |
| `controllers/authController.js` | `solicitarAcesso` (cria pendente a partir do **body**, sem validar token), `verificarAcessoAtual`, `listarPendentes` e `gerenciarAcessoUsuario` (ambos com trava de `super_admin`) |
| `controllers/postController.js` | `listarPosts`, `buscarPostPorSlug`, `criarPost` (gera `slug` a partir do título) |

### Rotas expostas hoje

| Método | Caminho | Proteção |
| --- | --- | --- |
| GET | `/api/v1/health` | pública |
| GET | `/api/v1/posts` | pública |
| GET | `/api/v1/posts/:slug` | pública |
| POST | `/api/v1/posts` | **pública** ⚠️ |
| POST | `/api/v1/contato` | pública |
| POST | `/api/v1/auth/solicitar` | pública ⚠️ |
| GET | `/api/v1/auth/me` | `verificarAcesso` |
| GET | `/api/v1/auth/pendentes` | `verificarAcesso` + `super_admin` |
| PUT | `/api/v1/auth/aprovar/:id` | `verificarAcesso` + `super_admin` |

Caminho versionado único (`/api/v1/...`) ✅ conforme ADR 002 — sem alias legado.

---

## 4. Estado do frontend (verificado)

```
frontend/src/
├── App.tsx            # BrowserRouter + header/footer globais + <Routes>
├── main.tsx, index.css, App.css
└── pages/{Home,Blog,PostView,AdminEditor}.tsx
```

| Rota | Componente | Proteção |
| --- | --- | --- |
| `/` | `Home` | pública |
| `/blog` | `Blog` | pública |
| `/blog/:slug` | `PostView` | pública |
| `/admin/blog` | `AdminEditor` | **nenhuma** ⚠️ |

- Chamadas HTTP usam `fetch(\`${import.meta.env.VITE_API_URL}/posts\`)` em `Blog.tsx`, `PostView.tsx` e `AdminEditor.tsx`.
- **Não existe `frontend/.env`** — sem `VITE_API_URL` no Vite do frontend, a variável vem `undefined` em `npm run dev`. A chave está no `.env.example` da raiz, mas o Vite só lê `.env` dentro de `frontend/`.
- `axios` está instalado e **não é usado**.
- Nenhum header `Authorization` é enviado em lugar algum.
- Ausentes (todos previstos no roadmap 1): `AuthContext`, `PrivateRoute`, `Login`, `AdminLayout`, `Aprovacoes`.

---

## 5. Conformidade com a constituição — o que já está ok e o que viola

| Regra (Calango-docs) | Situação | Evidência |
| --- | --- | --- |
| ESM puro, sem CommonJS | ✅ | `"type": "module"` no backend |
| API só em `/api/v1/<recurso>` + `GET /api/v1/health` | ✅ | `server.js` |
| Autenticação delegada ao Squamata-Login | ✅ conceito / ⚠️ implementação | middleware só valida JWT, não emite — mas usa o segredo errado |
| Segredo compartilhado `JWT_SECRET_LOGIN` | ❌ | `authMiddleware.js` usa `process.env.JWT_SECRET` |
| Sem fallback de segredo / fail fast no boot | ❌ | não há `validateEnv`; `JWT_SECRET` ausente só estoura no primeiro request (401), não no boot |
| Validar `appSlug` + `tenantId` em toda requisição | ❌ | middleware lê apenas `email`; `Admin` não tem `tenantId` |
| Kill-switch `isActive` nos modelos de usuário | ❌ | `Admin` não possui o campo |
| `AuditLog` de login/alteração sensível | ❌ | não existe coleção nem log estruturado |
| Log de erro com serviço + operação + `appSlug`/`tenantId` | ❌ | controllers usam `console.error`/`console.log` genéricos |
| Rotas de escrita protegidas | ❌ | `POST /api/v1/posts` sem middleware |
| MongoDB produção na porta 27018 | ⚠️ | `db.js` e `.env.example` apontam 27017 |
| Segredos só em `process.env`, `.env` fora do git | ✅ | `.env` no `.gitignore`, `.env.example` versionado |
| Docker compose na rede `squamata-global` + healthcheck | ❌ | `docker-compose.yml` sem `networks` e sem `healthcheck` |
| Dockerfile multi-stage | ⚠️ | backend é single-stage com `npm install`; frontend já é multi-stage |
| Frontend em `.jsx` | ⚠️ | repo é `.tsx` (exceção prática documentada em §2) |

---

## 6. Roadmap 1 — Integração JWT e Painel de Aprovação: status real

| Passo | Entrega | Status |
| --- | --- | --- |
| 1.1 | `jsonwebtoken` no backend | ✅ instalado (`^9.0.3`) |
| 1.2 | Schema `Admin.js` | ⚠️ existe, mas **sem `isActive`/`tenantId`** e com `nome` obrigatório (o Squamata pode não enviar) |
| 1.3 | Middleware que valida JWT + status `aprovado` | ⚠️ existe, mas com **segredo errado**, **sem `appSlug`/`tenantId`** e **não aplicado em `POST /posts`** |
| 2.1 | `POST /api/v1/auth/solicitar` | ⚠️ existe, porém **confia no body** em vez de extrair `email`/`nome` do token — qualquer um cria solicitação pendente |
| 2.2 | `GET /api/v1/auth/me` | ✅ funciona (depende de admin já cadastrado; usuário novo recebe **403**, então o frontend não consegue distinguir "não cadastrado" de "pendente" pelo status HTTP) |
| 2.3 | Rotas de aprovação | ⚠️ implementadas em `/api/v1/auth/pendentes` e `/api/v1/auth/aprovar/:id`; o roadmap pedia `/api/admins/...` → o caminho canônico seria **`/api/v1/admins/...`** |
| 3.1 | `AuthContext.tsx` | ❌ não existe |
| 3.2 | `PrivateRoute.tsx` (3 cenários) | ❌ não existe |
| 4.1 | `Login.tsx` | ❌ não existe |
| 4.2 | Login via Squamata | ❌ não existe — e **não deve** ser formulário de senha local (ver §7) |
| 5.1 | `AdminLayout.tsx` | ❌ não existe |
| 5.2 | `Aprovacoes.tsx` | ❌ não existe |

---

## 7. Armadilhas que já custaram tempo

1. **O roadmap manda o React postar e-mail/senha no Squamata-Login (`http://localhost:3000/api/auth/login`).** Isso contraria `constitution.md` §1/ADR 003 e `Architecture.md` §4.2:
   - não existe login local no cliente; o fluxo é **redirect** para `http://localhost:5174/login?appSlug=marianos-meat&tenantId=default&returnUrl=http://localhost:5175`;
   - o backend do login está na **3001**, não 3000, e o caminho é `/api/v1/auth/login`;
   - o token volta no `returnUrl`.

   **Decisão:** `Login.tsx` deve ser uma tela que **redireciona para o SSO** e trata o retorno, não um formulário de credenciais.
2. **`VITE_API_URL` não existe dentro de `frontend/`** — em dev o fetch monta `undefined/posts`. Precisa de `frontend/.env` (ignorado no git) ou `define` no `vite.config.ts`.
3. **`POST /api/v1/posts` está aberto.** Proteger sem quebrar o `AdminEditor` exige, no mesmo PR, o `AuthContext` enviando `Authorization`.
4. **`dotenv.config({ path: '../.env' })` depende do cwd.** Rodar `node backend/server.js` da raiz não carrega o `.env`. Sempre subir de dentro de `backend/`.
5. **`JWT_SECRET` vs `JWT_SECRET_LOGIN`:** hoje o middleware usa `JWT_SECRET`. Se o ambiente só tiver `JWT_SECRET_LOGIN`, todo token válido vira 401 — e o sintoma parece "Squamata fora do ar". Diagnóstico correto: conferir o nome da chave **antes** de culpar o login.
6. **401 em cascata não é bug deste app.** `squamata-login` é SPOF de identidade; com ele fora, nenhum login novo acontece. Verificar `GET /api/v1/health` do login primeiro.
7. **`authMiddleware` devolve 401 genérico** para token inválido, mas 403 para não cadastrado/pendente. O frontend precisa dessa distinção para escolher entre `/login` e "acesso em análise".
8. **`GET /api/v1/auth/me` exige admin aprovado** — logo, não serve para descobrir o status de quem é `pendente`. Uma rota de leitura de status (ou `/me` validando só o token) é necessária no fluxo de aprovação.

---

## 8. Ambiente e execução

| Item | Valor |
| --- | --- |
| Backend local | `cd backend; npm run dev` → porta `PORT` (usar **3020**) |
| Frontend local | `cd frontend; npm run dev` → **5175** (`host: true` no `vite.config.ts`) |
| Squamata-Login backend | **3001** (`/api/v1/auth/login`) — subir **primeiro**, derrubar **por último** |
| Squamata-Login frontend | **5174** (`/login?appSlug=...&tenantId=...&returnUrl=...`) |
| Chaves exigidas pelo backend | `MONGO_URI`, `JWT_SECRET_LOGIN` (a implementação atual espera `JWT_SECRET`) |
| `.env.example` (raiz) | tem `MONGO_URI` (27017), `PORT`, `VITE_API_URL` — **falta `JWT_SECRET_LOGIN`** e as chaves de SSO (`VITE_SSO_URL`, `VITE_APP_SLUG`, `VITE_TENANT_ID`) |
| Docker | `frontend` 5175→80, `backend` 3005→3000; sem rede `squamata-global`, sem healthcheck |

> Nunca inventar valor de segredo. Se `JWT_SECRET_LOGIN` não estiver no ambiente, **parar e pedir a chave**.

---

## 9. Próximos passos recomendados (nesta ordem)

1. **Alinhar identidade antes de UI:** `validateEnv` no boot do backend (`MONGO_URI`, `JWT_SECRET_LOGIN`) e troca de `JWT_SECRET` → `JWT_SECRET_LOGIN` no middleware. Sem isso, todo o resto dá falso negativo em teste.
2. **Fechar a lacuna de multi-tenancy:** middleware valida `appSlug === 'marianos-meat'` e `tenantId` do token; `Admin` ganha `tenantId` (e `isActive` para o kill-switch).
3. **`POST /auth/solicitar` a partir do token**, não do body (evita criação anônima de pendentes).
4. **Separar `/api/v1/admins/*`** de `/api/v1/auth/*` (rotas de super admin), mantendo caminho único.
5. **Proteger `POST /api/v1/posts`** com `verificarAcesso` **no mesmo PR** que adiciona o header `Authorization` no frontend.
6. **Frontend:** `AuthContext` (token em `localStorage` + `GET /me`), `PrivateRoute` com os 3 cenários, `Login` como redirect para o SSO, `AdminLayout`, `Aprovacoes`.
7. **Infra:** `frontend/.env` + chaves de SSO no `.env.example`; `docker-compose` na rede `squamata-global` com healthcheck; Dockerfile multi-stage do backend.
8. **Auditoria:** coleção `AuditLog` para solicitação/aprovação/rejeição e logs com `appSlug`/`tenantId`.

---

## 10. Como verificar (não declarar sucesso sem isto)

```powershell
# 1. Login precisa estar no ar antes de testar 401 deste app
Invoke-RestMethod http://localhost:3001/api/v1/health

# 2. Backend
cd backend; npm run dev
Invoke-RestMethod http://localhost:3020/api/v1/health
Invoke-RestMethod http://localhost:3020/api/v1/posts

# 3. Guards de caminho único (devem dar 404)
try { Invoke-RestMethod http://localhost:3020/api/posts } catch { $_.Exception.Response.StatusCode.value__ }
```

- Skill oficial: [`calango-api-smoke-test`](c:/project/Calango-docs/.github/skills/calango-api-smoke-test/SKILL.md) — smoke test real contra a porta local.
- **Porta aberta não prova que a API responde.** Toda afirmação de sucesso precisa da requisição e da saída no PR.

---

## 11. Divergências de documentação a corrigir (doc drift)

| Onde | O que está errado | Correto |
| --- | --- | --- |
| `Calango-docs/docs/spec/ai-rules.md` §4.1 | `marianos-meat` → base `main` | `backend_frontend` por ora |
| `Calango-docs/.github/skills/.../references/services.md` | chave obrigatória `JWT_SECRET` | `JWT_SECRET_LOGIN` (o código também precisa migrar) |
| `.env.example` da raiz | `MONGO_URI` com 27017 e sem `JWT_SECRET_LOGIN` | 27018 em produção + chave do SSO |
| `roadmap 1` (Passo 4.2) | POST de senha direto no login, porta 3000, `/api/auth/login` | redirect SSO 5174, backend 3001, `/api/v1/auth/login` |

---

## 12. Execução do roadmap 1 (em andamento)

Plano aprovado em 2026-11-06 em 3 PRs empilhados sobre `backend_frontend`:

| PR | Branch | Escopo | Status |
| --- | --- | --- | --- |
| 1 | `feat/identidade-tenant` | Fundação de identidade (A1–A4), schema Admin (B6), logs estruturados (C2) | concluído |
| 2 | `feat/aprovacao-acesso` | Fluxo de solicitação/aprovação (B1–B5) + `AuditLog` (C1) | pendente |
| 3 | `feat/painel-admin` | Contexto, rotas privadas, login SSO e painel (D1–D5) | pendente |

Bloco **E** (porta no compose, CORS allowlist, rede `squamata-global` + healthcheck) **não foi aprovado** — segue pendente.

### O que mudou no PR 1

- `backend/src/config/env.js`: carrega o `.env` da raiz por caminho absoluto (funciona de qualquer cwd) e **aborta o boot** sem `MONGO_URI` ou `JWT_SECRET_LOGIN`.
- `authMiddleware.js`: três camadas — `verificarIdentidade` (JWT + `appSlug` + `tenantId`), `checarAprovacao` (cadastro + `isActive` + status) e `exigirSuperAdmin`. Exporta `exigirAprovacao` e `exigirSuperAdmin` como cadeias prontas para as rotas.
- Segredo passou de `JWT_SECRET` para **`JWT_SECRET_LOGIN`**.
- `Admin`: `tenantId`, `loginSubject` (claim `sub`), `email` opcional, `isActive`, `timestamps`; índices únicos **por tenant**. `dataSolicitacao` foi substituído por `createdAt`.
- `src/app.js` (fábrica sem banco/listen) + `server.js` só como bootstrap. Handler global de erro e 404 com formato `{ success: false, error: { code, message } }`.
- `postController`/`contatoController` delegam erro ao handler e logam com contexto.

### Premissas a confirmar com o Squamata-Login

1. **`sub` carrega o e-mail** do usuário. Se for um ObjectId, o Admin só será encontrado por `loginSubject` (o vínculo já existe) — e o `email` fica nulo até alguém informar.
2. Claims `appSlug` e `tenantId` vêm no payload do JWT (não em header).

### Armadilhas encontradas nesta execução

- **Sem `JWT_SECRET_LOGIN` o boot morre por design.** O `.env` local deste repositório **não tem** essa chave — foi preciso injetá-la por variável de ambiente para testar. Sem ela, `npm run dev` aborta com `Boot abortado`.
- **O `.env` local está com `PORT` e `VITE_API_URL` desalinhados** com o padrão do ecossistema (3020). O `.env.example` já foi atualizado; o `.env` real precisa ser ajustado por quem tem o segredo.
- **MongoDB de produção responde** (via `MONGO_URI` remoto) — não é preciso Mongo local para testar, mas **o Squamata-Login (3001) não está no ar**, então não há token real. Testes autenticados usaram token assinado localmente com segredo de teste.
- `dotenv` não sobrescreve variável já existente no ambiente: isso permite injetar valores de teste sem tocar no `.env`.
