import request from 'supertest';
import { getApp } from '../helpers/appBuilder.js';

export const postLogin = async (nome, sobrenome, id, email, senha) => {
    const responseLogin = await request(getApp()).post('/administradores')
        .send({
                'nome': 'Luana',
                'sobrenome': 'Nascimento',
                'id_funcionario': 11,
                'email': 'luana@example.com',
                'senha': '123456'
            })

    return responseLogin;
}