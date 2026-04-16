# Requisitos — Sistema de gerenciamento de biblioteca

Documento de **definições**, **requisitos** e **regras de negócio** do produto.

---

## 1. Definições

| Termo                 | Definição                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Administrador**     | Usuário com permissão para gerenciar a biblioteca; cadastrado conforme seção 3.                                                                     |
| **Leitor**            | Usuário cadastrado para utilização do sistema de biblioteca, conforme capacidade de cadastro de leitores no escopo funcional.                       |
| **Livro**             | Obra cadastrada no acervo, com metadados e quantidade de exemplares; vide seção 5.                                                                  |
| **ISBN**              | Código informado pelo usuário (digitalização ou digitação) para identificar o livro no empréstimo; tratado no sistema como valor de **`id_livro`**. |
| **`id_livro`**        | Identificador do livro no domínio do sistema; no fluxo de empréstimo, corresponde ao **ISBN** informado.                                            |
| **`qtde_disponivel`** | Quantidade de exemplares disponíveis para locação (não necessariamente igual ao total no acervo; vide regras de empréstimo).                        |
| **`data_emprestimo`** | Data em que o empréstimo é realizado; deve coincidir com a data atual da operação.                                                                  |
| **`data_devolucao`**  | Data prevista de devolução, calculada a partir de `data_emprestimo` conforme regra de prazo.                                                        |
| **`dias`**            | Quantidade de dias restantes até o término do prazo do empréstimo.                                                                                  |

---

## 2. Escopo funcional

O sistema deve permitir:

- Criação, edição, visualização e exclusão de **administradores**.
- Criação, edição, visualização e exclusão de **leitores**.
- Criação, edição, visualização e exclusão de **livros**.
- Permitir que usuários **peguem** livro emprestados.
- Permitir que usuários **devolvam** livros emprestados.

---

## 3. Cadastro de administradores

### 3.1 Requisito funcional

Realizar o cadastro de um administrador no sistema, de forma que ele possa possuir permissões para gerenciar a biblioteca.

### 3.2 Dados do administrador

| Campo            | Tipo    | Descrição                           |
| ---------------- | ------- | ----------------------------------- |
| `nome`           | string  | Nome do administrador.              |
| `sobrenome`      | string  | Sobrenome do administrador.         |
| `id_funcionario` | inteiro | Identificador único do funcionário. |
| `email`          | string  | E-mail do administrador.            |
| `senha`          | string  | Senha de acesso do administrador.   |

### 3.3 Regras de negócio e validação

- Todos os campos (`nome`, `sobrenome`, `id_funcionario`, `email`, `senha`) são **obrigatórios** e devem ser informados.
- `id_funcionario` deve ser **único** no sistema (não pode existir outro administrador com o mesmo valor).
- `email` deve ser **único** no sistema.
- `email` deve possuir **formato válido** (ex.: `exemplo@dominio.com`).
- O cadastro **não** exige token de autenticação.

### 3.4 Requisitos de resposta HTTP (cadastro)

| Condição                                   | Código HTTP       | Comportamento                                                         |
| ------------------------------------------ | ----------------- | --------------------------------------------------------------------- |
| Campo obrigatório vazio                    | `400 Bad Request` | Erro de validação.                                                    |
| Formato de `email` inválido                | `400 Bad Request` | Erro de validação.                                                    |
| `id_funcionario` ou `email` já cadastrados | `409 Conflict`    | Erro específico informando que `id_funcionario` ou `email` já existe. |

---

## 4. Empréstimo de livro

### 4.1 Requisitos de interface (API)

| Item                      | Especificação      |
| ------------------------- | ------------------ |
| Operação                  | `POST /login`      |
| Cabeçalho `Content-Type`  | `application/json` |
| Cabeçalho `Authorization` | `Bearer {token}`   |

### 4.2 Entidade `Emprestimo` (atributos)

`id_usuario`, `nome_usuario`, `id_livro`, `nome_livro`, `autores`, `edicao`, `categoria`, `data_emprestimo`, `data_devolucao`, `dias`, `qtde_disponivel`

