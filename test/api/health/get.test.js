import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../helpers/appBuilder.js';

describe('GET /health', () => {
  it('retorna 200', async () => {
    const res = await request(getApp()).get('/health');
    expect(res.status).to.equal(200);
  });

  it('retorna JSON com indicador de saúde', async () => {
    const res = await request(getApp())
      .get('/health')
      .expect('Content-Type', /json/);

    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status', 'ok');
  });
});
