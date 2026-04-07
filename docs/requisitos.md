Welcome to the qa-mentoria-2026-desafio-4!

Nesse trabalho teremos como objetivo criar um sistema para gerenciamento de biblioteca, onde podemos:

Cadastrar administradores
Cadastrar leitores
Cadastrar livros
Usuários podem pegar livros emprestados
Usuários devem devolver livros que eles pegaram

---

Feature:

Cadastrar Administradores - Realizar o cadastro de um administrador no sistema, permitindo que ele tenha permissões para gerenciar a biblioteca.

Campos:

nome (string): Nome do administrador.
sobrenome (string): Sobrenome do administrador.
id_funcionario (int): Identificador único do funcionário.
email (string): E-mail do administrador.
senha (string): Senha de acesso do administrador.

Regras:

Campos obrigatórios: 
Todos os campos (nome, sobrenome, id_funcionario, email, senha) devem ser preenchidos.

Campos únicos:
id_funcionario deve ser único no sistema (não pode haver dois administradores com o mesmo ID). 
e-mail também deve ser único (não pode haver duplicados).

Validação de formato:
O campo email deve ter um formato válido (ex: exemplo@dominio.com)
Nenhum token necessário: Durante o cadastro, não é necessário um token de autenticação.

Respostas de erro:
Se o id_funcionario ou o email já estiverem cadastrados, a resposta deve ser um erro específico (por exemplo, 409 Conflict com uma mensagem dizendo que o id_funcionario ou o email já existe).
Se algum campo obrigatório estiver vazio, a resposta deve ser um erro com o código 400 Bad Request.
Se o formato do email estiver inválido, a resposta deve ser 400 Bad Request.

----------

Feature: Emprestar livro

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
    Content-Type: application/json
    Authorization: Bearer {token}

Body (JSON):
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

Regras (empréstimo):

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

----------
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
