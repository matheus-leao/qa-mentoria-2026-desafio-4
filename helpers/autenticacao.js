import request from 'supertest';
//const request = require('supertest');

export const obterToken = async (app, id, senha) => {
    const respostaLogin = await request(app)
        .post('/auth/admin/login')
        .set('Content-Type', "application/json")
        .send({ 
            "id_funcionario": id, 
            "senha": senha
        });

    return respostaLogin.body.token;

    
};
