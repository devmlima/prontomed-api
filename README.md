# ProntoMed API

Backend do sistema de prontuário eletrônico **ProntoMed**.

REST API construída com **Node.js + TypeScript + Express**, seguindo arquitetura em camadas (Clean Architecture), com autenticação JWT, banco de dados MySQL e testes unitários com Jest.

> Frontend disponível em [prontomed-fe](https://github.com/devmlima/prontomed-fe) — deploy em produção: [prontomed-fe-kp76.vercel.app](https://prontomed-fe-kp76.vercel.app)

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20 |
| Linguagem | TypeScript 5 |
| Framework HTTP | Express 4 |
| ORM | Sequelize 6 |
| Banco de dados | MySQL 8 (Docker) |
| Autenticação | JWT (24h) + Bcrypt |
| Injeção de dependência | TypeDI |
| Testes | Jest + ts-jest |
| Linting | ESLint + TypeScript ESLint |

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [Docker](https://www.docker.com) e Docker Compose

---

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd prontomed-api
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

As variáveis padrão já estão alinhadas com o `docker-compose.yml`. Nenhuma alteração é necessária para rodar localmente.

| Variável | Valor padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta da API |
| `DB_HOST` | `localhost` | Host do MySQL |
| `DB_PORT` | `3306` | Porta do MySQL |
| `DB_NAME` | `prontomed` | Nome do banco |
| `DB_USER` | `prontomed` | Usuário do banco |
| `DB_PASSWORD` | `prontomed123` | Senha do banco |
| `JWT_SECRET` | — | Chave de assinatura JWT (**trocar em produção**) |

### 3. Subir o banco de dados

```bash
docker-compose up -d
```

Isso inicia um container **MySQL 8.0** na porta `3306` com volume persistente.

Verificar se está saudável:

```bash
docker ps
# aguarde o status ficar "healthy"
```

### 4. Criar as tabelas

Execute as migrations na ordem abaixo dentro do container:

```bash
# Tabela de pacientes
docker exec -i prontomed-mysql mysql -uroot -proot prontomed \
  < src/4-framework/database/migrations/001_create_patients.sql

# Tabela de agendamentos
docker exec -i prontomed-mysql mysql -uroot -proot prontomed \
  < src/4-framework/database/migrations/002_create_appointments.sql

# Campo de anotações nos agendamentos
docker exec -i prontomed-mysql mysql -uroot -proot prontomed \
  < src/4-framework/database/migrations/003_add_notes_to_appointments.sql
```

> A tabela `doctors` é criada automaticamente pelo Sequelize ao iniciar a aplicação.

### 5. Instalar dependências

```bash
npm install
```

### 6. Iniciar em modo desenvolvimento

```bash
npm run dev
```

A API estará disponível em: **`http://localhost:3000`**

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com hot-reload (ts-node-dev) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Inicia a versão compilada |
| `npm test` | Executa os testes unitários |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` | Verifica erros de lint |
| `npm run lint:fix` | Corrige erros de lint automaticamente |

---

## Endpoints

Base URL: `http://localhost:3000/api`

Rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

### Auth — público

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastro de médico |
| `POST` | `/auth/login` | Login — retorna JWT |

### Patients — 🔒 autenticado

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/patients` | Listar pacientes |
| `GET` | `/patients/:id` | Buscar paciente por ID |
| `POST` | `/patients` | Cadastrar paciente |
| `PUT` | `/patients/:id` | Atualizar paciente |
| `DELETE` | `/patients/:id` | Anonimizar paciente (LGPD) |

### Appointments — 🔒 autenticado

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/appointments` | Listar agendamentos |
| `GET` | `/appointments/:id` | Buscar agendamento por ID |
| `POST` | `/appointments` | Criar agendamento |
| `PUT` | `/appointments/:id` | Atualizar agendamento |
| `PATCH` | `/appointments/:id/cancel` | Cancelar agendamento |

> O `doctorId` é sempre extraído do token JWT — nunca enviado no body.

---

## Documentação Swagger

O contrato completo da API está disponível em:

```
docs/swagger.yaml
```

Para visualizar interativamente, cole o conteúdo em **[editor.swagger.io](https://editor.swagger.io)**.

Alternativamente, com o servidor rodando, é possível servir a UI localmente instalando `swagger-ui-express`.

---

## Testes

```bash
npm test
```

31 testes unitários cobrindo `AuthService`, `PatientService` e `AppointmentService`.

```
Test Suites: 3 passed, 3 total
Tests:       31 passed, 31 total
```

---

## Arquitetura

O projeto segue Clean Architecture em camadas:

```
src/
├── 2-domain/          # Modelos, DTOs, enums e erros (sem dependências externas)
├── 3-business/        # Interfaces, UseCases (regras de negócio)
├── 4-framework/       # Implementações: Express, Sequelize, JWT, repositórios
│   ├── database/      # Entities, migrations, conexão Sequelize
│   ├── middlewares/   # Auth JWT
│   ├── repositories/  # Implementações dos repositórios
│   ├── routes/        # Definição das rotas Express
│   └── services/      # Implementações dos serviços
├── tests/
│   └── unit/          # Testes unitários com mocks
└── server.ts          # Entry point
docs/
└── swagger.yaml       # Documentação OpenAPI 3.0
```

---

## Docker — comandos úteis

```bash
# Subir o banco
docker-compose up -d

# Parar o banco (preserva dados)
docker-compose down

# Resetar banco (apaga todos os dados)
docker-compose down -v && docker-compose up -d

# Acompanhar logs do container
docker logs prontomed-mysql -f

# Acessar o MySQL diretamente
docker exec -it prontomed-mysql mysql -uroot -proot prontomed
```

