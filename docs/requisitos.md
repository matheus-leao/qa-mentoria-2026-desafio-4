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
