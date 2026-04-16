import request from 'supertest';
import { expect } from 'chai';
import { getApp } from '../../infra/helpers/appBuilder.js';
import { postLogin } from '../../infra/helpers/autenticacao.js';

describe("GET /administradores", () => {
  let responseLogin;

  beforeEach(async () => {
    responseLogin = await postLogin(
      "Luana",
      "Nascimento",
      11,
      "luana@example.com",
      "123456",
    );
  });

  it("Deve retornar 200 contendo uma lista dos administradores cadastrados", async () => {
    const response = await request(getApp()).get("/administradores");
    expect(response.status).to.equal(200);
  });
});

describe("GET /administradores/:id", () => {
  let responseLogin;

  beforeEach(async () => {
    responseLogin = await postLogin(
      "Luana",
      "Nascimento",
      11,
      "luana@example.com",
      "123456",
    );
  });

  it("Deve retornar 200 contendo um administrador específico", async () => {
    const response = await request(getApp()).get("/administradores/2");
    expect(response.status).to.equal(200);
  });
});
