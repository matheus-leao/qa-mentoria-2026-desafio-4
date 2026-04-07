import {
  criarLivro,
  atualizarLivro,
  removerLivro,
  listarLivros,
  buscarLivroPublicoPorIsbn,
} from '../service/livroService.js';

export function getLivros(_req, res) {
  const lista = listarLivros();
  return res.status(200).json(lista);
}

export function getLivroPorIsbn(req, res) {
  const livro = buscarLivroPublicoPorIsbn(req.params.id_livro);
  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado.' });
  }
  return res.status(200).json(livro);
}

export function postLivro(req, res) {
  try {
    const criado = criarLivro(req.body);
    return res.status(201).json(criado);
  } catch (e) {
    if (e.message === 'VALIDATION') {
      return res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: e.detalhes,
      });
    }
    if (e.message === 'CONFLICT') {
      return res.status(409).json({
        erro: 'Conflito',
        detalhes: [e.mensagem],
      });
    }
    console.error(e);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export function putLivro(req, res) {
  try {
    const atualizado = atualizarLivro(req.params.id_livro, req.body);
    return res.status(200).json(atualizado);
  } catch (e) {
    if (e.message === 'VALIDATION') {
      return res.status(400).json({ erro: 'Dados inválidos', detalhes: e.detalhes });
    }
    if (e.message === 'CONFLICT') {
      return res.status(409).json({ erro: 'Conflito', detalhes: [e.mensagem] });
    }
    if (e.message === 'NOT_FOUND') {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }
    console.error(e);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export function deleteLivro(req, res) {
  try {
    removerLivro(req.params.id_livro);
    return res.status(204).send();
  } catch (e) {
    if (e.message === 'NOT_FOUND') {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }
    console.error(e);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}
