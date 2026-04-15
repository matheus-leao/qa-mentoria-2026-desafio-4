import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';
import { obterTokenLeitor } from '../helpers/autenticacao.js';
import { cadastrarLivroValido } from '../helpers/cadastraLivro.js';
import livro from '../fixtures/postLivros.json' with { type: 'json' };
import { faker } from '@faker-js/faker';
import { criarLeitor } from '../helpers/criaLeitor.js';

describe('Testes de Emprestimos de Livros', () => {
    let token;
    let livroCadastrado;
    let livroParaIndisponivel;
    let emprestimoId;

    const usuarioLeitorFaker = {
        "nome": faker.person.firstName(),
        "sobrenome": faker.person.lastName(),
        "email": faker.internet.email(),
        "senha": "senha123"
    };

    before(async () => {
        await criarLeitor(getApp(), usuarioLeitorFaker);
        token = await obterTokenLeitor(getApp(), usuarioLeitorFaker.email, usuarioLeitorFaker.senha);
        livroCadastrado = await cadastrarLivroValido(getApp(), token, livro);
        livroParaIndisponivel = await cadastrarLivroValido(getApp(), token, {
            ...livro,
            id_livro: 'INDIS1',
            nome: 'Livro Sem Estoque Teste',
            qtde_disponivel: 1
        });
    });

    describe('POST /login', () => {
        it('Cadastra um novo emprestimo', async () => {
            const resposta = await request(getApp())
                .post('/login')
                .set('Authorization', `Bearer ${token}`)
                .send({ id_livro: livroCadastrado.id_livro });
            expect(resposta.status).to.equal(201);
            emprestimoId = resposta.body.id;
        });

        it('Emprestimo com dados inválidos ou ausentes e retorna 400', async () => {
            const resposta = await request(getApp())
                .post('/login')
                .set('Authorization', `Bearer ${token}`)
                .send({ id_livro: '' });
            expect(resposta.status).to.equal(400);
        });

        it('Token inválido ou ausente e retorna 401', async () => {
            const tokenInvalido = { ...token, token: '' };
            const resposta = await request(getApp())
                .post('/login')
                .set('Authorization', `Bearer ${tokenInvalido.token}`)
                .send({ id_livro: livroCadastrado.id_livro });
            expect(resposta.status).to.equal(401);
        });

        it('Livro indisponivel e retorna 409', async () => {
            const resposta = await request(getApp())
                .post('/login')
                .set('Authorization', `Bearer ${token}`)
                .send({ id_livro: livroParaIndisponivel.id_livro });
            expect(resposta.status).to.equal(409);
        });
    });

    describe('POST /devolucoes', () => {
        it('Devolve um livro emprestado', async () => {
            const resposta = await request(getApp())
                .post('/devolucoes')
                .set('Authorization', `Bearer ${token}`)
                .send({ id_livro: livroCadastrado.id_livro, id_emprestimo: emprestimoId });
            expect(resposta.status).to.equal(200);
        });

        it('Devolução com dados inválidos ou ausentes e retorna 400', async () => {
            const resposta = await request(getApp())
                .post('/devolucoes')
                .set('Authorization', `Bearer ${token}`)
                .send({ id_livro: '', id_emprestimo: '' });
            expect(resposta.status).to.equal(400);
        });

        it('Token inválido ou ausente e retorna 401', async () => {
            const tokenInvalido = { ...token, token: '' };
            const resposta = await request(getApp())
                .post('/devolucoes')
                .set('Authorization', `Bearer ${tokenInvalido.token}`)
                .send({ id_livro: livroCadastrado.id_livro, id_emprestimo: emprestimoId });
            expect(resposta.status).to.equal(401);
        });

        it('Emprestimo não encontrado e retorna 404', async () => {
            const resposta = await request(getApp())
                .post('/devolucoes')
                .set('Authorization', `Bearer ${token}`)
                .send({ id_livro: livroCadastrado.id_livro, id_emprestimo: 999 });
            expect(resposta.status).to.equal(404);
        });
    });
});
