import { livrosByIsbn } from "../model/store.js";
import { livroSignature, normalizeAutores } from "../utils/validation.js";

const signatures = new Map();

function anoValido(ano) {
  const y = Number(ano);
  const current = new Date().getFullYear();
  if (!Number.isInteger(y) || y < 0 || y > current) return false;
  return true;
}

function toLivroResponse(livro) {
  return {
    ...livro,
    autores: normalizeAutores(livro.autores),
  };
}

export function criarLivro(body) {
  const {
    id_livro,
    nome,
    autores,
    ano_publicacao,
    edicao,
    paginas,
    qtde_disponivel,
    categoria,
    editora,
    idioma,
  } = body;

  const erros = [];
  if (!id_livro || String(id_livro).trim() === "") {
    erros.push("Campo id_livro (ISBN) é obrigatório.");
  }
  if (!nome || String(nome).trim() === "")
    erros.push("Nome do livro é obrigatório.");

  const autoresArr = normalizeAutores(autores);
  if (autoresArr.length < 1) erros.push("Informe ao menos um autor.");

  if (
    ano_publicacao === undefined ||
    ano_publicacao === null ||
    ano_publicacao === ""
  ) {
    erros.push("Ano de publicação é obrigatório.");
  } else if (!anoValido(ano_publicacao)) {
    erros.push("Ano de publicação inválido ou futuro.");
  }

  if (
    qtde_disponivel === undefined ||
    qtde_disponivel === null ||
    qtde_disponivel === ""
  ) {
    erros.push("Quantidade de exemplares no acervo é obrigatória.");
  } else {
    const q = Number(qtde_disponivel);
    if (!Number.isInteger(q) || q <= 0) {
      erros.push("Quantidade de exemplares deve ser um inteiro positivo.");
    }
  }

  let categorias = [];
  if (categoria !== undefined && categoria !== null && categoria !== "") {
    if (Array.isArray(categoria)) {
      categorias = categoria.map((c) => String(c).trim()).filter(Boolean);
    } else {
      categorias = String(categoria)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }
    if (categorias.length > 3) {
      erros.push("No máximo 3 categorias por livro.");
    }
  }

  const ed =
    edicao === undefined || edicao === null || edicao === ""
      ? 1
      : Number(edicao);
  if (!Number.isInteger(ed) || ed < 1) {
    erros.push("Edição deve ser um inteiro positivo.");
  }

  if (erros.length) {
    const err = new Error("VALIDATION");
    err.status = 400;
    err.detalhes = erros;
    throw err;
  }

  const isbn = String(id_livro).trim();
  if (livrosByIsbn.has(isbn)) {
    const err = new Error("CONFLICT");
    err.status = 409;
    err.mensagem = "Já existe um livro com este ISBN.";
    throw err;
  }

  const ano = Number(ano_publicacao);
  const sig = livroSignature(nome, autoresArr, ano, ed);
  if (signatures.has(sig)) {
    const err = new Error("CONFLICT");
    err.status = 409;
    err.mensagem =
      "Já existe cadastro para a combinação título, autor, ano e edição.";
    throw err;
  }

  const qtd = Number(qtde_disponivel);
  const livro = {
    id_livro: isbn,
    nome: String(nome).trim(),
    autores: autoresArr.join(", "),
    ano_publicacao: ano,
    edicao: ed,
    paginas: paginas === undefined || paginas === "" ? null : Number(paginas),
    qtde_disponivel: qtd,
    categoria: categorias,
    editora: editora === undefined ? null : String(editora),
    idioma: idioma === undefined ? null : String(idioma),
  };

  livrosByIsbn.set(isbn, livro);
  signatures.set(sig, isbn);

  return toLivroResponse(livro);
}

export function buscarLivroPorIsbn(isbn) {
  return livrosByIsbn.get(String(isbn).trim()) ?? null;
}

export function atualizarQtdeLivro(isbn, novaQtde) {
  const livro = livrosByIsbn.get(String(isbn).trim());
  if (livro) livro.qtde_disponivel = novaQtde;
}

export function listarLivros() {
  return Array.from(livrosByIsbn.values()).map(toLivroResponse);
}

export function buscarLivroPublicoPorIsbn(isbn) {
  const livro = livrosByIsbn.get(String(isbn).trim());
  return livro ? toLivroResponse(livro) : null;
}

