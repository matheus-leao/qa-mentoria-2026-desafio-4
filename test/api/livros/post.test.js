import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';

describe('POST /livros', () => {
  it('Deve retornar autores como array de strings ao cadastrar livro com múltiplos autores', async () => {
    const app = getApp();
    const adminPayload = {
      nome: 'Admin',
      sobrenome: 'Teste',
      id_funcionario: 999,
      email: 'admin-livros@example.com',
      senha: '123456',
    };

    const createdAdmin = await request(app).post('/administradores').send(adminPayload);
    expect(createdAdmin.status).to.equal(201);

    const loginResponse = await request(app)
      .post('/auth/admin/login')
      .send({ id_funcionario: adminPayload.id_funcionario, senha: adminPayload.senha });

    expect(loginResponse.status).to.equal(200);
    expect(loginResponse.body).to.have.property('token');
    const token = loginResponse.body.token;

    const livroPayload = {
      id_livro: '978-0-123456-47-2',
      nome: 'Livro com múltiplos autores',
      autores: ['Autor Um', 'Autor Dois'],
      ano_publicacao: 2024,
      qtde_disponivel: 3,
    };

    const response = await request(app)
      .post('/livros')
      .set('Authorization', `Bearer ${token}`)
      .send(livroPayload);

    expect(response.status).to.equal(201);
    expect(response.body.autores).to.be.an('array').that.deep.equals(['Autor Um', 'Autor Dois']);
    expect(response.body).to.include({
      id_livro: livroPayload.id_livro,
      nome: livroPayload.nome,
      ano_publicacao: livroPayload.ano_publicacao,
      qtde_disponivel: livroPayload.qtde_disponivel,
    });
  });
});
