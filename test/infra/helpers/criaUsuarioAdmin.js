import request from "supertest";

export const criaUsuarioAdmin = async (app, usuarioAdmin) => {
  const admin = await request(app)
    .post("/administradores")
    .set("Content-Type", "application/json")
    .send({
      nome: usuarioAdmin.nome,
      sobrenome: usuarioAdmin.sobrenome,
      id_funcionario: usuarioAdmin.id_funcionario,
      email: usuarioAdmin.email,
      senha: usuarioAdmin.senha,
    });

  return admin;
};
