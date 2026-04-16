import request from "supertest";
import { expect } from "chai";
import { getApp } from "../../infra/helpers/appBuilder.js";
import { postLogin } from "../../infra/helpers/autenticacao.js";

describe("PUT /administradores/:id", () => {
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

  it("Deve retornar 200 ao editar o cadastro de um administrador", async () => {
    const bodyPut = {
      nome: "Teste",
      sobrenome: "Nascimento",
      id_funcionario: 10,
      email: "teste@example.com",
      senha: "1234567",
    };
    const response = await request(getApp())
      .put("/administradores/2")
      .send(bodyPut);
    expect(response.status).to.equal(200);
    expect(response.body.nome).to.equal(bodyPut.nome);
    expect(response.body.sobrenome).to.equal(bodyPut.sobrenome);
    expect(response.body.id_funcionario).to.equal(bodyPut.id_funcionario);
    expect(response.body.email).to.equal(bodyPut.email);
  });
});
