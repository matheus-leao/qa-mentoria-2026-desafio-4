import { registrarDevolucao } from "../service/devolucaoService.js";

export function postDevolucao(req, res) {
  try {
    const idLeitor = req.auth.sub;
    const resultado = registrarDevolucao(idLeitor, req.body);
    return res.status(200).json(resultado);
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      return res.status(404).json({
        erro: "Não encontrado",
        detalhes: e.detalhes,
      });
    }
    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ erro: "Usuário não autorizado." });
    }
    if (e.message === "BAD_REQUEST") {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: e.detalhes,
      });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
