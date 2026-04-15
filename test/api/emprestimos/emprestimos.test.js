import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';
import { criaUsuarioAdmin } from '../helpers/criaUsuarioAdmin.js';
import { obterToken } from '../helpers/autenticacao.js';
import { cadastrarLivroValido } from '../helpers/cadastraLivro.js';
import livro from '../fixtures/postLivros.json' with { type: 'json' };
import { faker } from '@faker-js/faker';

describe('Testes de Cadastro de Livros', () => { 
    let leitor;
    let token;
    let livroCadastrado;

    const usuarioLeitorFaker = {
        "nome": faker.person.firstName(),
        "sobrenome": faker.person.lastName(),
        "email": faker.internet.email(),
        "senha": "senha123"
    }

    before(async () => {
        leitor = await criaLeitor(getApp(), usuarioLeitorFaker);
        token = await obterToken(getApp(), usuarioLeitorFaker.email, usuarioLeitorFaker.senha);
        livroCadastrado = await cadastrarLivroValido(getApp(), token, livro);
    });

    describe('POST / login', () => {
        it('Cadastra um novo emprestimo', async () => {
                const resposta = await request(getApp())
                .post('/login')
                .set('Authorization', `Bearer ${token}`);
                expect(resposta.status).to.equal(201);              
        });
        it('Emprestimo com dados inválidos ou ausentes e retorna 400 ', async () => {
            const resposta = await request(getApp())
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send({ livro_id: ''});
            expect(resposta.status).to.equal(400);
        });
        it('Token inválido ou ausente e retorna 401 ', async () => {
            const tokenInvalido = { ...token, token: '' };
            const resposta = await request(getApp())
            .post('/login')
            .set('Authorization', `Bearer ${tokenInvalido.token}`)
            .send({ livro_id: livroCadastrado.id_livro });
            expect(resposta.status).to.equal(401);
        });
        /*it('Usuario nao autorizado e retorna 403 ', async () => {
            const resposta = await request(getApp())
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send({ livro_id: livroCadastrado.id_livro });
            expect(resposta.status).to.equal(403);
        });*/
        it('Livro indisponivel e retorna 409 ', async () => {
            const livroIndisponivel = { ...livroCadastrado, qtde_disponivel: 0 };
            const resposta = await request(getApp())
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send({ livro_id: livroCadastrado.id_livro });
            expect(resposta.status).to.equal(409);
        });
    });    
    describe('POST / devolucoes', () => {
        it('Devolve um livro emprestado', async () => {
                const resposta = await request(getApp())
                .post('/devolucoes')
                .set('Authorization', `Bearer ${token}`)
                .send({ livro_id: livroCadastrado.id_livro, id_emprestimo: 1 });
                expect(resposta.status).to.equal(200);              
        });
        it('Devolução com dados inválidos ou ausentes e retorna 400 ', async () => {
            const resposta = await request(getApp())
            .post('/devolucoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ livro_id: '', id_emprestimo: '' });
            expect(resposta.status).to.equal(400);
        });
        it('Token inválido ou ausente e retorna 401 ', async () => {
            const tokenInvalido = { ...token, token: '' };
            const resposta = await request(getApp())
            .post('/devolucoes')
            .set('Authorization', `Bearer ${tokenInvalido.token}`)
            .send({ livro_id: livroCadastrado.id_livro, id_emprestimo: 1 });
            expect(resposta.status).to.equal(401);
        });
        /*it('Não autorizado a devolver e retorna 403 ', async () => {
            const resposta = await request(getApp())
            .post('/devolucoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ livro_id: livroCadastrado.id_livro, id_emprestimo: 1 });
            expect(resposta.status).to.equal(403);
        });*/
        it('Emprestimo não encontrado e retorna 404 ', async () => {
            const resposta = await request(getApp())
            .post('/devolucoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ livro_id: livroCadastrado.id_livro, id_emprestimo: 999 });
            expect(resposta.status).to.equal(404);
        });
    });
});

