Objetivo
Crie uma API Rest com Javascript e Express seguindo os requisitos que estão definidos no arquivo requisitos.md.

Contexto:
Use o arquivo requisitos.md para guiar suas decisões de contexto.

Regras:

- O banco de dados será em memória, armazenando dados em variáveis.
- O diretório da aplicação deve ser divido em controller, service e model.
- Separe um arquivo para o app.js e outro para o server.js, pois posteriormente essa API será testada com Supertest, que precisará importar o app sem o método listen().
- Adote o uso de Swagger para documentar a API Rest e disponibilize um endpoint para renderização do Swagger.
- Implemente autenticação via Bearer Token (JWT) para as rotas que precisam de token definido no requisitos.md
- Construa um arquivo README.md para documentar como configurar e operar a API.

Formato:

- Crie uma sequencia de passos para que eu possa entender o que você está sendo criado e executado. Transforme acada uma de minhas regras em um check em seu checklist de execução.
