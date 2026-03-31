Welcome to the qa-mentoria-2026-desafio-4!

Nesse trabalho teremos como objetivo criar um sistema para gerenciamento de biblioteca, onde podemos:

Cadastrar administradores
Cadastrar leitores
Cadastrar livros
Usuários podem pegar livros emprestados
Usuários devem devolver livros que eles pegaram

---

Fluxo de cadastro de Livros

Endpoint:
POST/livros


Atributos:

Livro {
    id_livro,
    nome,
    autores,
    ano_publicacao,
    edicao,
    paginas,
    qtde_disponivel,
    categoria,
    editora,
    idioma
}

Regras de Negócio

    1. Os campos: Nome do Livro, Autor(es) (mínimo 1), Ano de Publicação e Quantidade de exemplares no acervo são campos obrigatórios e não podem ser vazios
    2. O mesmo livro não pode ser cadastrado mais de uma vez. Não é permitido cadastro com mesmo título + autor + ano publicação + edição
    3. Quantidade de exemplares no acervo não pode ser zero nem negativo.
    4. Ano de publicação não pode ser futuro e nem negativo
    5. Cada livro pode estar listado em até 3 categorias
    6. Apenas usuários autenticados podem cadastrar um livro
