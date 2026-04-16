import {
  criarLeitor,
  atualizarLeitor,
  removerLeitor,
  listarLeitores,
  buscarLeitorPublicoPorId,
} from "../service/leitorService.js";

export function postLeitor(req, res) {
  try {
    const criado = criarLeitor(req.body);
    return res.status(201).json(criado);
  } catch (e) {
    if (e.message === "VALIDATION") {
      return res.status(400).json({
        erro: "Erro de validação",
        detalhes: e.detalhes,
      });
    }
    if (e.message === "CONFLICT") {
      return res.status(409).json({
        erro: "Conflito de cadastro",
        detalhes: ["Já existe leitor com este email."],
      });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export function getLeitores(_req, res) {
  const lista = listarLeitores();
  return res.status(200).json(lista);
}

export function getLeitorPorId(req, res) {
  const leitor = buscarLeitorPublicoPorId(req.params.id);
  if (!leitor) {
    return res.status(404).json({ erro: "Leitor não encontrado." });
  }
  return res.status(200).json(leitor);
}

export function putLeitor(req, res) {
  try {
    const atualizado = atualizarLeitor(req.params.id, req.body);
    return res.status(200).json(atualizado);
  } catch (e) {
    if (e.message === "VALIDATION") {
      return res
        .status(400)
        .json({ erro: "Erro de validação", detalhes: e.detalhes });
    }
    if (e.message === "CONFLICT") {
      return res
        .status(409)
        .json({
          erro: "Conflito de cadastro",
          detalhes: ["Já existe leitor com este email."],
        });
    }
    if (e.message === "NOT_FOUND") {
      return res.status(404).json({ erro: "Leitor não encontrado." });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export function deleteLeitor(req, res) {
  try {
    removerLeitor(req.params.id);
    return res.status(204).send();
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      return res.status(404).json({ erro: "Leitor não encontrado." });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
