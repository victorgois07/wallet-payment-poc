# Wallet Payment PoC

Proof of Concept de um fluxo completo de pagamento com cartao de credito, desenvolvido como case tecnico para Senior Full Stack Developer (Riachuelo/Midway).

## Stack Tecnologica

| Camada    | Tecnologia                                               |
| --------- | -------------------------------------------------------- |
| Monorepo  | Nx + Bun                                                 |
| Backend   | NestJS, TypeORM, better-sqlite3, Cockatiel, Pino         |
| Frontend  | React Native CLI, NativeWind v4, Zustand, TanStack Query |
| Shared    | Zod, TypeScript strict                                   |
| Testes    | Vitest, Supertest                                        |
| Qualidade | Biome (linter + formatter)                               |

## Arquitetura

```
wallet-payment-poc/
├── apps/
│   ├── api/                        # NestJS Backend (BFF)
│   │   └── src/
│   │       ├── presentation/       # Controllers, Middleware, Interceptors, Filters
│   │       ├── application/        # CQRS: Commands, Queries, Events, Handlers
│   │       ├── domain/             # Entities, Value Objects, Enums, Interfaces
│   │       ├── infrastructure/     # TypeORM repos, Mock services, Resilience
│   │       └── config/             # Env validation (Zod)
│   └── mobile/                     # React Native App
│       └── src/
│           ├── components/         # Atomic Design (atoms/molecules/organisms)
│           ├── features/           # Feature-first screens
│           ├── hooks/              # TanStack Query hooks
│           ├── stores/             # Zustand state
│           ├── services/           # API client + SSE
│           ├── navigation/         # React Navigation stacks
│           └── theme/              # Design tokens
└── libs/
    └── shared/                     # Tipos, validacoes, constantes compartilhados
        └── src/
            ├── types/              # DTOs, enums (PaymentStatus, StepName)
            ├── utils/              # Validacao Luhn, expiration, CVV
            └── constants/          # Payment steps metadata
```

## Getting Started

### Pre-requisitos

| Ferramenta          | Versao minima | Verificar com          |
| ------------------- | ------------- | ---------------------- |
| **Node.js**         | >= 22         | `node -v`              |
| **Bun**             | >= 1.0        | `bun -v`               |
| **Xcode** (iOS)     | >= 15         | `xcodebuild -version`  |
| **CocoaPods** (iOS) | >= 1.14       | `pod --version`        |
| **Android Studio**  | Latest        | Android SDK + emulador |

> Siga o guia oficial [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) do React Native para configurar iOS e/ou Android.

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd wallet-payment-poc
bun install
```

### 2. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

Todas as variaveis possuem valores padrao e podem ser usadas sem alteracao:

| Variavel               | Default                 | Descricao                              |
| ---------------------- | ----------------------- | -------------------------------------- |
| `API_PORT`             | `3000`                  | Porta do servidor                      |
| `API_HOST`             | `0.0.0.0`               | Host do servidor                       |
| `API_PREFIX`           | `v1`                    | Prefixo de versionamento               |
| `CORS_ORIGINS`         | `http://localhost:8081` | Origens CORS permitidas                |
| `THROTTLE_TTL`         | `60000`                 | Janela de rate limit (ms)              |
| `THROTTLE_LIMIT`       | `10`                    | Requests por janela                    |
| `DB_TYPE`              | `sqlite`                | Tipo do banco                          |
| `DB_DATABASE`          | `wallet.sqlite`         | Arquivo SQLite                         |
| `LOG_LEVEL`            | `info`                  | Nivel de log (Pino)                    |
| `PAYMENT_STRATEGY`     | `parallel`              | Estrategia: `parallel` ou `sequential` |
| `PAYMENT_FAILURE_RATE` | `0.1`                   | Taxa de falha simulada (0-1)           |

### 3. Instalar pods (apenas iOS)

```bash
cd apps/mobile/ios && pod install && cd -
```

### 4. Rodar o projeto

**API + Mobile juntos (recomendado):**

```bash
bun run dev:ios       # API + iOS em paralelo
bun run dev:android   # API + Android em paralelo
```

Estes scripts usam `concurrently` para iniciar a API e o app mobile simultaneamente.

**Separadamente:**

```bash
# Terminal 1 — Backend
bun run api:dev
# Servidor em http://localhost:3000 | Health check: GET /health

# Terminal 2 — Mobile
bun run mobile:ios      # ou mobile:android
```

### 5. Rodar testes

```bash
bun run test                              # Todos os testes (via Nx)
bun run api:test                          # API: unitarios + integracao

# Granular
cd apps/api && npx vitest run test/unit          # Apenas unitarios da API
cd apps/api && npx vitest run test/integration   # Apenas e2e da API
cd libs/shared && npx vitest run                 # Lib compartilhada
```

