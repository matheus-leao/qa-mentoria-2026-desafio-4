import request from 'supertest';
import { expect } from 'chai';
import { getApp } from './api/helpers/appBuilder.js';
//import app from '../app.js';
import { usuarioAdmin } from '../helpers/criaUsuarioAdmin.js';
import { obterToken } from '../helpers/autenticacao.js';
import livro from '../fixtures/postLivros.json' with { type: 'json' };


describe('Testes de Cadastro de Livros', () => { 
    let admin;
    let token;

    before(async () => {
        admin = await usuarioAdmin(getApp(), 'Admin', 'Teste', '10', 'admin@teste.com', 'senha123');
        token = await obterToken(getApp(), admin.body.id_funcionario, 'senha123');
    });


    describe('GET /cadastroLivros', () => {
        it ('BUsca a lista de Livros cadastrados', async () => {
            const resposta = await request(getApp())
            .get('/livros')
            .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
        
        });
    });

    describe('POST /Livros', () => {
        it.skip('Cria um novo registro livro e retorna 201 ', async () => {
            const livroValido = { ...livro, id_livro: '201S' };
            //Bug rastreado em: https://github.com/matheus-leao/qa-mentoria-2026-desafio-4/issues/23#issue-4249456071
            const resposta = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroValido);

            expect(resposta.status).to.equal(201);
            expect(resposta.body.id_livro).to.be.a('string').and.to.equal('1A');
            expect(resposta.body.nome).to.be.a('string').and.to.equal('Livro de Teste');
            expect(resposta.body.autores).to.be.an('array').of.strings().that.includes('Autor 1', 'Autor 2');
            expect(resposta.body.ano_publicacao).to.be.a('number').and.to.equal(2020);
            expect(resposta.body.edicao).to.be.a('number').and.to.equal(1);
            expect(resposta.body.paginas).to.be.a('number').and.to.equal(300);
            expect(resposta.body.qtde_disponivel).to.be.a('number').and.to.equal(5);
            expect(resposta.body.categoria).to.be.an('array').that.includes('Ficção');
            expect(resposta.body.editora).to.be.a('string').and.to.equal('Editora Teste');
            expect(resposta.body.idioma).to.be.a('string').and.to.equal('Português');
        });

        it('Tenta criar um registro com dados inválidos ou ausentes e retorna 400 ', async () => {
            const livroInvalido = { ...livro, autores: '' }; // Deveria ter no mínimo um autor
                        
            const resposta = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroInvalido)

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.equal('Dados inválidos');
        });

        it('Tenta criar um registro sem token de validação do usuário admin e retorna 401 ', async () => {
            const tokenInvalido = ''; // Deveria ter o token de autenticação do usuário admin
            const livroValido = { ...livro, id_livro: '401A' };
            
            const resposta = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${tokenInvalido}`)
            .send(livroValido)

            expect(resposta.status).to.equal(401);
        });

        it('Tenta criar um registro duplicado e retorna 409 ', async () => {
            const livroDuplicado = { ...livro, id_livro: 'DUP01' };

            const criacao = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroDuplicado);

            expect(criacao.status).to.equal(201);
            
            const resposta = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroDuplicado);

            expect(resposta.status).to.equal(409);
            expect(resposta.body.erro).to.equal('Conflito');
            expect(resposta.body).to.have.property('detalhes').that.is.an('array');
        });
    });

    describe('GET /Livros/{id_livro}', () => {
        it('Busca um livro específico por ID e retorna 200 ', async () => {
            const livroValido = { ...livro, id_livro: '200GET', nome: 'Livro GET 200' };

            const criacao = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroValido);

            expect(criacao.status).to.equal(201);

            const resposta = await request(getApp())
            .get('/livros/200GET')
            .set('Authorization', `Bearer ${token}`)
            .send(livroValido.id_livro);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.id_livro).to.equal('200GET');
        });

        it('Busca um livro específico com ID incorreto e retorna 404 ', async () => {
            const livroInexistente = {...livro, id_livro: '999'}; // ID que não existe no sistema
            const resposta = await request(getApp())
            .get('/livros/999')
            .set('Authorization', `Bearer ${token}`)
            .send(livroInexistente.id_livro);

            expect(resposta.status).to.equal(404);
        });
    });

    describe('PUT /Livros/{id_livro}', () => {
        it('Atualiza um livro específico por ID e retorna 200 ', async () => {
            const livroValido = { ...livro, id_livro: '200PUT', nome : 'Livro PUT 200' };

            const criacao = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroValido);

            expect(criacao.status).to.equal(201);

            const livroAtualizado = { ...livro, nome: 'Livro de Teste Atualizado' };
            const resposta = await request(getApp())
            .put('/livros/200PUT')
            .set('Authorization', `Bearer ${token}`)
            .send(livroAtualizado);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.nome).to.equal('Livro de Teste Atualizado');
        });

        it('Tenta atualizar um livro com ID incorreto e retorna 404 ', async () => {
            const livroAtualizado = { ...livro, nome: 'Livro de Teste Atualizado' };
            const resposta = await request(getApp())
            .put('/livros/999')
            .set('Authorization', `Bearer ${token}`)
            .send(livroAtualizado);

            expect(resposta.status).to.equal(404);
        });

        it('Tenta atualizar um livro sem token de autenticação e retorna 401 ', async () => {
            const livroAtualizado = { ...livro, nome: 'Livro de Teste Atualizado' };
            const tokenInvalido = ''; // Deveria ter o token de autenticação do usuário admin
            
            const resposta = await request(getApp())
            .put('/livros/1A')
            .set('Authorization', `Bearer ${tokenInvalido}`)
            .send(livroAtualizado);

            expect(resposta.status).to.equal(401);
        });

        it('Tenta atualizar um livro com dados inválidos e retorna 400 ', async () => {
            const livroValido = { ...livro, id_livro: '400PUT', nome: 'Livro PUT 400' };

             const criacao = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroValido);

            expect(criacao.status).to.equal(201);

            const livroAtualizado = { ...livro, nome: '' }; // Nome não pode ser vazio
            const resposta = await request(getApp())
            .put('/livros/400PUT')
            .set('Authorization', `Bearer ${token}`)
            .send(livroAtualizado);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.erro).to.equal('Dados inválidos');
        });

        
        it('Tenta atualizar um livro para um ID já existente e retorna 409 ', async () => {
            const livroAtualizadoA = { ...livro, id_livro: '409PUTA', nome: 'Livro PUT 409A' };
            const livroAtualizadoB = { ...livro, id_livro: '409PUTB', nome: 'Livro PUT 409B' };
                                                                                                
            const criacaoA = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroAtualizadoA);

            expect(criacaoA.status).to.equal(201);

             const criacaoB = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroAtualizadoB);

            expect(criacaoB.status).to.equal(201);

            const resposta = await request(getApp())                                             
            .put('/livros/409PUTB')
            .set('Authorization', `Bearer ${token}`)
            .send(livroAtualizadoA);

            expect(resposta.status).to.equal(409);
            expect(resposta.body.erro).to.equal('Conflito');
        });
    });

    describe('DELETE /Livros/{id_livro}', () => {
        it('Deleta um livro específico por ID e retorna 204 ', async () => {
            const livroParaExcluir = { ...livro, id_livro: 'DEL001', nome: 'Livro DELETE 204'};
            const criacao = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroParaExcluir);

            expect(criacao.status).to.equal(201);

            const resposta = await request(getApp())
            .delete('/livros/DEL001')
            .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(204);
        });

        it('Tenta deletar um livro com ID incorreto e retorna 404 ', async () => {
            const resposta = await request(getApp())
            .delete('/livros/999')
            .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(404);
        });

        it('Tenta deletar um livro sem token de autenticação e retorna 401 ', async () => {
            const tokenInvalido = ''; // Deveria ter o token de autenticação do usuário admin
            const livroSemAutenticacao = { ...livro, id_livro: 'DEL401', nome: 'Livro DELETE 401' };
           
            const criacao = await request(getApp())
            .post('/livros')
            .set('Authorization', `Bearer ${token}`)
            .send(livroSemAutenticacao);

            expect(criacao.status).to.equal(201);
            
            const resposta = await request(getApp())
            .delete('/livros/DEL401')
            .set('Authorization', `Bearer ${tokenInvalido}`);

            expect(resposta.status).to.equal(401);
        });
    });
});