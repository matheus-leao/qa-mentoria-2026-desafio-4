import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./src/config/openapi.js";
import { requireAuth, requireRole } from "./src/middleware/auth.js";
import {
  postAdministrador,
  putAdministrador,
  deleteAdministrador,
  getAdministradores,
  getAdministradorPorId,
} from "./src/controller/adminController.js";
import {
  postLeitor,
  putLeitor,
  deleteLeitor,
  getLeitores,
  getLeitorPorId,
} from "./src/controller/leitorController.js";
import {
  postAuthLogin,
  postAuthAdminLogin,
} from "./src/controller/authController.js";
import {
  getLivros,
  getLivroPorIsbn,
  postLivro,
  putLivro,
  deleteLivro,
} from "./src/controller/livroController.js";
import { postLoginEmprestimo } from "./src/controller/emprestimoController.js";
import { postDevolucao } from "./src/controller/devolucaoController.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ erro: "Corpo JSON inválido" });
  }
  return next(err);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, { customSiteTitle: "Biblioteca API — Swagger" }),
);

app.get("/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});

app.get("/administradores", getAdministradores);
app.get("/administradores/:id", getAdministradorPorId);
app.post("/administradores", postAdministrador);
app.put("/administradores/:id", putAdministrador);
app.delete("/administradores/:id", deleteAdministrador);

app.get("/leitores", getLeitores);
app.get("/leitores/:id", getLeitorPorId);
app.post("/leitores", postLeitor);
app.put("/leitores/:id", putLeitor);
app.delete("/leitores/:id", deleteLeitor);
app.post("/auth/login", postAuthLogin);
app.post("/auth/admin/login", postAuthAdminLogin);

/** Livros: visualização livre; criação/edição/exclusão exigem usuário autenticado. */
app.get("/livros", getLivros);
app.get("/livros/:id_livro", getLivroPorIsbn);
app.post("/livros", requireAuth, postLivro);
app.put("/livros/:id_livro", requireAuth, putLivro);
app.delete("/livros/:id_livro", requireAuth, deleteLivro);

/** Empréstimo: POST /login com Bearer JWT de leitor (requisitos.md). */
app.post("/login", requireAuth, requireRole("leitor"), postLoginEmprestimo);

app.post("/devolucoes", requireAuth, requireRole("leitor"), postDevolucao);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

export default app;
