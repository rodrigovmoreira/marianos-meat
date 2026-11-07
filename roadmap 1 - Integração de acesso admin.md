# Roadmap 1 — Integração JWT e Painel Administrativo de Aprovação

> **Status:** implementado em 2026-11-06 em 3 PRs empilhados sobre `backend_frontend`:
> [#1 identidade/tenant](https://github.com/rodrigovmoreira/marianos-meat/pull/1) → [#2 aprovação/auditoria](https://github.com/rodrigovmoreira/marianos-meat/pull/2) → [#3 painel admin](https://github.com/rodrigovmoreira/marianos-meat/pull/3).
> Evidências, armadilhas e decisões: [`MEMORY.md`](./MEMORY.md) §12. Pendências: **§6** abaixo.

## 0. Como o fluxo ficou (e o que mudou em relação ao plano original)

| Plano original | Implementado | Motivo |
| --- | --- | --- |
| Usuário digita e-mail e senha na landing page | Redirect para o Squamata-Login (`5174/login?appSlug=marianos-meat&tenantId=default&returnUrl=...`) e retorno com o token | ADR 003 / Architecture §4.2: emissor único, o cliente não autentica |
| `POST /api/auth/solicitar` | `POST /api/v1/auth/solicitar` | ADR 002: caminho versionado único |
| `GET /api/auth/me` | `GET /api/v1/auth/me` | ADR 002 |
| `GET /api/admins/pendentes` e `PUT /api/admins/aprovar/:id` | `GET /api/v1/admins/pendentes` e `PATCH /api/v1/admins/:id/status` | ADR 002 + `PATCH` cobre aprovar/rejeitar/reverter e é idempotente |
| Um middleware `verificarAcesso` para tudo | Três camadas: identidade, aprovação, super admin | `/solicitar` e `/me` precisam funcionar com usuário **pendente** |
| Validação pelo `email` do token | Identidade por `sub` (com fallback por `email`) | contrato do token do Squamata-Login |
| — | Seed do primeiro super admin | sem uma semente inicial ninguém aprova ninguém |

---

## 1. Passo 1 — O "guarda de trânsito" no backend ✅

**1.1. `jsonwebtoken`** — instalado (`^9.0.3`).

**1.2. Schema `Admin`** — `backend/src/models/Admin.js`:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `tenantId` | string, obrigatório | default `DEFAULT_TENANT_ID` (`default`) |
| `loginSubject` | string | identidade canônica (claim `sub`) |
| `email` | string, opcional | preenchido quando o token traz o claim |
| `nome` | string, opcional | exibição no painel |
| `status` | `pendente` \| `aprovado` \| `rejeitado` | default `pendente` |
| `role` | `super_admin` \| `editor` | default `editor` |
| `isActive` | boolean | kill-switch: `false` → 403 imediato |
| `createdAt` / `updatedAt` | datas | `timestamps: true` (substitui `dataSolicitacao`) |

Índices únicos **por tenant**: `{ tenantId, loginSubject }` e `{ tenantId, email }` (parciais, ignoram nulos).

**1.3. Middlewares** — `backend/src/middleware/authMiddleware.js`:

| Camada | O que exige | Usada em |
| --- | --- | --- |
| `verificarIdentidade` | JWT válido com `JWT_SECRET_LOGIN`, `sub` presente, `appSlug === 'marianos-meat'` e `tenantId` | `/auth/solicitar`, `/auth/me` |
| `exigirAprovacao` | tudo acima + Admin cadastrado, `isActive !== false` e `status === 'aprovado'` | `POST /posts` |
| `exigirSuperAdmin` | tudo acima + `role === 'super_admin'` | todas as rotas de `/admins` |

Códigos de erro devolvidos (formato `{ success: false, error: { code, message } }`):
`TOKEN_AUSENTE`, `TOKEN_INVALIDO`, `APP_NAO_AUTORIZADO`, `TENANT_AUSENTE`, `NAO_CADASTRADO`, `PENDENTE`, `REJEITADO`, `CONTA_INATIVA`, `SEM_PERMISSAO`.

Boot **fail fast** em `backend/src/config/env.js`: sem `MONGO_URI` ou `JWT_SECRET_LOGIN` o serviço não sobe.

---

## 2. Passo 2 — Rotas de gestão de acesso ✅

| Método | Caminho | Proteção | Função |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/solicitar` | identidade | cria solicitação `pendente` a partir do **token** (body ignorado); repetir devolve 200 |
| GET | `/api/v1/auth/me` | identidade | **200** com `access: { registered, status, role, isActive, canAccessPanel }` |
| GET | `/api/v1/admins` | super admin | lista admins do tenant (`?status=`) |
| GET | `/api/v1/admins/pendentes` | super admin | fila de aprovação |
| PATCH | `/api/v1/admins/:id/status` | super admin | `{ status: 'aprovado' \| 'rejeitado' \| 'pendente' }` |

Regras aplicadas: status inválido → 400 `STATUS_INVALIDO`; id inválido → 400 `ID_INVALIDO`; admin de outro tenant → 404; auto-revogação do próprio super admin → 400 `OPERACAO_INVALIDA`.

Cada evento (`acesso.solicitado`, `acesso.aprovado`, `acesso.rejeitado`, `acesso.reenviado_para_analise`) é gravado em `AuditLog` com `appSlug`, `tenantId`, IP e ator.

**Seed:** `npm run seed:super-admin` (em `backend/scripts/seed-super-admin.js`) cria/promove o primeiro `super_admin` a partir de `SUPER_ADMIN_EMAIL` — sem isso ninguém consegue aprovar ninguém.

---

## 3. Passo 3 — Blindagem no frontend ✅

- `context/AuthContext.tsx` (provider) + `context/auth-context.ts` (contexto e `useAuth`): token em `localStorage`, `refresh()` via `/auth/me`, `signOut`, 401 descarta a sessão.
- `components/PrivateRoute.tsx` cobre **seis** cenários:

| Cenário | Comportamento |
| --- | --- |
| sem token | redireciona para `/login` |
| sem cadastro | chama `/auth/solicitar` automaticamente e mostra "registrando solicitação" |
| `pendente` | tela "Seu acesso está em análise" + botão atualizar |
| `rejeitado` | tela de solicitação não aprovada |
| `isActive === false` | tela de conta desativada |
| aprovado | libera o painel |

- `lib/api.ts`: instância axios com `Authorization` automático e contrato de erro tipado (fonte única para o painel).

---

## 4. Passo 4 — Tela de login ✅ (como redirect, não formulário)

`pages/Login.tsx` monta a URL do Squamata-Login com `appSlug`, `tenantId` e `returnUrl`, redireciona e, no retorno, `lib/sso.ts` captura o token (query ou hash), guarda em `localStorage` e limpa a URL.

**Não existe formulário de credenciais neste app** — nenhuma senha passa pelo Mariano's Meat.

---

## 5. Passo 5 — Painel administrativo ✅

- `components/AdminLayout.tsx`: sidebar escura fixa com Visão Geral, Aprovações, Blog e Configurações; identificação do usuário; botões "Ver site" e "Sair". O painel não herda o header/footer do site (rotas separadas em `App.tsx`).
- `pages/admin/Dashboard.tsx`: papel do usuário + contador de pendentes (só para super admin) + atalhos.
- `pages/admin/Aprovacoes.tsx`: lista `GET /admins/pendentes` em cards e aprova/rejeita via `PATCH /admins/:id/status`.
- `pages/AdminEditor.tsx`: agora protegido e usando `api` (token automático).
- `pages/admin/Configuracoes.tsx`: placeholder para os roadmaps 3 e 4.

---

## 6. Pendências (o que ainda falta)

1. **`JWT_SECRET_LOGIN` no `.env` da raiz** — hoje o backend aborta o boot. A chave precisa ser copiada do `squamata-login` (idêntica à de Calango-Bot/Calango-Food). Ver `MEMORY.md` §13.
2. **Smoke test com token real do SSO** — o fluxo autenticado foi provado com token assinado localmente (22 verificações); com o Squamata-Login no ar (3001/5174) falta repetir o teste ponta a ponta.
3. **Rodar o seed do super admin no ambiente** (`SUPER_ADMIN_EMAIL`) e validar o primeiro acesso real.
4. **Infra (bloco E, não aprovado no escopo):** `docker-compose` sem rede `squamata-global` e sem healthcheck; backend exposto em `3005` (colide com `squamata-upload`); CORS aberto (`cors()` sem allowlist).
5. **Confirmar com o Squamata-Login:** (a) o claim `sub` carrega o e-mail do usuário; (b) o token volta na `returnUrl` como `?token=` ou `#token=`.