import {
  adminsById,
  adminsByFuncionario,
  adminsByEmail,
} from '../../../src/model/store.js';

export function resetAdminStore() {
  adminsById.clear();
  adminsByFuncionario.clear();
  adminsByEmail.clear();
}
