import { emprestimos } from '../model/store.js';
import { buscarLivroPorIsbn, atualizarQtdeLivro } from './livroService.js';
/**
 * Devolução por id do empréstimo (escopo funcional: devolver livro).
 */
export function registrarDevolucao(idLeitor, body) {
  const { id_emprestimo, id_livro } = body || {};

  const hasEmprestimoId = id_emprestimo !== undefined && id_emprestimo !== null && id_emprestimo !== '';
  const hasLivroId = id_livro !== undefined && id_livro !== null && String(id_livro).trim() !== '';

  if (!hasEmprestimoId && !hasLivroId) {
    const err = new Error('BAD_REQUEST');
    err.status = 400;
    err.detalhes = ['Informe id_emprestimo ou id_livro.'];
    throw err;
  }

  let emprestimo = null;

  if (hasEmprestimoId) {
    const id = Number(id_emprestimo);
    emprestimo = emprestimos.find((e) => e.id === id);
  } else if (hasLivroId) {
    const isbn = String(id_livro).trim();
    emprestimo = emprestimos.find(
      (e) =>
        e.id_livro === isbn &&
        e.status === 'ativo' &&
        e.id_usuario === idLeitor,
    );
  }

  if (!emprestimo) {
    const err = new Error('NOT_FOUND');
    err.status = 404;
    err.detalhes = ['Empréstimo ativo não encontrado para este usuário.'];
    throw err;
  }

  if (emprestimo.id_usuario !== idLeitor) {
    const err = new Error('FORBIDDEN');
    err.status = 403;
    throw err;
  }

  if (emprestimo.status !== 'ativo') {
    const err = new Error('BAD_REQUEST');
    err.status = 400;
    err.detalhes = ['Este empréstimo já foi devolvido.'];
    throw err;
  }

  const livro = buscarLivroPorIsbn(emprestimo.id_livro);
  if (livro) {
    atualizarQtdeLivro(emprestimo.id_livro, livro.qtde_disponivel + 1);
  }

  emprestimo.status = 'devolvido';
  return {
    mensagem: 'Devolução registrada com sucesso.',
    id_emprestimo: emprestimo.id,
    id_livro: emprestimo.id_livro,
  };
}

export function listarEmprestimosDoLeitor(idLeitor) {
  return emprestimos.filter((e) => e.id_usuario === idLeitor);
}
