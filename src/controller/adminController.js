import {
  criarAdministrador,
  atualizarAdministrador,
  removerAdministrador,
  listarAdministradores,
  buscarAdminPublicoPorId,
} from "../service/adminService.js";

export function postAdministrador(req, res) {
  try {
    const criado = criarAdministrador(req.body);
    return res.status(201).json(criado);
  } catch (e) {
    if (e.message === "VALIDATION") {
      return res.status(e.status || 400).json({
        erro: "Erro de validação",
        detalhes: e.detalhes,
      });
    }
    if (e.message === "CONFLICT") {
      const msg =
        e.campo === "id_funcionario"
          ? "Já existe administrador com este id_funcionario."
          : "Já existe administrador com este email.";
      return res.status(409).json({
        erro: "Conflito de cadastro",
        detalhes: [msg],
      });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export function getAdministradores(_req, res) {
  const lista = listarAdministradores();
  return res.status(200).json(lista);
}

export function getAdministradorPorId(req, res) {
  const admin = buscarAdminPublicoPorId(req.params.id);
  if (!admin) {
    return res.status(404).json({ erro: "Administrador não encontrado." });
  }
  return res.status(200).json(admin);
}

export function putAdministrador(req, res) {
  try {
    const atualizado = atualizarAdministrador(req.params.id, req.body);
    return res.status(200).json(atualizado);
  } catch (e) {
    if (e.message === "VALIDATION") {
      return res
        .status(400)
        .json({ erro: "Erro de validação", detalhes: e.detalhes });
    }
    if (e.message === "CONFLICT") {
      const msg =
        e.campo === "id_funcionario"
          ? "Já existe administrador com este id_funcionario."
          : "Já existe administrador com este email.";
      return res
        .status(409)
        .json({ erro: "Conflito de cadastro", detalhes: [msg] });
    }
    if (e.message === "NOT_FOUND") {
      return res.status(404).json({ erro: "Administrador não encontrado." });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export function deleteAdministrador(req, res) {
  try {
    removerAdministrador(req.params.id);
    return res.status(204).send();
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      return res.status(404).json({ erro: "Administrador não encontrado." });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
