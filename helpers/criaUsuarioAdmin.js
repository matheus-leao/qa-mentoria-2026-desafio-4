import request from 'supertest';
//const request = require('supertest');

export const usuarioAdmin = async (nome, sobrenome, id, email, senha) => {
    const admin = await request(process.env.BASE_URL)
        .post('/administradores')
        .set('Content-Type', 'application/json')
        .send({
            'nome': nome,
            'sobrenome': sobrenome,
            'id_funcionario': id,
            'e-mail': email,
            'senha': senha
        });

    return admin;
};