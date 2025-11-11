-- Tabla para tokens revocados (blacklist)
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(512) NOT NULL UNIQUE,
    revoked_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- Índice para búsquedas rápidas por token
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_token ON revoked_tokens(token);

-- Índice para limpieza de tokens expirados
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
