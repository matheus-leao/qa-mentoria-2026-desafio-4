import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';

describe('POST /administradores', () => {
    it('Deve retornar 201 ao realizar o cadastro corretamente de um administrador', async () => {
        const response = await request(getApp()).post('/administradores')
        .send({
                'nome': 'Luana',
                'sobrenome': 'Nascimento',
                'id_funcionario': 111,
                'email': 'luanaa@example.com',
                'senha': '123456'
            })
        expect(response.status).to.equal(201);
        expect(response.body.nome).to.equal('Luana')
        expect(response.body.sobrenome).to.equal('Nascimento')
        expect(response.body.id_funcionario).to.equal(111)
        expect(response.body.email).to.equal('luanaa@example.com')
    })
})