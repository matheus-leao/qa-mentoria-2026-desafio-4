import request from 'supertest';

export const cadastrarLivroValido = async (app, token, livro) => {
  const response = await request(app)
    .post('/livros')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_livro: livro.id_livro,
      nome: livro.nome,
      autores: livro.autores,
      ano_publicacao: livro.ano_publicacao,
      edicao: livro.edicao,
      paginas: livro.paginas,
      qtde_disponivel: livro.qtde_disponivel,
      categoria: livro.categoria,
      editora: livro.editora,
      idioma: livro.idioma,
    });

  if (response.status !== 201) {
    throw new Error(`Falha ao cadastrar livro válido: ${response.status} ${JSON.stringify(response.body)}`);
  }

  return response.body;
};