import request from 'supertest';

export const cadastrarLivroValido = async (app, token, livro) => {
     const livroCadastrado = await request(app)
        .post('/livros')
        .set('Authorization', `Bearer ${token}`)
        .send({
            'id_livro': livro.id_livro,
            'nome': livro.nome,
            'autores': livro.autores,
            'ano_publicacao': livro.ano_publicacao,
            'edicao': livro.edicao,
            'paginas': livro.paginas,
            'qtde_disponivel': livro.qtde_disponivel,
            'categoria': livro.categoria,
            'editora': livro.editora,
            'idioma': livro.idioma
        });

    return livroCadastrado.body;
    };