import { emprestimos, nextEmprestimoId } from "../model/store.js";
import { buscarLivroPorIsbn, atualizarQtdeLivro } from "./livroService.js";
import { buscarLeitorPorId } from "./leitorService.js";
import {
  addWeekdaysAfter,
  diasRestantesCorridos,
  formatDateISO,
} from "../utils/businessDays.js";

function emprestimosAtivosPorLivro(idLivro) {
  return emprestimos.filter(
    (e) => e.id_livro === idLivro && e.status === "ativo",
  );
}

function proximaDataDevolucaoPrevista(idLivro) {
  const ativos = emprestimosAtivosPorLivro(idLivro);
  if (ativos.length === 0) return null;
  const datas = ativos.map((e) => new Date(e.data_devolucao));
  return datas.reduce((min, d) => (d < min ? d : min), datas[0]);
}

export function criarEmprestimo(idUsuarioLeitor, body) {
  const idLeitor = Number(idUsuarioLeitor);
  const id_livro = body?.id_livro;

  if (
    id_livro === undefined ||
    id_livro === null ||
    String(id_livro).trim() === ""
  ) {
    const err = new Error("EMPRESTIMO_VALIDATION");
    err.status = 400;
    err.detalhes = [
      "Campo 'id_livro' deve ser informado. Scaneie ou informe manualmente o codigo ISBN.",
    ];
    throw err;
  }

  const isbn = String(id_livro).trim();
  const livro = buscarLivroPorIsbn(isbn);
  if (!livro) {
    const err = new Error("NOT_FOUND");
    err.status = 400;
    err.detalhes = ["Livro não encontrado para o ISBN informado."];
    throw err;
  }

  const leitor = buscarLeitorPorId(idLeitor);
  if (!leitor) {
    const err = new Error("INTERNAL");
    err.status = 500;
    throw err;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (livro.qtde_disponivel <= 1) {
    const proxima = proximaDataDevolucaoPrevista(isbn);
    const dataRef = proxima || hoje;
    const err = new Error("INDISPONIVEL");
    err.status = 409;
    err.data_devolucao = formatDateISO(dataRef);
    throw err;
  }

  const data_emprestimo = new Date(hoje);
  const data_devolucao = addWeekdaysAfter(data_emprestimo, 15);
  const dias = diasRestantesCorridos(hoje, data_devolucao);

  const nome_usuario = `${leitor.nome} ${leitor.sobrenome}`.trim();
  const categoriaStr = Array.isArray(livro.categoria)
    ? livro.categoria.join(", ")
    : String(livro.categoria || "");

  const novaQtde = livro.qtde_disponivel - 1;
  atualizarQtdeLivro(isbn, novaQtde);

  const registro = {
    id: nextEmprestimoId(),
    id_usuario: leitor.id,
    nome_usuario,
    id_livro: isbn,
    nome_livro: livro.nome,
    autores: livro.autores,
    edicao: livro.edicao,
    categoria: categoriaStr,
    data_emprestimo: formatDateISO(data_emprestimo),
    data_devolucao: formatDateISO(data_devolucao),
    dias,
    qtde_disponivel: novaQtde,
    status: "ativo",
  };

  emprestimos.push(registro);
  return registro;
}
