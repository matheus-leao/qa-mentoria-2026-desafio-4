import { criarEmprestimo } from "../service/emprestimoService.js";

export function postLoginEmprestimo(req, res) {
  try {
    const idLeitor = req.auth.sub;
    const emprestimo = criarEmprestimo(idLeitor, req.body);
    return res.status(201).json(emprestimo);
  } catch (e) {
    if (e.message === "EMPRESTIMO_VALIDATION") {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: e.detalhes,
      });
    }
    if (e.message === "NOT_FOUND" || e.status === 400) {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: e.detalhes || ["Solicitação inválida."],
      });
    }
    if (e.message === "INDISPONIVEL") {
      return res.status(409).json({
        erro: "Livro indisponivel",
        detalhes: [
          `Nao existe unidade de livros disponiveis para emprestimo no momento. Proxima devolucao ser em ${e.data_devolucao}`,
        ],
      });
    }
    if (e.message === "INTERNAL") {
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
