import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { usuarioAdmin } from '../helpers/criaUsuarioAdmin.js';
import { obterToken } from '../helpers/autenticacao.js';
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
});
