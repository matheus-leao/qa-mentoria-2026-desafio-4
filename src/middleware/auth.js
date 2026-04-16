import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-altere-em-producao";

export function getJwtSecret() {
  return JWT_SECRET;
}

export function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", ...options });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Exige Authorization: Bearer <token> válido. Anexa req.auth = payload.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não informado ou inválido." });
  }
  const raw = header.slice(7).trim();
  if (!raw) {
    return res.status(401).json({ erro: "Token não informado ou inválido." });
  }
  try {
    req.auth = verifyToken(raw);
    return next();
  } catch {
    return res.status(401).json({ erro: "Token não informado ou inválido." });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth || req.auth.role !== role) {
      return res.status(403).json({ erro: "Usuário não autorizado." });
    }
    return next();
  };
}
