import { loginLeitor, loginAdmin } from "../service/authService.js";

export function postAuthLogin(req, res) {
  try {
    const { email, senha } = req.body || {};
    if (!email || senha === undefined || senha === "") {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: ["Informe email e senha."],
      });
    }
    const resultado = loginLeitor(email, senha);
    return res.status(200).json(resultado);
  } catch (e) {
    if (e.message === "AUTH") {
      return res.status(401).json({ erro: e.mensagem });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export function postAuthAdminLogin(req, res) {
  try {
    const { id_funcionario, senha } = req.body || {};
    if (
      id_funcionario === undefined ||
      id_funcionario === "" ||
      senha === undefined ||
      senha === ""
    ) {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: ["Informe id_funcionario e senha."],
      });
    }
    const resultado = loginAdmin(id_funcionario, senha);
    return res.status(200).json(resultado);
  } catch (e) {
    if (e.message === "AUTH") {
      return res.status(401).json({ erro: e.mensagem });
    }
    console.error(e);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
