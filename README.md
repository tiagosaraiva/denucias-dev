# Sistema de Gestão de Denúncias

Este é um sistema para gerenciamento de denúncias que utiliza React no frontend, Express no backend e SQL Server como banco de dados. Todo o sistema é containerizado usando Docker.

## Requisitos

- Docker
- Docker Compose

## Configuração

1. Clone o repositório:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Configure as variáveis de ambiente:
   - Frontend (.env):
     ```
     VITE_API_URL=http://localhost:3000/api
     ```
   - Backend (backend/.env):
     ```
     PORT=3000
     NODE_ENV=development
     DB_USER=sa
     DB_PASSWORD=YourStrong!Passw0rd
     DB_SERVER=mssql
     DB_NAME=complaints_db
     CORS_ORIGIN=http://localhost:5173
     ```

## Executando o projeto

1. Inicie os containers:
```bash
docker-compose up -d
```

2. Aguarde alguns segundos para que o SQL Server inicialize e o script de criação do banco seja executado.

3. Acesse a aplicação:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api
   - SQL Server: localhost:1433

## Estrutura do Projeto

```
.
├── frontend/                # Aplicação React
│   ├── src/                # Código fonte do frontend
│   ├── public/             # Arquivos públicos
│   └── Dockerfile          # Configuração do container do frontend
│
├── backend/                # API Express
│   ├── src/               # Código fonte do backend
│   │   ├── controllers/   # Controladores da API
│   │   ├── models/        # Modelos de dados
│   │   ├── routes/        # Rotas da API
│   │   └── database/      # Scripts e configurações do banco
│   └── Dockerfile         # Configuração do container do backend
│
└── docker-compose.yml      # Configuração dos serviços Docker
```

## API Endpoints

### Denúncias
- `GET /api/complaints` - Lista todas as denúncias
- `GET /api/complaints/:id` - Obtém uma denúncia específica
- `POST /api/complaints` - Cria uma nova denúncia
- `PUT /api/complaints/:id` - Atualiza uma denúncia
- `DELETE /api/complaints/:id` - Remove uma denúncia
- `GET /api/complaints/status-summary` - Resumo por status
- `GET /api/complaints/by-category` - Resumo por categoria

### Procedimentos
- `POST /api/procedures` - Cria um novo procedimento

### Entrevistas
- `POST /api/interviews` - Cria uma nova entrevista

### Ações
- `POST /api/actions` - Cria uma nova ação

### Conclusões
- `POST /api/conclusions` - Cria uma nova conclusão

## Desenvolvimento

Para desenvolvimento local:

1. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Execute os serviços em modo de desenvolvimento:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
