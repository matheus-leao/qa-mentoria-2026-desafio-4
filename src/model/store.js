/**
 * Armazenamento em memória (variáveis) para administradores, leitores, livros e empréstimos.
 */

export const adminsById = new Map();
export const adminsByFuncionario = new Map();
export const adminsByEmail = new Map();

export const leitoresById = new Map();
export const leitoresByEmail = new Map();

/** @type {Map<string, object>} chave: id_livro (ISBN) */
export const livrosByIsbn = new Map();

export const emprestimos = [];

let adminSeq = 1;
let leitorSeq = 1;
let emprestimoSeq = 1;

export function nextAdminId() {
  return adminSeq++;
}

export function nextLeitorId() {
  return leitorSeq++;
}

export function nextEmprestimoId() {
  return emprestimoSeq++;
}
