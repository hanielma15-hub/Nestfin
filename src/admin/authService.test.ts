import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticateCorporateUser,
  CORPORATE_USERS_DIRECTORY,
} from './authService';

test('Auth: Authenticates superadmin with valid credentials', () => {
  const result = authenticateCorporateUser('admin@nestfind.com', 'montemorelos2026');
  assert.equal(result.success, true);
  assert.ok(result.user);
  assert.equal(result.user.role, 'superadmin');
  assert.equal(result.user.email, 'admin@nestfind.com');
  assert.equal(result.user.name, 'Lic. Roberto Garza Treviño');
});

test('Auth: Authenticates operations admin with valid credentials', () => {
  const result = authenticateCorporateUser('operaciones@nestfind.com', 'ops@nestfind');
  assert.equal(result.success, true);
  assert.ok(result.user);
  assert.equal(result.user.role, 'ops_admin');
});

test('Auth: Authenticates developer, analyst, and support roles', () => {
  const dev = authenticateCorporateUser('dev@nestfind.com', 'dev#nestfind');
  assert.equal(dev.success, true);
  assert.equal(dev.user?.role, 'developer');

  const analyst = authenticateCorporateUser('analitica@nestfind.com', 'metricas2026');
  assert.equal(analyst.success, true);
  assert.equal(analyst.user?.role, 'analyst');

  const support = authenticateCorporateUser('soporte@nestfind.com', 'soporte@nest');
  assert.equal(support.success, true);
  assert.equal(support.user?.role, 'support');
});

test('Auth: Rejects invalid passwords', () => {
  const result = authenticateCorporateUser('admin@nestfind.com', 'wrongpassword');
  assert.equal(result.success, false);
  assert.equal(result.user, undefined);
  assert.ok(result.error?.includes('inválidas'));
});

test('Auth: Rejects unknown email addresses', () => {
  const result = authenticateCorporateUser('hacker@externo.com', 'password123');
  assert.equal(result.success, false);
  assert.equal(result.user, undefined);
});

test('Auth: Case insensitive email matching and whitespace trimming', () => {
  const result = authenticateCorporateUser('  ADMIN@NestFind.COM  ', 'montemorelos2026');
  assert.equal(result.success, true);
  assert.equal(result.user?.role, 'superadmin');
});
