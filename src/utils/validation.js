const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

export function normalizeAutores(autores) {
  if (Array.isArray(autores)) {
    return autores.map((a) => String(a).trim()).filter(Boolean);
  }
  if (typeof autores === 'string') {
    return autores
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
  }
  return [];
}

export function livroSignature(nome, autoresArr, ano, edicao) {
  const a = [...autoresArr].map((x) => x.trim().toLowerCase()).sort().join('|');
  return `${String(nome).trim().toLowerCase()}#${a}#${ano}#${edicao}`;
}
