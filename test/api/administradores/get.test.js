import request from "supertest";
import { expect } from "chai";
import { getApp } from "../../infra/helpers/appBuilder.js";
import { postLogin } from "../../infra/helpers/autenticacao.js";
import { faker } from "@faker-js/faker";
import { criaUsuarioAdmin } from "../../infra/helpers/criaUsuarioAdmin.js";
import { obterToken } from "../../infra/helpers/autenticacao.js";

describe("GET /administradores/:id", () => {
  let token;
  let adminId;

  const usuarioAdminFaker = {
    nome: faker.person.firstName(),
    sobrenome: faker.person.lastName(),
    id_funcionario: faker.number.int(),
    email: faker.internet.email(),
    senha: "senha123",
  };

  before(async () => {
    adminId = (await criaUsuarioAdmin(getApp(), usuarioAdminFaker)).body.id;
    token = await obterToken(
      getApp(),
      usuarioAdminFaker.id_funcionario,
      usuarioAdminFaker.senha,
    );
  });

  it("Deve retornar 200 contendo um administrador específico", async () => {
    const response = await request(getApp()).get(`/administradores/${adminId}`);
    expect(response.status).to.equal(200);
  });

  it("Deve retornar 200 contendo uma lista dos administradores cadastrados", async () => {
    const response = await request(getApp()).get("/administradores");
    expect(response.status).to.equal(200);
  });
});
