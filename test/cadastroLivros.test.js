import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { usuarioAdmin } from '../helpers/criaUsuarioAdmin.js';
import { obterToken } from '../helpers/autenticacao.js';
import livro from '../fixtures/postLivros.json' with { type: 'json' };
/*const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();*/

describe('Testes de Cadastro de Livros', () => { 
    let admin;
    let token;

    before(async () => {
        admin = await usuarioAdmin(app, 'Admin', 'Teste', '10', 'admin@teste.com', 'senha123');
        token = await obterToken(app, admin.body.id_funcionario, 'senha123');
    });


    describe('GET /cadastroLivros', () => {
        it ('BUsca a lista de Livros cadastrados', async () => {
            const resposta = await request(app)
            .get('/livros')
            .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
        
        });
    });

    describe('POST /Livros', () => {
        it ('Cria um novo registro livro e retorna 201 ', async () => {
            const resposta = await request(app)
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livro);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.id_livro).to.be.a('string').and.to.equal('1A');
            expect(resposta.body.nome).to.be.a('string').and.to.equal('Livro de Teste');
            expect(resposta.body.autores).to.be.an('array').of('strings').that.includes('Autor 1', 'Autor 2');
            expect(resposta.body.ano_publicacao).to.be.a('number').and.to.equal(2020);
            expect(resposta.body.edicao).to.be.a('number').and.to.equal(1);
            expect(resposta.body.paginas).to.be.a('number').and.to.equal(300);
            expect(resposta.body.qtde_disponivel).to.be.a('number').and.to.equal(5);
            expect(resposta.body.categoria).to.be.an('array').that.includes('Ficção');
            expect(resposta.body.editora).to.be.a('string').and.to.equal('Editora Teste');
            expect(resposta.body.idioma).to.be.a('string').and.to.equal('Português');
        });

        it ('Tenta criar um registro com dados inválidos ou ausentes e retorna 400 ', async () => {
            const livroInvalido = { ...livro };
            livroInvalido.autores = ''; // Deveria ter no mínimo um autor
            
            const resposta = await request(app)
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroInvalido)

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.equal('Dados inválidos');
        });

        it ('Tenta criar um registro sem token de validação do usuário admin e retorna 401 ', async () => {
            const tokenInvalido = ''; // Deveria ter o token de autenticação do usuário admin
            
            const resposta = await request(app)
            .post('/livros')
            .set('Authorization', `Bearer ${tokenInvalido}`)
            .send(livro)

            expect(resposta.status).to.equal(401);
        });

        it ('Tenta criar um registro duplicado e retorna 409 ', async () => {
            const resposta = await request(app)
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livro)
            .send(livro);

            expect(resposta.status).to.equal(409);
            expect(resposta.body.erro).to.equal('Conflito');
            expect(resposta.body).to.have.property('detalhes').that.is.an('array');
        });
    });
});
