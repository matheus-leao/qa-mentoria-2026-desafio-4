import request from "supertest";
import { expect } from "chai";
import { getApp } from "../helpers/appBuilder.js";
import { criaUsuarioAdmin } from "../helpers/criaUsuarioAdmin.js";
import { obterToken } from "../helpers/autenticacao.js";
import { cadastrarLivroValido } from "../helpers/cadastraLivro.js";
import { faker } from "@faker-js/faker";

describe("Testes de Cadastro de Livros", () => {
  let token;
  let livroCadastrado;

  const usuarioAdminFaker = {
    nome: faker.person.firstName(),
    sobrenome: faker.person.lastName(),
    id_funcionario: faker.number.int(),
    email: faker.internet.email(),
    senha: "senha123",
  };

  const livro = {
    id_livro: faker.number.hex(5),
    nome: faker.book.title(),
    autores: [faker.book.author(), faker.book.author()],
    ano_publicacao: faker.number.int({ min: 1800, max: 2026 }),
    edicao: 1,
    paginas: faker.number.int({ min: 200, max: 400 }),
    qtde_disponivel: 5,
    categoria: [faker.book.genre()],
    editora: faker.book.publisher(),
    idioma: "Português",
  };

  before(async () => {
    await criaUsuarioAdmin(getApp(), usuarioAdminFaker);
    token = await obterToken(
      getApp(),
      usuarioAdminFaker.id_funcionario,
      usuarioAdminFaker.senha,
    );
    livroCadastrado = await cadastrarLivroValido(getApp(), token, livro);
  });

  describe("GET /cadastroLivros", () => {
    it("BUsca a lista de Livros cadastrados", async () => {
      const resposta = await request(getApp())
        .get("/livros")
        .set("Authorization", `Bearer ${token}`);

      expect(resposta.status).to.equal(200);
    });
  });

  describe("POST /Livros", () => {
    it.skip("Cadastra um novo livro e retorna 201 ", async () => {
      const livroValido = { ...livroCadastrado, id_livro: "201S" };
      //Bug rastreado em: https://github.com/matheus-leao/qa-mentoria-2026-desafio-4/issues/23#issue-4249456071
      const resposta = await request(getApp())
        .post("/livros")
        .set("Authorization", `Bearer ${token}`)
        .send(livroValido);

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.be.deep.equal(livroValido);
    });

    it("Tenta cadastrar um novo livro com dados inválidos ou ausentes e retorna 400 ", async () => {
      const livroInvalido = { ...livroCadastrado, autores: "" }; // Deveria ter no mínimo um autor

      const resposta = await request(getApp())
        .post("/livros")
        .set("Authorization", `Bearer ${token}`)
        .send(livroInvalido);

      expect(resposta.status).to.equal(400);
      expect(resposta.body.erro).to.equal("Dados inválidos");
    });

    it("Cadastra um novo livro sem token de validação do usuário admin e retorna 401 ", async () => {
      const tokenInvalido = ""; // Deveria ter o token de autenticação do usuário admin
      const livroValido = { ...livroCadastrado, id_livro: "401A" };

      const resposta = await request(getApp())
        .post("/livros")
        .set("Authorization", `Bearer ${tokenInvalido}`)
        .send(livroValido);

      expect(resposta.status).to.equal(401);
    });

    it("Cadastra um novo livro duplicado e retorna 409 ", async () => {
      const livroDuplicado = { ...livroCadastrado }; // ID já cadastrado no sistema

      const resposta = await request(getApp())
        .post("/livros")
        .set("Authorization", `Bearer ${token}`)
        .send(livroDuplicado);

      expect(resposta.status).to.equal(409);
      expect(resposta.body.erro).to.equal("Conflito");
      expect(resposta.body).to.have.property("detalhes").that.is.an("array");
    });
  });

  describe("GET /Livros/{id_livro}", () => {
    it("Busca um livro específico por ID e retorna 200 ", async () => {
      const resposta = await request(getApp())
        .get("/livros/10STD")
        .send(livroCadastrado.id_livro);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.id_livro).to.equal("10STD");
    });

    it("Busca um livro específico com ID incorreto e retorna 404 ", async () => {
      const livroInexistente = { ...livroCadastrado, id_livro: "999" }; // ID que não existe no sistema
      const resposta = await request(getApp())
        .get("/livros/999")
        .set("Authorization", `Bearer ${token}`)
        .send(livroInexistente.id_livro);

      expect(resposta.status).to.equal(404);
    });
  });

  describe("PUT /Livros/{id_livro}", () => {
    it("Atualiza um livro específico por ID e retorna 200 ", async () => {
      const livroAtualizado = {
        ...livroCadastrado,
        nome: "Livro de Teste Atualizado",
      };
      const resposta = await request(getApp())
        .put(`/livros/${livro.id_livro}`)
        .set("Authorization", `Bearer ${token}`)
        .send(livroAtualizado);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.nome).to.equal("Livro de Teste Atualizado");
    });

    it("Tenta atualizar um livro com ID incorreto e retorna 404 ", async () => {
      const resposta = await request(getApp())
        .put("/livros/999")
        .set("Authorization", `Bearer ${token}`)
        .send(livroCadastrado);

      expect(resposta.status).to.equal(404);
    });

    it("Tenta atualizar um livro sem token de autenticação e retorna 401 ", async () => {
      const tokenInvalido = ""; // Deveria ter o token de autenticação do usuário admin

      const resposta = await request(getApp())
        .put("/livros/10STD")
        .set("Authorization", `Bearer ${tokenInvalido}`)
        .send(livroCadastrado);

      expect(resposta.status).to.equal(401);
    });

    it("Tenta atualizar um livro com dados inválidos e retorna 400 ", async () => {
      const livroAtualizado = { ...livro, nome: "" }; // Nome não pode ser vazio
      const resposta = await request(getApp())
        .put("/livros/10STD")
        .set("Authorization", `Bearer ${token}`)
        .send(livroAtualizado);

      expect(resposta.status).to.equal(400);
      expect(resposta.body.erro).to.equal("Dados inválidos");
    });

    it("Tenta atualizar um livro para um ID já existente e retorna 409 ", async () => {
      const livroAtualizadoA = {
        ...livro,
        id_livro: "409PUT",
        nome: "Livro PUT 409A",
      };

      const criacao = await request(getApp())
        .post("/livros")
        .set("Authorization", `Bearer ${token}`)
        .send(livroAtualizadoA);

      expect(criacao.status).to.equal(201);

      const resposta = await request(getApp())
        .put("/livros/409PUT")
        .set("Authorization", `Bearer ${token}`)
        .send(livroCadastrado);

      expect(resposta.status).to.equal(409);
      expect(resposta.body.erro).to.equal("Conflito");
    });
  });

  describe("DELETE /Livros/{id_livro}", () => {
    it("Deleta um livro específico por ID e retorna 204 ", async () => {
      const livroParaDeletar = {
        ...livroCadastrado,
        id_livro: "DEL001",
        nome: "Livro para Deletar",
      };
      const criacao = await request(getApp())
        .post("/livros")
        .set("Authorization", `Bearer ${token}`)
        .send(livroParaDeletar);

      expect(criacao.status).to.equal(201);

      const resposta = await request(getApp())
        .delete("/livros/DEL001")
        .set("Authorization", `Bearer ${token}`);

      expect(resposta.status).to.equal(204);
    });

    it("Tenta deletar um livro com ID incorreto e retorna 404 ", async () => {
      const resposta = await request(getApp())
        .delete("/livros/999")
        .set("Authorization", `Bearer ${token}`);

      expect(resposta.status).to.equal(404);
    });

    it("Tenta deletar um livro sem token de autenticação e retorna 401 ", async () => {
      const tokenInvalido = ""; // Deveria ter o token de autenticação do usuário admin

      const resposta = await request(getApp())
        .delete("/livros/10STD")
        .set("Authorization", `Bearer ${tokenInvalido}`);

      expect(resposta.status).to.equal(401);
    });
  });
});