**Cobertura total:** 56 testes (17 shared + 30 unit + 9 e2e)

### 6. Scripts disponiveis

| Script              | Descricao                                    |
| ------------------- | -------------------------------------------- |
| `bun run dev:ios`   | API + mobile iOS em paralelo                 |
| `bun run dev:android` | API + mobile Android em paralelo           |
| `bun run api:dev`   | Apenas a API (dev mode)                      |
| `bun run api:build` | Build da API (compila shared + nest build)   |
| `bun run api:test`  | Testes da API                                |
| `bun run mobile:ios` | Apenas o app iOS                            |
| `bun run mobile:android` | Apenas o app Android                    |
| `bun run mobile:start` | Metro bundler                              |
| `bun run test`      | Todos os testes do monorepo                  |
| `bun run check`     | Biome lint + format check                    |
| `bun run lint:fix`  | Biome auto-fix                               |
| `bun run typecheck` | TypeScript type check (API + mobile)         |

## Endpoints da API

| Metodo | Rota                                 | Descricao                    |
| ------ | ------------------------------------ | ---------------------------- |
| `GET`  | `/health`                            | Health check                 |
| `POST` | `/v1/payments`                       | Criar pagamento              |
| `GET`  | `/v1/payments`                       | Listar pagamentos (paginado) |
| `GET`  | `/v1/payments/:transactionId`        | Buscar pagamento por ID      |
| `GET`  | `/v1/payments/:transactionId/events` | SSE - eventos real-time      |

### Exemplo: Criar Pagamento

```bash
curl -X POST http://localhost:3000/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4532015112830366",
    "expirationDate": "12/30",
    "cvv": "123",
    "cardholderName": "JOHN DOE",
    "amount": 100.00
  }'
```

**Resposta (201):**

```json
{
  "transactionId": "txn_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "status": "approved",
  "totalTimeMs": 2100,
  "strategy": "parallel",
  "steps": [
    { "step": "account_validation", "timeMs": 520 },
    { "step": "card_validation", "timeMs": 420 },
    { "step": "anti_fraud", "timeMs": 820 },
    { "step": "acquirer_processing", "timeMs": 860 },
    { "step": "payment", "timeMs": 950 },
    { "step": "notification", "timeMs": 250 }
  ]
}
```

**Erro (RFC 7807 Problem Details):**

```json
{
  "type": "https://api.wallet.com/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "cardNumber must be a valid credit card number"
}
```

## Decisoes Tecnicas

### 1. Layered Architecture + CQRS

O backend segue uma arquitetura em camadas (Presentation → Application → Domain → Infrastructure) com separacao CQRS:

- **Commands**: `CreatePaymentCommand` → side effects (escrita)
- **Queries**: `GetPaymentQuery`, `ListPaymentsQuery` → leitura
- **Events**: `PaymentStepCompletedEvent`, `PaymentCompletedEvent` → desacoplamento

O bus de eventos do NestJS (`@nestjs/cqrs`) permite extensibilidade (ex: adicionar auditoria sem alterar o command handler).

### 2. Pipeline de Pagamento — Paralelizacao

O pipeline executa 6 etapas simuladas com delays aleatorios:

| Etapa               | Delay (ms) | Grupo Paralelo |
| ------------------- | ---------- | -------------- |
| account_validation  | 450-730    | 1              |
| card_validation     | 500-750    | 1              |
| anti_fraud          | 700-1500   | 1              |
| acquirer_processing | 800-1300   | 2              |
| payment             | 600-1200   | 2              |
| notification        | 200-300    | 3 (sequencial) |

**Strategy Pattern** com duas implementacoes:

- **`SequentialPipelineStrategy`**: executa etapas uma a uma (~3.2-5.8s)
- **`ParallelPipelineStrategy`**: agrupa etapas independentes com `Promise.all` (~1.9-3.5s, **~40% mais rapido**)

A estrategia e configuravel via env (`PAYMENT_STRATEGY`), com factory (`PipelineFactory`) para injecao de dependencia.

### 3. Resiliencia (Cockatiel)

Cada etapa do pipeline e envolvida por uma politica de resiliencia com:

- **Retry**: 3 tentativas com backoff exponencial (200ms base)
- **Circuit Breaker**: abre apos 3 falhas consecutivas, half-open apos 10s
- **Timeout**: 5s por tentativa individual

A composicao usa `Policy.wrap()` do Cockatiel para encadear as 3 politicas em uma unica execucao.

### 4. Value Objects (Domain-Driven Design)

Os Value Objects encapsulam regras de negocio e validacao:

- **`Money`**: arredondamento 2 casas, rejeita zero/negativo/Infinity/NaN, `.cents` para conversao
- **`CardNumber`**: validacao Luhn, strip non-digits, `.masked` (`4532 **** **** 0366`), `.lastFour`
- **`TransactionId`**: prefixo `txn_` + ULID (26 chars), garantia de unicidade e ordenacao temporal

