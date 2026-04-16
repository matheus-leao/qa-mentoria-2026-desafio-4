import request from "supertest";
import { expect } from "chai";
import { getApp } from "../../infra/helpers/appBuilder.js";
import { faker } from "@faker-js/faker";

describe("POST /administradores", () => {
  it("Deve retornar 201 ao realizar o cadastro corretamente de um administrador", async () => {
    const bodyPost = {
      nome: faker.person.firstName(),
      sobrenome: faker.person.lastName(),
      id_funcionario: faker.number.int(3),
      email: faker.internet.email().toLowerCase(),
      senha: "123456",
    };
    const response = await request(getApp())
      .post("/administradores")
      .send(bodyPost);

    expect(response.status).to.equal(201);
    expect(response.body.nome).to.equal(bodyPost.nome);
    expect(response.body.sobrenome).to.equal(bodyPost.sobrenome);
    expect(response.body.id_funcionario).to.equal(bodyPost.id_funcionario);
    expect(response.body.email).to.equal(bodyPost.email);
  });
});
