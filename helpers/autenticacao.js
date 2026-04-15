import request from 'supertest';
//const request = require('supertest');

export const obterToken = async (app, id_funcionario, senha) => {
    const respostaLogin = await request(app)
        .post('/auth/admin/login')
        .set('Content-Type', "application/json")
        .send({ 
            "id_funcionario": id_funcionario, 
            "senha": senha
        });

    return respostaLogin.body.token;

    
};
