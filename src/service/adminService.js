import bcrypt from 'bcryptjs';
import {
  adminsById,
  adminsByFuncionario,
  adminsByEmail,
  nextAdminId,
} from '../model/store.js';
import { isValidEmail } from '../utils/validation.js';

const SALT = 10;

export function criarAdministrador(body) {
  const { nome, sobrenome, id_funcionario, email, senha } = body;

  const erros = [];
  if (!nome || String(nome).trim() === '') erros.push('Campo nome é obrigatório.');
  if (!sobrenome || String(sobrenome).trim() === '') erros.push('Campo sobrenome é obrigatório.');
  if (id_funcionario === undefined || id_funcionario === null || id_funcionario === '') {
    erros.push('Campo id_funcionario é obrigatório.');
  }
  if (!email || String(email).trim() === '') erros.push('Campo email é obrigatório.');
  if (!senha || String(senha) === '') erros.push('Campo senha é obrigatório.');

  if (erros.length) {
    const err = new Error('VALIDATION');
    err.status = 400;
    err.detalhes = erros;
    throw err;
  }

  if (!isValidEmail(email)) {
    const err = new Error('VALIDATION');
    err.status = 400;
    err.detalhes = ['Formato de email inválido.'];
    throw err;
  }

  const idF = Number(id_funcionario);
  if (!Number.isInteger(idF)) {
    const err = new Error('VALIDATION');
    err.status = 400;
    err.detalhes = ['id_funcionario deve ser um inteiro.'];
    throw err;
  }

  if (adminsByFuncionario.has(idF)) {
    const err = new Error('CONFLICT');
    err.status = 409;
    err.campo = 'id_funcionario';
    throw err;
  }

  const emailNorm = String(email).trim().toLowerCase();
  if (adminsByEmail.has(emailNorm)) {
    const err = new Error('CONFLICT');
    err.status = 409;
    err.campo = 'email';
    throw err;
  }

  const id = nextAdminId();
  const admin = {
    id,
    nome: String(nome).trim(),
    sobrenome: String(sobrenome).trim(),
    id_funcionario: idF,
    email: emailNorm,
    senhaHash: bcrypt.hashSync(String(senha), SALT),
  };

  adminsById.set(id, admin);
  adminsByFuncionario.set(idF, admin);
  adminsByEmail.set(emailNorm, admin);

  return {
    id,
    nome: admin.nome,
    sobrenome: admin.sobrenome,
    id_funcionario: admin.id_funcionario,
    email: admin.email,
  };
}

export function buscarAdminPorEmail(email) {
  return adminsByEmail.get(String(email).trim().toLowerCase()) ?? null;
}

export function buscarAdminPorFuncionario(idFuncionario) {
  return adminsByFuncionario.get(Number(idFuncionario)) ?? null;
}

export function verificarSenhaAdmin(admin, senha) {
  return bcrypt.compareSync(String(senha), admin.senhaHash);
}

export function buscarAdminPorId(id) {
  return adminsById.get(Number(id)) ?? null;
}

export function buscarAdminPublicoPorId(id) {
  const admin = adminsById.get(Number(id));
  if (!admin) return null;
  return {
    id: admin.id,
    nome: admin.nome,
    sobrenome: admin.sobrenome,
    id_funcionario: admin.id_funcionario,
    email: admin.email,
  };
}

export function listarAdministradores() {
  return Array.from(adminsById.values()).map((admin) => ({
    id: admin.id,
    nome: admin.nome,
    sobrenome: admin.sobrenome,
    id_funcionario: admin.id_funcionario,
    email: admin.email,
  }));
}

function validarAdminPayload(body, { isUpdate = false } = {}) {
  const { nome, sobrenome, id_funcionario, email, senha } = body || {};
  const erros = [];

  if (!isUpdate || nome !== undefined) {
    if (!nome || String(nome).trim() === '') erros.push('Campo nome é obrigatório.');
  }
  if (!isUpdate || sobrenome !== undefined) {
    if (!sobrenome || String(sobrenome).trim() === '') erros.push('Campo sobrenome é obrigatório.');
  }
  if (!isUpdate || id_funcionario !== undefined) {
    if (id_funcionario === undefined || id_funcionario === null || id_funcionario === '') {
      erros.push('Campo id_funcionario é obrigatório.');
    } else if (!Number.isInteger(Number(id_funcionario))) {
      erros.push('id_funcionario deve ser um inteiro.');
    }
  }
  if (!isUpdate || email !== undefined) {
    if (!email || String(email).trim() === '') erros.push('Campo email é obrigatório.');
    else if (!isValidEmail(email)) erros.push('Formato de email inválido.');
  }
  if (!isUpdate || senha !== undefined) {
    if (!senha || String(senha) === '') erros.push('Campo senha é obrigatório.');
  }

  if (erros.length) {
    const err = new Error('VALIDATION');
    err.status = 400;
    err.detalhes = erros;
    throw err;
  }
}

export function atualizarAdministrador(id, body) {
  const admin = buscarAdminPorId(id);
  if (!admin) {
    const err = new Error('NOT_FOUND');
    err.status = 404;
    throw err;
  }

  validarAdminPayload(body, { isUpdate: true });
  const payload = body || {};

  if (payload.id_funcionario !== undefined) {
    const novoIdF = Number(payload.id_funcionario);
    const existente = adminsByFuncionario.get(novoIdF);
    if (existente && existente.id !== admin.id) {
      const err = new Error('CONFLICT');
      err.status = 409;
      err.campo = 'id_funcionario';
      throw err;
    }
    adminsByFuncionario.delete(admin.id_funcionario);
    admin.id_funcionario = novoIdF;
    adminsByFuncionario.set(admin.id_funcionario, admin);
  }

  if (payload.email !== undefined) {
    const novoEmail = String(payload.email).trim().toLowerCase();
    const existente = adminsByEmail.get(novoEmail);
    if (existente && existente.id !== admin.id) {
      const err = new Error('CONFLICT');
      err.status = 409;
      err.campo = 'email';
      throw err;
    }
    adminsByEmail.delete(admin.email);
    admin.email = novoEmail;
    adminsByEmail.set(admin.email, admin);
  }

  if (payload.nome !== undefined) admin.nome = String(payload.nome).trim();
  if (payload.sobrenome !== undefined) admin.sobrenome = String(payload.sobrenome).trim();
  if (payload.senha !== undefined) admin.senhaHash = bcrypt.hashSync(String(payload.senha), SALT);

  return {
    id: admin.id,
    nome: admin.nome,
    sobrenome: admin.sobrenome,
    id_funcionario: admin.id_funcionario,
    email: admin.email,
  };
}

export function removerAdministrador(id) {
  const admin = buscarAdminPorId(id);
  if (!admin) {
    const err = new Error('NOT_FOUND');
    err.status = 404;
    throw err;
  }

  adminsById.delete(admin.id);
  adminsByFuncionario.delete(admin.id_funcionario);
  adminsByEmail.delete(admin.email);
}
