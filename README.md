# Backend: FURIA Backend

## Visão Geral
FURIA Backend é uma API RESTful e servidor de WebSocket que fornece dados e funcionalidades para a aplicação frontend FURIA App. O sistema gerencia usuários, autenticação, pontos, recompensas e comunicação em tempo real.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para API RESTful
- **MongoDB com Mongoose**: Banco de dados e ODM
- **Socket.IO**: Comunicação em tempo real
- **JSON Web Token (JWT)**: Autenticação de usuários
- **Passport**: Middleware de autenticação
- **RabbitMQ**: Sistema de mensageria
- **Multer**: Upload de arquivos
- **Swagger**: Documentação da API
- **Helmet**: Segurança para cabeçalhos HTTP
- **Compression**: Compressão de respostas
- **Express Rate Limit**: Proteção contra abusos

## Estrutura do Projeto
- `controllers/`: Lógica de negócios da aplicação
- `middlewares/`: Middleware para autenticação, upload e tratamento de erros
- `models/`: Modelos Mongoose para o banco de dados
- `routes/`: Rotas da API
- `services/`: Serviços para Socket.IO e RabbitMQ
- `config/`: Configurações da aplicação
- `seeds/`: Dados iniciais para o banco de dados

## Modelos de Dados
- **User**: Dados dos usuários, autenticação e perfil
- **Activity**: Registro de atividades e pontos dos usuários
- **Game**: Jogos da FURIA (CS, Valorant, etc.)
- **Player**: Jogadores dos times
- **Match**: Partidas agendadas, ao vivo e passadas
- **Stream**: Transmissões ao vivo e conteúdo gravado
- **Product**: Produtos da loja virtual
- **Reward**: Recompensas resgatáveis com pontos
- **Message**: Mensagens do chat

## Principais Funcionalidades
- **Autenticação JWT**: Sistema seguro de autenticação
- **API RESTful**: Endpoints para todas as entidades
- **Socket.IO**: Chat em tempo real e notificações
- **Sistema de Pontos**: Gerenciamento de pontos dos usuários
- **Recompensas**: Sistema de resgate de prêmios
- **Upload de Arquivos**: Suporte para imagens de perfil e produtos
- **Documentação Swagger**: API documentada e testável
- **Integração com Redes Sociais**: Login via OAuth
- **Mensageria com RabbitMQ**: Processamento assíncrono de mensagens

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MongoDB (local ou remoto)
- RabbitMQ (opcional, para mensageria avançada)

### Passo a Passo

#### Clone o repositório
```bash
git clone https://github.com/seu-usuario/furia-backend.git
cd furia-backend
```

#### Instale as dependências
```bash
npm install
```

#### Configure o arquivo de ambiente
Crie um arquivo `.env` na raiz do projeto:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/furia_db
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RABBITMQ_URL=amqp://localhost
```

#### Popule o banco de dados (opcional)
```bash
npm run seed
```

#### Execute o servidor em modo de desenvolvimento
```bash
npm run dev
```

### Acesse a API
- A API estará disponível em: `http://localhost:5000`

### Acesse a documentação Swagger
- Navegue para: `http://localhost:5000/api-docs`

## Endpoints da API
A API oferece os seguintes grupos de endpoints:
- `/api/auth`: Autenticação (registro, login, OAuth)
- `/api/users`: Gerenciamento de usuários
- `/api/games`: Jogos e equipes da FURIA
- `/api/players`: Jogadores dos times
- `/api/matches`: Partidas passadas, ao vivo e futuras
- `/api/streams`: Transmissões ao vivo e gravadas
- `/api/products`: Produtos da loja
- `/api/rewards`: Recompensas do sistema de pontos
- `/api/activities`: Atividades dos usuários
- `/api/messages`: Mensagens do chat

## Documentação da API
A documentação completa está disponível através do Swagger em `/api-docs`. Esta documentação permite:
- Visualizar todos os endpoints disponíveis
- Testar requisições diretamente pela interface
- Ver modelos de dados e parâmetros esperados
- Autenticar-se para testar endpoints protegidos

## Sistema de Pontos e Atividades
O backend gerencia os pontos dos usuários registrando atividades como:
- Chat (1 ponto por mensagem)
- Login diário (20 pontos)
- Assistir partidas (10 pontos)
- Assistir highlights (5 pontos)
- Tempo de navegação (5 pontos a cada 5 minutos)

## Execução com Docker
O projeto inclui um arquivo `docker-compose.yml` para facilitar a execução:
```bash
docker-compose up -d
```
Isso iniciará o servidor e um banco MongoDB em containers separados.

## Considerações de Segurança
- Autenticação com JWT
- Proteção contra ataques com Helmet
- Limitação de taxa com Express Rate Limit
- Validação de entrada com Express Validator
- Sanitização de dados para prevenir injeções
- CORS configurável