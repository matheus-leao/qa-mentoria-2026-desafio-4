import request from 'supertest';
import app from '../../../app.js';

export const postLogin = async (nome, sobrenome, id_funcionario, email, senha) => {
    await request(app)
        .post('/administradores')
        .set('Content-Type', 'application/json')
        .send({
            nome,
            sobrenome,
            id_funcionario,
            email,
            senha,
        });

    const respostaLogin = await request(app)
        .post('/auth/admin/login')
        .set('Content-Type', 'application/json')
        .send({
            id_funcionario,
            senha,
        });

    return respostaLogin;
};

export const obterToken = async (appInstance, id_funcionario, senha) => {
    const respostaLogin = await request(appInstance)
        .post('/auth/admin/login')
        .set('Content-Type', "application/json")
        .send({
            "id_funcionario": id_funcionario,
            "senha": senha
        });

    return respostaLogin.body.token;
};

export const obterTokenLeitor = async (appInstance, email, senha) => {
    const respostaLogin = await request(appInstance)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email, senha });

    return respostaLogin.body.token;
};