function normalizarLivroPayload(body, { isUpdate = false } = {}) {
  const {
    id_livro,
    nome,
    autores,
    ano_publicacao,
    edicao,
    paginas,
    qtde_disponivel,
    categoria,
    editora,
    idioma,
  } = body || {};

  const erros = [];

  if (!isUpdate || id_livro !== undefined) {
    if (!id_livro || String(id_livro).trim() === "")
      erros.push("Campo id_livro (ISBN) é obrigatório.");
  }
  if (!isUpdate || nome !== undefined) {
    if (!nome || String(nome).trim() === "")
      erros.push("Nome do livro é obrigatório.");
  }

  let autoresArr = null;
  if (!isUpdate || autores !== undefined) {
    autoresArr = normalizeAutores(autores);
    if (autoresArr.length < 1) erros.push("Informe ao menos um autor.");
  }

  if (!isUpdate || ano_publicacao !== undefined) {
    if (
      ano_publicacao === undefined ||
      ano_publicacao === null ||
      ano_publicacao === ""
    ) {
      erros.push("Ano de publicação é obrigatório.");
    } else if (!anoValido(ano_publicacao)) {
      erros.push("Ano de publicação inválido ou futuro.");
    }
  }

  if (!isUpdate || qtde_disponivel !== undefined) {
    if (
      qtde_disponivel === undefined ||
      qtde_disponivel === null ||
      qtde_disponivel === ""
    ) {
      erros.push("Quantidade de exemplares no acervo é obrigatória.");
    } else {
      const q = Number(qtde_disponivel);
      if (!Number.isInteger(q) || q <= 0)
        erros.push("Quantidade de exemplares deve ser um inteiro positivo.");
    }
  }

  let categorias = null;
  if (!isUpdate || categoria !== undefined) {
    categorias = [];
    if (categoria !== undefined && categoria !== null && categoria !== "") {
      if (Array.isArray(categoria)) {
        categorias = categoria.map((c) => String(c).trim()).filter(Boolean);
      } else {
        categorias = String(categoria)
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
      }
      if (categorias.length > 3)
        erros.push("No máximo 3 categorias por livro.");
    }
  }

  if (!isUpdate || edicao !== undefined) {
    const ed =
      edicao === undefined || edicao === null || edicao === ""
        ? 1
        : Number(edicao);
    if (!Number.isInteger(ed) || ed < 1)
      erros.push("Edição deve ser um inteiro positivo.");
  }

  if (erros.length) {
    const err = new Error("VALIDATION");
    err.status = 400;
    err.detalhes = erros;
    throw err;
  }

  return {
    id_livro,
    nome,
    autoresArr,
    ano_publicacao,
    edicao,
    paginas,
    qtde_disponivel,
    categorias,
    editora,
    idioma,
  };
}

export function atualizarLivro(isbnParam, body) {
  const isbnAtual = String(isbnParam).trim();
  const livro = livrosByIsbn.get(isbnAtual);
  if (!livro) {
    const err = new Error("NOT_FOUND");
    err.status = 404;
    throw err;
  }

  const payload = normalizarLivroPayload(body, { isUpdate: true });
  const novoIsbn =
    payload.id_livro !== undefined
      ? String(payload.id_livro).trim()
      : livro.id_livro;
  if (novoIsbn !== livro.id_livro && livrosByIsbn.has(novoIsbn)) {
    const err = new Error("CONFLICT");
    err.status = 409;
    err.mensagem = "Já existe um livro com este ISBN.";
    throw err;
  }

  const nome =
    payload.nome !== undefined ? String(payload.nome).trim() : livro.nome;
  const autoresArr =
    payload.autoresArr !== null
      ? payload.autoresArr
      : normalizeAutores(livro.autores);
  const ano =
    payload.ano_publicacao !== undefined
      ? Number(payload.ano_publicacao)
      : livro.ano_publicacao;
  const ed =
    payload.edicao !== undefined ? Number(payload.edicao) : livro.edicao;

  const assinaturaAtual = livroSignature(
    livro.nome,
    normalizeAutores(livro.autores),
    livro.ano_publicacao,
    livro.edicao,
  );
  const novaAssinatura = livroSignature(nome, autoresArr, ano, ed);
  const isbnAssinaturaExistente = signatures.get(novaAssinatura);
  if (isbnAssinaturaExistente && isbnAssinaturaExistente !== livro.id_livro) {
    const err = new Error("CONFLICT");
    err.status = 409;
    err.mensagem =
      "Já existe cadastro para a combinação título, autor, ano e edição.";
    throw err;
  }

  if (novoIsbn !== livro.id_livro) {
    livrosByIsbn.delete(livro.id_livro);
    livro.id_livro = novoIsbn;
    livrosByIsbn.set(livro.id_livro, livro);
  }

  if (payload.nome !== undefined) livro.nome = nome;
  if (payload.autoresArr !== null) livro.autores = autoresArr.join(", ");
  if (payload.ano_publicacao !== undefined)
    livro.ano_publicacao = Number(payload.ano_publicacao);
  if (payload.edicao !== undefined) livro.edicao = Number(payload.edicao);
  if (payload.paginas !== undefined)
    livro.paginas =
      payload.paginas === "" || payload.paginas === null
        ? null
        : Number(payload.paginas);
  if (payload.qtde_disponivel !== undefined)
    livro.qtde_disponivel = Number(payload.qtde_disponivel);
  if (payload.categorias !== null) livro.categoria = payload.categorias;
  if (payload.editora !== undefined)
    livro.editora = payload.editora === null ? null : String(payload.editora);
  if (payload.idioma !== undefined)
    livro.idioma = payload.idioma === null ? null : String(payload.idioma);

  signatures.delete(assinaturaAtual);
  signatures.set(novaAssinatura, livro.id_livro);

  return toLivroResponse(livro);
}

export function removerLivro(isbn) {
  const chave = String(isbn).trim();
  const livro = livrosByIsbn.get(chave);
  if (!livro) {
    const err = new Error("NOT_FOUND");
    err.status = 404;
    throw err;
  }
  const assinatura = livroSignature(
    livro.nome,
    normalizeAutores(livro.autores),
    livro.ano_publicacao,
    livro.edicao,
  );
  signatures.delete(assinatura);
  livrosByIsbn.delete(chave);
}
