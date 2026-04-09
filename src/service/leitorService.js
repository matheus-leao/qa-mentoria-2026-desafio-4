import bcrypt from 'bcryptjs';
import { leitoresById, leitoresByEmail, nextLeitorId } from '../model/store.js';
import { isValidEmail } from '../utils/validation.js';

const SALT = 10;

export function criarLeitor(body) {
  const { nome, sobrenome, email, senha } = body;

  const erros = [];
  if (!nome || String(nome).trim() === '') erros.push('Campo nome é obrigatório.');
  if (!sobrenome || String(sobrenome).trim() === '') erros.push('Campo sobrenome é obrigatório.');
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

  const emailNorm = String(email).trim().toLowerCase();
  if (leitoresByEmail.has(emailNorm)) {
    const err = new Error('CONFLICT');
    err.status = 409;
    err.campo = 'email';
    throw err;
  }

  const id = nextLeitorId();
  const leitor = {
    id,
    nome: String(nome).trim(),
    sobrenome: String(sobrenome).trim(),
    email: emailNorm,
    senhaHash: bcrypt.hashSync(String(senha), SALT),
  };

  leitoresById.set(id, leitor);
  leitoresByEmail.set(emailNorm, leitor);

  return {
    id,
    nome: leitor.nome,
    sobrenome: leitor.sobrenome,
    email: leitor.email,
  };
}

export function buscarLeitorPorEmail(email) {
  return leitoresByEmail.get(String(email).trim().toLowerCase()) ?? null;
}

export function buscarLeitorPorId(id) {
  return leitoresById.get(Number(id)) ?? null;
}

export function verificarSenhaLeitor(leitor, senha) {
  return bcrypt.compareSync(String(senha), leitor.senhaHash);
}

export function buscarLeitorPublicoPorId(id) {
  const leitor = leitoresById.get(Number(id));
  if (!leitor) return null;
  return {
    id: leitor.id,
    nome: leitor.nome,
    sobrenome: leitor.sobrenome,
    email: leitor.email,
  };
}

export function listarLeitores() {
  return Array.from(leitoresById.values()).map((leitor) => ({
    id: leitor.id,
    nome: leitor.nome,
    sobrenome: leitor.sobrenome,
    email: leitor.email,
  }));
}

function validarLeitorPayload(body, { isUpdate = false } = {}) {
  const { nome, sobrenome, email, senha } = body || {};
  const erros = [];

  if (!isUpdate || nome !== undefined) {
    if (!nome || String(nome).trim() === '') erros.push('Campo nome é obrigatório.');
  }
  if (!isUpdate || sobrenome !== undefined) {
    if (!sobrenome || String(sobrenome).trim() === '') erros.push('Campo sobrenome é obrigatório.');
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

export function atualizarLeitor(id, body) {
  const leitor = leitoresById.get(Number(id));
  if (!leitor) {
    const err = new Error('NOT_FOUND');
    err.status = 404;
    throw err;
  }

  validarLeitorPayload(body, { isUpdate: true });
  const payload = body || {};

  if (payload.email !== undefined) {
    const novoEmail = String(payload.email).trim().toLowerCase();
    const existente = leitoresByEmail.get(novoEmail);
    if (existente && existente.id !== leitor.id) {
      const err = new Error('CONFLICT');
      err.status = 409;
      err.campo = 'email';
      throw err;
    }
    leitoresByEmail.delete(leitor.email);
    leitor.email = novoEmail;
    leitoresByEmail.set(leitor.email, leitor);
  }

  if (payload.nome !== undefined) leitor.nome = String(payload.nome).trim();
  if (payload.sobrenome !== undefined) leitor.sobrenome = String(payload.sobrenome).trim();
  if (payload.senha !== undefined) leitor.senhaHash = bcrypt.hashSync(String(payload.senha), SALT);

  return {
    id: leitor.id,
    nome: leitor.nome,
    sobrenome: leitor.sobrenome,
    email: leitor.email,
  };
}

export function removerLeitor(id) {
  const leitor = leitoresById.get(Number(id));
  if (!leitor) {
    const err = new Error('NOT_FOUND');
    err.status = 404;
    throw err;
  }
  leitoresById.delete(leitor.id);
  leitoresByEmail.delete(leitor.email);
}
