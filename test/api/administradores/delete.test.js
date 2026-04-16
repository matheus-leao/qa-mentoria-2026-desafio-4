import request from "supertest";
import { expect } from "chai";
import { getApp } from "../../infra/helpers/appBuilder.js";
import { postLogin } from "../../infra/helpers/autenticacao.js";

describe("DELETE /administradores/:id", () => {
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

  it("Deve retornar 204", async () => {
    const response = await request(getApp()).delete("/administradores/1");
    expect(response.status).to.equal(204);
  });
});