### 4.3 Corpo da requisição (JSON) — campos ilustrados

Campos obrigatórios nas regras de negócio incluem **`id_livro`** (ISBN). Demais campos podem ser preenchidos pelo sistema após a consulta ao cadastro do livro.

```json
{
  "id_livro": "string",
  "nome_usuario": "string",
  "nome_livro": "string",
  "autores": "string",
  "edicao": 0,
  "categoria": "string",
  "data_emprestimo": "date",
  "data_devolucao": "date",
  "dias": 0,
  "qtde_disponivel": 0
}
```

### 4.4 Requisitos de resposta HTTP (empréstimo) — corpos de erro

**400 — Dados obrigatórios ausentes ou inválidos**

```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "Campo 'id_livro' deve ser informado. Scaneie ou informe manualmente o codigo ISBN."
  ]
}
```

**401 — Autenticação necessária ou inválida**

```json
{
  "erro": "Token não informado ou inválido."
}
```

**403 — Acesso não permitido**

```json
{
  "erro": "Usuário não autorizado."
}
```

**409 — Indisponível**

```json
{
  "erro": "Livro indisponivel",
  "detalhes": [
    "Nao existe unidade de livros disponiveis para emprestimo no momento. Proxima devolucao ser em <data_devolucao>"
  ]
}
```

_`<data_devolucao>` representa a data efetiva retornada pelo sistema na mensagem._

**500 — Erro interno do servidor**

```json
{
  "erro": "Erro interno do servidor"
}
```

### 4.5 Regras de negócio (empréstimo)

1. Para solicitar empréstimo, o usuário deve estar válido (autenticação via **token/login**).
2. O campo `id_livro` é **obrigatório**.
3. O empréstimo exige informação do **ISBN** pelo usuário, por escaneamento ou entrada manual.
4. Informado o ISBN (`id_livro`), o sistema **preenche** `nome_livro`, `autores`, `edicao` e `categoria` com base nos dados cadastrais do livro.
5. `data_emprestimo` deve ser **sempre a data atual** da realização do empréstimo; **não** são aceitas datas retroativas nem futuras.
6. `data_devolucao` é calculada como **15 dias** a partir de `data_emprestimo`, **excluindo sábados e domingos** na contagem dos dias.
7. `dias` deve indicar **sempre** a quantidade de dias que faltam para o empréstimo terminar.
8. `qtde_disponivel` deve refletir a quantidade de livros disponíveis para locação e **não pode ser menor que 1** (existe exemplar de amostra).
9. Se `qtde_disponivel` for **igual a 1**, o empréstimo **não** pode ser concedido.
10. Em caso de indisponibilidade por quantidade, o sistema deve considerar os empréstimos existentes e identificar a **menor quantidade de dias** até o retorno de um exemplar, para informar a próxima devolução (vide mensagem de erro `409`).
11. **Não** há renovação do período de empréstimo.

---

## 5. Cadastro de livros

### 5.1 Requisitos de interface (API)

| Item     | Especificação  |
| -------- | -------------- |
| Operação | `POST /livros` |

### 5.2 Entidade `Livro` (atributos)

`id_livro`, `nome`, `autores`, `ano_publicacao`, `edicao`, `paginas`, `qtde_disponivel`, `categoria`, `editora`, `idioma`

### 5.3 Regras de negócio

1. São **obrigatórios** e não podem ser vazios: **nome do livro**, **autor(es)** (mínimo 1), **ano de publicação** e **quantidade de exemplares no acervo**.
2. Não é permitido cadastrar o mesmo livro mais de uma vez para a combinação **título + autor + ano de publicação + edição**.
3. A quantidade de exemplares no acervo **não** pode ser zero nem negativa.
4. O ano de publicação **não** pode ser futuro nem negativo.
5. Cada livro pode estar associado a **no máximo 3 categorias**.
6. Somente usuários **autenticados** podem cadastrar um livro.
