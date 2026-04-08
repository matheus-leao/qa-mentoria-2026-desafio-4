import request from 'supertest';
//const request = require('supertest');

export const obterToken = async (id, senha) => {
    const respostaLogin = await request(process.env.BASE_URL)
        .post('/login')
        .set('Content-Type', "application/json")
        .send({ 
            "id_funcionario": id, 
            "senha": senha
        });

    return respostaLogin.body.token;

    
};