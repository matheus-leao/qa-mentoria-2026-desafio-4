import request from 'supertest';

export const usuarioAdmin = async (app, nome, sobrenome, id_funcionario, email, senha) => {
    const admin = await request(app)
        .post('/administradores')
        .set('Content-Type', 'application/json')
        .send({
            'nome': nome,
            'sobrenome': sobrenome,
            'id_funcionario': id_funcionario,
            'email': email,
            'senha': senha
        });

    return admin;
};
