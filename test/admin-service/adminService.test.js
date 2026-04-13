import { expect } from 'chai';
import {
  atualizarAdministrador,
  buscarAdminPorEmail,
  buscarAdminPorFuncionario,
  buscarAdminPorId,
  buscarAdminPublicoPorId,
  criarAdministrador,
  listarAdministradores,
  removerAdministrador,
  verificarSenhaAdmin,
} from '../../src/service/adminService.js';
import { buildAdminPayload } from './fixtures/adminFixture.js';
import { resetAdminStore } from './helpers/resetAdminStore.js';

describe('adminService', () => {
  beforeEach(() => {
    resetAdminStore();
  });

  describe('criarAdministrador', () => {
    it('cria um administrador com dados publicos normalizados e senha protegida', () => {
      // Arrange
      const payload = buildAdminPayload({
        nome: '  Ada  ',
        sobrenome: '  Lovelace  ',
        email: '  ADA.LOVELACE@BIBLIOTECA.COM  ',
      });

      // Act
      const adminCriado = criarAdministrador(payload);
      const adminPersistido = buscarAdminPorId(adminCriado.id);

      // Assert
      expect(adminCriado).to.deep.equal({
        id: adminCriado.id,
        nome: 'Ada',
        sobrenome: 'Lovelace',
        id_funcionario: 123,
        email: 'ada.lovelace@biblioteca.com',
      });
      expect(adminPersistido).to.include({
        id: adminCriado.id,
        nome: 'Ada',
        sobrenome: 'Lovelace',
        id_funcionario: 123,
        email: 'ada.lovelace@biblioteca.com',
      });
      expect(adminPersistido).to.not.have.property('senha');
      expect(adminPersistido.senhaHash).to.be.a('string');
      expect(adminPersistido.senhaHash).to.not.equal(payload.senha);
    });

    it('retorna erro 400 quando campos obrigatorios nao sao informados', () => {
      // Arrange
      const payload = buildAdminPayload({
        nome: ' ',
        sobrenome: '',
        id_funcionario: '',
        email: ' ',
        senha: '',
      });

      // Act
      const act = () => criarAdministrador(payload);

      // Assert
      expect(act).to.throw().that.includes({
        message: 'VALIDATION',
        status: 400,
      });
      expect(act).to.throw().with.property('detalhes').that.deep.equals([
        'Campo nome é obrigatório.',
        'Campo sobrenome é obrigatório.',
        'Campo id_funcionario é obrigatório.',
        'Campo email é obrigatório.',
        'Campo senha é obrigatório.',
      ]);
    });

    it('retorna erro 400 quando o email tem formato invalido', () => {
      // Arrange
      const payload = buildAdminPayload({ email: 'email-invalido' });

      // Act
      const act = () => criarAdministrador(payload);

      // Assert
      expect(act).to.throw().that.includes({
        message: 'VALIDATION',
        status: 400,
      });
      expect(act).to.throw().with.property('detalhes').that.deep.equals([
        'Formato de email inválido.',
      ]);
    });

    it('retorna erro 400 quando id_funcionario nao e inteiro', () => {
      // Arrange
      const payload = buildAdminPayload({ id_funcionario: '12.5' });

      // Act
      const act = () => criarAdministrador(payload);

      // Assert
      expect(act).to.throw().that.includes({
        message: 'VALIDATION',
        status: 400,
      });
      expect(act).to.throw().with.property('detalhes').that.deep.equals([
        'id_funcionario deve ser um inteiro.',
      ]);
    });

    it('retorna erro 409 quando id_funcionario ja existe', () => {
      // Arrange
      criarAdministrador(buildAdminPayload());
      const payloadDuplicado = buildAdminPayload({
        email: 'grace.hopper@biblioteca.com',
      });

      // Act
      const act = () => criarAdministrador(payloadDuplicado);

      // Assert
      expect(act).to.throw().that.includes({
        message: 'CONFLICT',
        status: 409,
        campo: 'id_funcionario',
      });
    });

    it('retorna erro 409 quando email ja existe', () => {
      // Arrange
      criarAdministrador(buildAdminPayload());
      const payloadDuplicado = buildAdminPayload({
        id_funcionario: 456,
        email: 'ADA.LOVELACE@BIBLIOTECA.COM',
      });

      // Act
      const act = () => criarAdministrador(payloadDuplicado);

      // Assert
      expect(act).to.throw().that.includes({
        message: 'CONFLICT',
        status: 409,
        campo: 'email',
      });
    });
  });

  describe('buscas e listagem', () => {
    it('busca administrador por email e id_funcionario com normalizacao', () => {
      // Arrange
      const adminCriado = criarAdministrador(buildAdminPayload());

      // Act
      const adminPorEmail = buscarAdminPorEmail(' ADA.LOVELACE@BIBLIOTECA.COM ');
      const adminPorFuncionario = buscarAdminPorFuncionario('123');
      const adminPublico = buscarAdminPublicoPorId(adminCriado.id);

      // Assert
      expect(adminPorEmail).to.include({ id: adminCriado.id });
      expect(adminPorFuncionario).to.include({ id: adminCriado.id });
      expect(adminPublico).to.deep.equal(adminCriado);
    });

    it('lista apenas os dados publicos dos administradores cadastrados', () => {
      // Arrange
      const primeiro = criarAdministrador(buildAdminPayload());
      const segundo = criarAdministrador(buildAdminPayload({
        nome: 'Grace',
        sobrenome: 'Hopper',
        id_funcionario: 456,
        email: 'grace.hopper@biblioteca.com',
      }));

      // Act
      const administradores = listarAdministradores();

      // Assert
      expect(administradores).to.deep.equal([primeiro, segundo]);
      expect(administradores[0]).to.not.have.property('senhaHash');
      expect(administradores[1]).to.not.have.property('senhaHash');
    });
  });

  describe('verificarSenhaAdmin', () => {
    it('retorna true para a senha correta e false para senha incorreta', () => {
      // Arrange
      const adminCriado = criarAdministrador(buildAdminPayload());
      const adminPersistido = buscarAdminPorId(adminCriado.id);

      // Act
      const senhaCorreta = verificarSenhaAdmin(adminPersistido, 'SenhaSegura123');
      const senhaIncorreta = verificarSenhaAdmin(adminPersistido, 'SenhaErrada');

      // Assert
      expect(senhaCorreta).to.equal(true);
      expect(senhaIncorreta).to.equal(false);
    });
  });

  describe('atualizarAdministrador', () => {
    it('atualiza os campos informados, reindexa email e id_funcionario e regrava a senha', () => {
      // Arrange
      const adminCriado = criarAdministrador(buildAdminPayload());
      const senhaHashAntes = buscarAdminPorId(adminCriado.id).senhaHash;

      // Act
      const adminAtualizado = atualizarAdministrador(adminCriado.id, {
        nome: 'Grace',
        email: 'grace.hopper@biblioteca.com',
        id_funcionario: 456,
        senha: 'NovaSenha456',
      });
      const adminPersistido = buscarAdminPorId(adminCriado.id);

      // Assert
      expect(adminAtualizado).to.deep.equal({
        id: adminCriado.id,
        nome: 'Grace',
        sobrenome: 'Lovelace',
        id_funcionario: 456,
        email: 'grace.hopper@biblioteca.com',
      });
      expect(buscarAdminPorEmail('ada.lovelace@biblioteca.com')).to.equal(null);
      expect(buscarAdminPorFuncionario(123)).to.equal(null);
      expect(buscarAdminPorEmail('grace.hopper@biblioteca.com')).to.include({
        id: adminCriado.id,
      });
      expect(buscarAdminPorFuncionario(456)).to.include({
        id: adminCriado.id,
      });
      expect(adminPersistido.senhaHash).to.not.equal(senhaHashAntes);
      expect(verificarSenhaAdmin(adminPersistido, 'NovaSenha456')).to.equal(true);
    });

    it('retorna erro 404 quando tenta atualizar um administrador inexistente', () => {
      // Arrange
      const act = () => atualizarAdministrador(999, { nome: 'Grace' });

      // Act
      // Assert
      expect(act).to.throw().that.includes({
        message: 'NOT_FOUND',
        status: 404,
      });
    });

    it('retorna erro 400 quando o payload parcial contem email invalido', () => {
      // Arrange
      const adminCriado = criarAdministrador(buildAdminPayload());

      // Act
      const act = () => atualizarAdministrador(adminCriado.id, { email: 'invalido' });

      // Assert
      expect(act).to.throw().that.includes({
        message: 'VALIDATION',
        status: 400,
      });
      expect(act).to.throw().with.property('detalhes').that.deep.equals([
        'Formato de email inválido.',
      ]);
    });

    it('retorna erro 409 quando tenta atualizar para email ja cadastrado em outro administrador', () => {
      // Arrange
      const primeiro = criarAdministrador(buildAdminPayload());
      criarAdministrador(buildAdminPayload({
        nome: 'Grace',
        sobrenome: 'Hopper',
        id_funcionario: 456,
        email: 'grace.hopper@biblioteca.com',
      }));

      // Act
      const act = () => atualizarAdministrador(primeiro.id, {
        email: 'grace.hopper@biblioteca.com',
      });

      // Assert
      expect(act).to.throw().that.includes({
        message: 'CONFLICT',
        status: 409,
        campo: 'email',
      });
    });
  });

  describe('removerAdministrador', () => {
    it('remove o administrador de todos os indices', () => {
      // Arrange
      const adminCriado = criarAdministrador(buildAdminPayload());

      // Act
      removerAdministrador(adminCriado.id);

      // Assert
      expect(buscarAdminPorId(adminCriado.id)).to.equal(null);
      expect(buscarAdminPorEmail(adminCriado.email)).to.equal(null);
      expect(buscarAdminPorFuncionario(adminCriado.id_funcionario)).to.equal(null);
      expect(listarAdministradores()).to.deep.equal([]);
    });

    it('retorna erro 404 quando tenta remover um administrador inexistente', () => {
      // Arrange
      const act = () => removerAdministrador(999);

      // Act
      // Assert
      expect(act).to.throw().that.includes({
        message: 'NOT_FOUND',
        status: 404,
      });
    });
  });
});
