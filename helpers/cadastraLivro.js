import request from 'supertest';

export const cadastraLivro = async (idLivro, nome, autores, ano, edicao, pag, qtde, categ, editora, idioma) => {
    const livro = await request(process.env.BASE_URL)
        .post('/livros')
        .set('Content-Type', 'application/json')
        .send({
            'id_livro': idLivro,
            'nome': nome,
            'autores': autores,
            'ano_publicacao': ano,
            'edicao': edicao,
            'paginas': pag,
            'qtde_disponivel': qtde,
            'categoria': categ,
            'editora': editora,
            'idioma': idioma
        });

    return livro;
};