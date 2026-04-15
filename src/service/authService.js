import { signToken } from "../middleware/auth.js";
import {
  buscarAdminPorFuncionario,
  verificarSenhaAdmin,
} from "./adminService.js";
import { buscarLeitorPorEmail, verificarSenhaLeitor } from "./leitorService.js";

export function loginLeitor(email, senha) {
  const leitor = buscarLeitorPorEmail(email);
  if (!leitor || !verificarSenhaLeitor(leitor, senha)) {
    const err = new Error("AUTH");
    err.status = 401;
    err.mensagem = "Credenciais inválidas.";
    throw err;
  }
  const token = signToken({
    sub: leitor.id,
    role: "leitor",
    email: leitor.email,
  });
  return {
    token,
    tipo: "Bearer",
    usuario: {
      id: leitor.id,
      nome: leitor.nome,
      sobrenome: leitor.sobrenome,
      email: leitor.email,
    },
  };
}

/**
 * Login de administrador por id_funcionario + senha (documentação não define rota; necessário para JWT em /livros).
 */
export function loginAdmin(idFuncionario, senha) {
  const admin = buscarAdminPorFuncionario(idFuncionario);
  if (!admin || !verificarSenhaAdmin(admin, senha)) {
    const err = new Error("AUTH");
    err.status = 401;
    err.mensagem = "Credenciais inválidas.";
    throw err;
  }
  const token = signToken({
    sub: admin.id,
    role: "admin",
    id_funcionario: admin.id_funcionario,
    email: admin.email,
  });
  return {
    token,
    tipo: "Bearer",
    usuario: {
      id: admin.id,
      nome: admin.nome,
      sobrenome: admin.sobrenome,
      id_funcionario: admin.id_funcionario,
      email: admin.email,
    },
  };
}
