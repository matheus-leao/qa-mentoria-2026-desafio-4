import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';

describe('Suite de Teste Cadastro Leitores', () => {

    it('Deve retornar 201 no cadastro de leitor', async () => {
        const res = await request(getApp()).post('/leitores').send({
            "nome": "Teste",
            "sobrenome": "123",
            "email": "teste@teste.com",
            "senha": "12345678"
        });
        expect(res.status).to.equal(201);
    });

    it('Deve retornar 200', async () => {
        const res = await request(getApp()).get('/leitores');
        expect(res.status).to.equal(200);
    });

    it('Deve retornar JSON com lista de leitores', async () => {
        const res = await request(getApp())
            .get('/leitores')
            .expect('Content-Type', /json/);
        expect(res.body).to.be.an('array');
    });

    it('Deve retornar um leitor específico', async () => {
        const res = await request(getApp())
            .get('/leitores/1')
            .expect('Content-Type', /json/);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', 1);
    });

    it('Deve retornar 404 para leitor não encontrado', async () => {
        const res = await request(getApp()).get('/leitores/999');
        expect(res.status).to.equal(404);
    });

    it('Deve retornar 400 para dados de cadastro inválidos', async () => {
        const res = await request(getApp()).post('/leitores').send({
            nome: '',
            email: 'invalid-email'
        });
        expect(res.status).to.equal(400);
    });

    it('Deve retornar 400 para email já cadastrado', async () => {
        // Primeiro, cadastra um leitor
        await request(getApp()).post('/leitores').send({
            nome: 'Jane Doe',
            email: 'jane.doe@example.com'
        });
        // Tenta cadastrar o mesmo leitor novamente
        const res = await request(getApp()).post('/leitores').send({
            nome: 'Jane Doe',
            email: 'jane.doe@example.com'
        });
        expect(res.status).to.equal(400);
    });

    it('Deve retornar 200 ao atualizar um leitor', async () => {
        // Primeiro, cadastra um leitor
        const createRes = await request(getApp()).post('/leitores').send({
            nome: 'Mark Smith',
            email: 'mark.smith@example.com'
        });
        // Atualiza o leitor
        const res = await request(getApp()).put('/leitores/1').send({
            nome: 'Mark Johnson',
            email: 'mark.johnson@example.com'
        });
        expect(res.status).to.equal(200);
    });

    it('Deve retornar 404 ao atualizar um leitor inexistente', async () => {
        const res = await request(getApp()).put('/leitores/999').send({
            nome: 'Non Existent',
            email: 'non.existent@example.com'
        });
        expect(res.status).to.equal(404);
    });

    it('Deve retornar 200 ao deletar um leitor', async () => {
        // Primeiro, cadastra um leitor
        const createRes = await request(getApp()).post('/leitores').send({
            nome: 'Alice Brown',
            sobrenome: 'Brown',
            email: 'alice.brown@example.com',
            senha: '87654321'
        });
        // Deleta o leitor
        const res = await request(getApp()).delete('/leitores/1');
        expect(res.status).to.equal(204);
    });

    it('Deve retornar 404 ao deletar um leitor inexistente', async () => {
        const res = await request(getApp()).delete('/leitores/999');
        expect(res.status).to.equal(404);
    });

});