/**
 * Documentação OpenAPI 3 (Swagger) da API de biblioteca.
 */
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Biblioteca API',
    description:
      'API REST de gerenciamento de biblioteca (administradores, leitores, livros, empréstimos e devoluções). Autenticação JWT Bearer.',
    version: '1.0.0',
  },
  servers: [{ url: '/', description: 'Servidor local' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Saúde do serviço',
        tags: ['Sistema'],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/administradores': {
      get: {
        summary: 'Listagem de administradores',
        tags: ['Administradores'],
        responses: { 200: { description: 'Lista de administradores' } },
      },
      post: {
        summary: 'Cadastro de administrador',
        tags: ['Administradores'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'sobrenome', 'id_funcionario', 'email', 'senha'],
                properties: {
                  nome: { type: 'string' },
                  sobrenome: { type: 'string' },
                  id_funcionario: { type: 'integer' },
                  email: { type: 'string', format: 'email' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Criado' },
          400: { description: 'Validação' },
          409: { description: 'Conflito' },
        },
      },
    },
    '/administradores/{id}': {
      get: {
        summary: 'Detalhe de administrador',
        tags: ['Administradores'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Encontrado' }, 404: { description: 'Não encontrado' } },
      },
      put: {
        summary: 'Edição de administrador',
        tags: ['Administradores'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  sobrenome: { type: 'string' },
                  id_funcionario: { type: 'integer' },
                  email: { type: 'string', format: 'email' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Atualizado' }, 400: { description: 'Validação' }, 404: { description: 'Não encontrado' }, 409: { description: 'Conflito' } },
      },
      delete: {
        summary: 'Exclusão de administrador',
        tags: ['Administradores'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removido' }, 404: { description: 'Não encontrado' } },
      },
    },
    '/leitores': {
      get: {
        summary: 'Listagem de leitores',
        tags: ['Leitores'],
        responses: { 200: { description: 'Lista de leitores' } },
      },
      post: {
        summary: 'Cadastro de leitor',
        tags: ['Leitores'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'sobrenome', 'email', 'senha'],
                properties: {
                  nome: { type: 'string' },
                  sobrenome: { type: 'string' },
                  email: { type: 'string' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Criado' },
          400: { description: 'Validação' },
          409: { description: 'Conflito' },
        },
      },
    },
    '/leitores/{id}': {
      get: {
        summary: 'Detalhe de leitor',
        tags: ['Leitores'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Encontrado' }, 404: { description: 'Não encontrado' } },
      },
      put: {
        summary: 'Edição de leitor',
        tags: ['Leitores'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  sobrenome: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Atualizado' }, 400: { description: 'Validação' }, 404: { description: 'Não encontrado' }, 409: { description: 'Conflito' } },
      },
      delete: {
        summary: 'Exclusão de leitor',
        tags: ['Leitores'],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removido' }, 404: { description: 'Não encontrado' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login de leitor (obtém JWT)',
        tags: ['Autenticação'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                  email: { type: 'string' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token emitido' },
          401: { description: 'Credenciais inválidas' },
        },
      },
    },
    '/auth/admin/login': {
      post: {
        summary: 'Login de administrador (obtém JWT)',
        tags: ['Autenticação'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_funcionario', 'senha'],
                properties: {
                  id_funcionario: { type: 'integer' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token emitido' },
          401: { description: 'Credenciais inválidas' },
        },
      },
    },
    '/livros': {
      get: {
        summary: 'Listagem de livros',
        tags: ['Livros'],
        responses: { 200: { description: 'Lista de livros' } },
      },
      post: {
        summary: 'Cadastro de livro (requer JWT)',
        tags: ['Livros'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_livro', 'nome', 'autores', 'ano_publicacao', 'qtde_disponivel'],
                properties: {
                  id_livro: { type: 'string', description: 'ISBN' },
                  nome: { type: 'string' },
                  autores: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
                  ano_publicacao: { type: 'integer' },
                  edicao: { type: 'integer' },
                  paginas: { type: 'integer' },
                  qtde_disponivel: { type: 'integer' },
                  categoria: {
                    oneOf: [
                      { type: 'string' },
                      { type: 'array', items: { type: 'string' }, maxItems: 3 },
                    ],
                  },
                  editora: { type: 'string' },
                  idioma: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Criado' },
          400: { description: 'Validação' },
          401: { description: 'Token ausente ou inválido' },
          409: { description: 'Conflito' },
        },
      },
    },
    '/livros/{id_livro}': {
      get: {
        summary: 'Detalhe de livro',
        tags: ['Livros'],
        parameters: [{ in: 'path', name: 'id_livro', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Encontrado' }, 404: { description: 'Não encontrado' } },
      },
      put: {
        summary: 'Edição de livro (requer JWT)',
        tags: ['Livros'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_livro', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_livro: { type: 'string', description: 'Novo ISBN (opcional)' },
                  nome: { type: 'string' },
                  autores: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
                  ano_publicacao: { type: 'integer' },
                  edicao: { type: 'integer' },
                  paginas: { type: 'integer' },
                  qtde_disponivel: { type: 'integer' },
                  categoria: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' }, maxItems: 3 }] },
                  editora: { type: 'string' },
                  idioma: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Atualizado' }, 400: { description: 'Validação' }, 401: { description: 'Token' }, 404: { description: 'Não encontrado' }, 409: { description: 'Conflito' } },
      },
      delete: {
        summary: 'Exclusão de livro (requer JWT)',
        tags: ['Livros'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id_livro', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Removido' }, 401: { description: 'Token' }, 404: { description: 'Não encontrado' } },
      },
    },
    '/login': {
      post: {
        summary: 'Empréstimo de livro (requisitos: POST /login com Bearer)',
        description:
          'Conforme requisitos.md, a operação de empréstimo usa a rota POST /login com Authorization Bearer (JWT de leitor).',
        tags: ['Empréstimos'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_livro'],
                properties: {
                  id_livro: { type: 'string', description: 'ISBN' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Empréstimo criado' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Token não informado ou inválido' },
          403: { description: 'Usuário não autorizado' },
          409: { description: 'Livro indisponível' },
          500: { description: 'Erro interno' },
        },
      },
    },
    '/devolucoes': {
      post: {
        summary: 'Devolução de livro (JWT de leitor)',
        tags: ['Empréstimos'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_emprestimo: { type: 'integer' },
                  id_livro: { type: 'string', description: 'ISBN (alternativa ao id_emprestimo)' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Devolução registrada' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Token' },
          403: { description: 'Não autorizado' },
          404: { description: 'Empréstimo não encontrado' },
        },
      },
    },
  },
};
