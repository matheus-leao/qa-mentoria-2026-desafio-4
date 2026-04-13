export function buildAdminPayload(overrides = {}) {
  return {
    nome: 'Ada',
    sobrenome: 'Lovelace',
    id_funcionario: 123,
    email: 'ada.lovelace@biblioteca.com',
    senha: 'SenhaSegura123',
    ...overrides,
  };
}