### 5. SSE (Server-Sent Events)

O endpoint `/v1/payments/:id/events` usa SSE nativo do NestJS (`@Sse`) para streaming de eventos em tempo real:

- `step_completed`: emitido a cada etapa do pipeline concluida
- `payment_completed`: emitido quando o pagamento finaliza

No mobile, o cliente SSE usa `fetch` com `ReadableStream` para compatibilidade com React Native (sem dependencia de `EventSource`).

### 6. Observabilidade

- **Pino** (`nestjs-pino`): logger estruturado JSON em producao, pretty-print em dev
- **Correlation ID**: middleware que gera ULID unico por request (`x-correlation-id` header)
- **Logging Interceptor**: registra method, URL, status code e response time de cada request
- **Problem Details Filter**: erros HTTP formatados segundo RFC 7807

### 7. Splash Screen — Startup Checks

Ao abrir o app, uma splash screen exibe logo + spinner enquanto executa duas verificacoes sequenciais:

1. **Conectividade de rede** (`@react-native-community/netinfo`) — verifica se o dispositivo tem conexao com a internet
2. **Healthcheck da API** (`GET /health`, timeout 5s) — verifica se o backend esta disponivel

Se ambas passam, o app navega para a Home. Caso contrario, exibe uma tela de erro contextual (sem internet ou servico indisponivel) com botao "Tentar novamente".

O hook `useStartupChecks` encapsula toda a logica e a `SplashScreen` e renderizada condicionalmente no `App.tsx`, antes do `AppNavigator`.

### 8. Frontend — Atomic Design

Componentes organizados em 3 niveis:

| Nivel         | Componentes                                                 | Responsabilidade                              |
| ------------- | ----------------------------------------------------------- | --------------------------------------------- |
| **Atoms**     | Text, Input, Button, Spinner, Badge, Icon                   | Elementos basicos, sem logica de negocio      |
| **Molecules** | FormField, StatusBadge, StepTimingRow                       | Composicao de atoms com comportamento simples |
| **Organisms** | PaymentForm, PaymentResult, StepTimingList, TransactionCard | Features completas com logica                 |

### 9. State Management

- **Zustand**: estado de processamento do pagamento (steps, loading, error) — leve, sem boilerplate
- **TanStack Query**: cache de dados do servidor (lista de pagamentos, detalhes) com invalidacao automatica
- **React Hook Form + Zod**: validacao de formulario com schema compartilhado da lib

## Design Patterns Aplicados

| Pattern           | Onde                             | Por que                                     |
| ----------------- | -------------------------------- | ------------------------------------------- |
| **Strategy**      | Pipeline (Sequential/Parallel)   | Alternar estrategias sem alterar o pipeline |
| **Factory**       | PipelineFactory                  | Criar estrategia baseada em configuracao    |
| **Repository**    | PaymentRepository                | Abstrai persistencia (interface no dominio) |
| **Value Object**  | Money, CardNumber, TransactionId | Encapsula regras e garante invariantes      |
| **CQRS**          | Commands/Queries separados       | Escalabilidade e separacao de concerns      |
| **Observer**      | EventBus (@nestjs/cqrs)          | Desacoplamento entre command e side effects |
| **Decorator**     | NestJS decorators                | Metadata-driven DI e routing                |
| **Middleware**    | CorrelationId                    | Cross-cutting concern (observabilidade)     |
| **Atomic Design** | Components hierarchy             | Reutilizabilidade e consistencia visual     |

## Principios SOLID

| Principio                     | Aplicacao                                                        |
| ----------------------------- | ---------------------------------------------------------------- |
| **S** - Single Responsibility | Cada handler faz uma coisa; cada VO valida uma regra             |
| **O** - Open/Closed           | Pipeline extensivel por novas strategies sem alterar o existente |
| **L** - Liskov Substitution   | Sequential e Parallel sao intercambiaveis via interface          |
| **I** - Interface Segregation | `IPaymentRepository`, `IPaymentPipeline` — contratos minimos     |
| **D** - Dependency Inversion  | Domain depende de interfaces, infra implementa                   |

## Entregaveis (Case Tecnico)

- **Repositorio Git**: Codigo-fonte completo da PoC (API + app) e historico de commits organizado.
- **Video (max. 5 minutos)**: Conforme solicitado no case, o video deve apresentar (a) demonstracao do projeto rodando e execucao de pagamentos com exibicao do resultado, (b) visao tecnica com decisoes de design, resiliencia e trade-offs. Entregar conforme instrucoes do processo seletivo.

## Licenca

Projeto desenvolvido como case tecnico. Uso restrito a avaliacao.
