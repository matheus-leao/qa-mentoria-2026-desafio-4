import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../../infra/helpers/appBuilder.js';
import { faker } from '@faker-js/faker';
import { criaUsuarioAdmin } from '../../infra/helpers/criaUsuarioAdmin.js';
import { obterToken } from '../../infra/helpers/autenticacao.js';

describe('DELETE /administradores/:id', () => {
    let token;
    let adminId;

    const usuarioAdminFaker = {
        "nome": faker.person.firstName(),
        "sobrenome": faker.person.lastName(),
        "id_funcionario": faker.number.int(),
        "email": faker.internet.email(),
        "senha": "senha123"
    }

    before(async () => {
            adminId = (await criaUsuarioAdmin(getApp(), usuarioAdminFaker)).body.id;
            token = await obterToken(getApp(), usuarioAdminFaker.id_funcionario, usuarioAdminFaker.senha);
        });

    it.only('Deve retornar 204', async () => {
        const response = await request(getApp()).delete(`/administradores/${adminId}`)
        expect(response.status).to.equal(204)
    })
})