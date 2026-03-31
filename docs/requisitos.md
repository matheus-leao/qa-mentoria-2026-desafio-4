Welcome to the qa-mentoria-2026-desafio-4!

Nesse trabalho teremos como objetivo criar um sistema para gerenciamento de biblioteca, onde podemos:

Cadastrar administradores
Cadastrar leitores
Cadastrar livros
Usuários podem pegar livros emprestados
Usuários devem devolver livros que eles pegaram

---

Feature:

Regras:


Feature: Emprestar-livro
    Endpoint:
        POST/login
    
    Atributos:
    Emprestimo{
        id_usuario,
        nome_usuario,
        id_livro,
        nome_livro,
        autores,
        edicao,
        categoria,
        data_emprestimo,
        data_devolucao,
        dias,
        qtde_disponivel
    }
    Header: 
        content-Type: application/json
        Authorization: Bearer {token}
    Body:
    </>JSON
    {
        "nome_usuario":"string",
        "nome_livro":"string",
        "autores":"string",
        "edicao":0,
        "categoria":"string",
        "data_emprestimo":"date",
        "data_devolucao":"date",
        "dias":0,
        "qtde_disponivel":0
    }
    400 Dados obrigatórios ausentes ou inválidos
    {
        "erro": "Dados inválidos",
        "detalhes": [
            "Campo 'id_livro' deve ser informado. Scaneie ou informe manualmente o codigo ISBN.",
        ]
    }
    401 Autenticação necessária ou inválida
    {
        "erro": "Token não informado ou inválido."
    }
        403 Acesso não permitido
    {
        "erro": "Usuário não autorizado."
    }
    409 Indisponivel
    {
        "erro": "Livro indisponivel",
        "detalhes": [
            "Nao existe unidade de livros disponiveis para emprestimo no momento. Proxima devolucao ser em " + data_devolucao.
        ]
    }
    500 Erro Interno do Servidor
    {
        "erro": "Erro interno do servidor"
    }

Regras:
    
    1. Ao solicitar emprestimo o usuario deve estar valido (token/login);
    2. O campo: id_livro deve ser obrigatorio.
    3. Para solicitar emprestimo deve-se informar pelo usuario, via scaneamento ou manualmente, o codigo ISBN.
    4. Informado o ISBN (id_livro) o sistema carrega os campos nome_livro, autores, edicao e categoria conforme dados do livro.
    5. O campo data_emprestimo deve sempre conter a data atual para realizar o emprestimo nao aceitando datas retroativas ou futuras.
    6. O campo data_devolucao calcula 15 dias da data_emprestimo, excluindo sabado e domingo.
    7. O campo dias deve apresentar sempre a quantidade de dias que faltam para o emprestimo terminar;
    8. O campo qtde_disponivel deve informar a quantidade de livros disponiveis para locacao nao podendo ser menor do que 1 (exemplar de amostra).
    9. Em caso qtde_disponivel igual a 1 o emprestimo nao pode ser concedido.
    10. Em caso de emprestimo indisponivel pro quantide consultar todas os emprestimos e verificar a menor quantidade de dias para retorno do exemplar.
    11. Nao existem renovacoes de periodo de emprestimo.
    