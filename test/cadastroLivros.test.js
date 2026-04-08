import request from 'supertest';
import { expect } from 'chai';
import 'dotenv/config';
import { usuarioAdmin } from '../helpers/criaUsuarioAdmin.js';
import { obterToken } from '../helpers/autenticacao.js';
/*const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();*/

describe('Testes de Cadastro de Livros', () => { 
    let admin;
    let token;

    before(async () => {
        admin = await usuarioAdmin('Admin', 'Teste', '10', 'admin@teste.com', 'senha123');
        token = await obterToken(admin.body.id_funcionario, admin.body.senha);
    });


    describe('GET /cadastroLivros', () => {
        it ('BUsca a lista de Livros cadastrados', async () => {
            const resposta = await request(process.env.BASE_URL)
            .get('/livros')
            .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
        
        });
    });
});