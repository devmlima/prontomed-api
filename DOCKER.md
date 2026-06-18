# Setup — PRONTOMED API

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose instalados

---

## 1. Variáveis de ambiente

```bash
cp .env.example .env
```

As variáveis padrão já estão compatíveis com o docker-compose. Não é necessário alterar nada para rodar localmente.

---

## 2. Subir o banco de dados (MySQL via Docker)

```bash
docker-compose up -d
```

Isso inicia um container MySQL 8.0 na porta **3306**.

Para verificar se está rodando:

```bash
docker ps
```

Para acompanhar os logs:

```bash
docker logs prontomed-mysql
```

---

## 3. Instalar dependências

```bash
npm install
```

---

## 4. Iniciar a aplicação em modo desenvolvimento

```bash
npm run dev
```

A API ficará disponível em: **http://localhost:3000**

---

## Endpoints disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/patients | Listar todos os pacientes |

---

## Parar o Docker

```bash
docker-compose down
```

## Resetar o banco de dados (apaga todos os dados)

```bash
docker-compose down -v
docker-compose up -d
```
