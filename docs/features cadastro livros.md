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

Header:
    content-Type: application/json
    Authorization: Bearer {token}

Body: {
    "nome": "string",
    "autores": ["string"]
    "ano_publicacao": 0,
    "edicao": 0 ,
    "paginas": 0,
    "qtde_disponivel": 0,
    "categoria": "string",
    "editora": "string",
    "idioma": "string"
}

Respostas:

201 Livro Incluído com sucesso
    {
        "id": 0
        "nome": "string",
        "autores": [ "string"]
        "ano_publicacao": 0,
        "edicao": 0 ,
        "paginas": 0,
        "qtde_disponivel": 0,
        "categoria": "string",
        "editora": "string",
        "idioma": "string"
    }
        
400 Dados obrigatórios ausentes ou inválidos
    {
        "erro": "Dados inválidos",
        "detalhes": [
            "Campo 'nome' é obrigatório",
            "Campo 'autores' deve conter ao menos um autor",
            "Ano de publicação não pode ser no futuro"
        ]
    }
    
401 Autenticação necessária ou inválida
    {
        "erro": "Token não informado ou inválido"
    }
    
403 Acesso não permitido
    {
        "erro": "Usuário não autorizado"
    }
    
409 Cadastro já existe
    {
        "erro": "Livro já cadastrado",
        "detalhes": "Já existe um livro com o mesmo nome, autores, ano de publicação e edição"
    }
    
500 Erro Interno do Servidor
    {
        "erro": "Erro interno do servidor"
    }


Regras de Negócio

    1. Os campos: Nome do Livro, Autor(es) (mínimo 1), Ano de Publicação e Quantidade de exemplares no acervo são campos obrigatórios e não podem ser vazios
    2. O mesmo livro não pode ser cadastrado mais de uma vez. Não é permitido cadastro com mesmo título + autor + ano publicação + edição
    3. Quantidade de exemplares no acervo não pode ser zero nem negativo.
    4. Ano de publicação não pode ser futuro e nem negativo
    5. Cada livro pode estar listado em até 3 categorias
    6. Apenas usuários autenticados podem cadastrar um livro
