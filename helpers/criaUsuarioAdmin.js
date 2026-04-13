import request from 'supertest';

export const usuarioAdmin = async (app, nome, sobrenome, id, email, senha) => {
    const admin = await request(app)
        .post('/administradores')
        .set('Content-Type', 'application/json')
        .send({
            'nome': nome,
            'sobrenome': sobrenome,
            'id_funcionario': id,
            'email': email,
            'senha': senha
        });

    return admin;
};
