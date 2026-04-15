import request from 'supertest';

export const criaLeitor = async (app, usuarioLeitor) => {
    const leitor = await request(app)
        .post('/leitores')
        .set('Content-Type', 'application/json')
        .send({
            'nome': usuarioLeitor.nome,
            'sobrenome': usuarioLeitor.sobrenome,
            'email': usuarioLeitor.email,
            'senha': usuarioLeitor.senha
        });

    return leitor;
};
