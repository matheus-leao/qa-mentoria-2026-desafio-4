import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';
import { postLogin } from '../helpers/autenticacao.js';

describe('PUT /administradores/:id', () => {
    let responseLogin;
    beforeEach(async () => {
        responseLogin = await postLogin('Luana', 'Nascimento', 11, 'luana@example.com', '123456')    
    })

    it('Deve retornar 200 ao editar o cadastro de um administrador', async () => {
        const response = await request(getApp()).put('/administradores/2')
        .send({
                'nome': 'Teste',
                'sobrenome': 'Nascimento',
                'id_funcionario': 10,
                'email': 'teste@example.com',
                'senha': '1234567'
            })
        expect(response.status).to.equal(200);
        expect(response.body.nome).to.equal('Teste')
        expect(response.body.sobrenome).to.equal('Nascimento')
        expect(response.body.id_funcionario).to.equal(10)
        expect(response.body.email).to.equal('teste@example.com')
    })
})