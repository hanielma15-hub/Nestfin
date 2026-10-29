import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessFinancials,
  canModifyCommissionScheme,
  canApproveOrRejectProperties,
  canManageLeads,
  canAccessTechnicalPanel,
  canExportReports,
  calculateCommission,
  generateCsvContent,
  formatMxn,
} from './adminPermissions';

test('RBAC: Financial access boundaries', () => {
  // Superadmin, Ops Admin, and Analyst can see financials
  assert.equal(canAccessFinancials('superadmin'), true);
  assert.equal(canAccessFinancials('ops_admin'), true);
  assert.equal(canAccessFinancials('analyst'), true);

  // Developer and Support must NEVER have access to private financial transactions
  assert.equal(canAccessFinancials('developer'), false);
  assert.equal(canAccessFinancials('support'), false);
});

test('RBAC: Only superadmin can modify global commission schemes', () => {
  assert.equal(canModifyCommissionScheme('superadmin'), true);
  assert.equal(canModifyCommissionScheme('ops_admin'), false);
  assert.equal(canModifyCommissionScheme('analyst'), false);
  assert.equal(canModifyCommissionScheme('developer'), false);
  assert.equal(canModifyCommissionScheme('support'), false);
});

test('RBAC: Technical panel is strictly for Developer and Superadmin', () => {
  assert.equal(canAccessTechnicalPanel('developer'), true);
  assert.equal(canAccessTechnicalPanel('superadmin'), true);
  assert.equal(canAccessTechnicalPanel('analyst'), false);
  assert.equal(canAccessTechnicalPanel('ops_admin'), false);
  assert.equal(canAccessTechnicalPanel('support'), false);
});

test('RBAC: Property approval rights', () => {
  assert.equal(canApproveOrRejectProperties('superadmin'), true);
  assert.equal(canApproveOrRejectProperties('ops_admin'), true);
  assert.equal(canApproveOrRejectProperties('analyst'), false);
  assert.equal(canApproveOrRejectProperties('developer'), false);
  assert.equal(canApproveOrRejectProperties('support'), false);
});

test('Financials: Calculates percentage commission with minimum fee constraint', () => {
  // Standard 8% on $10,000 MXN -> $800 MXN (above min fee $500)
  const standardCommission = calculateCommission(10000, 8, 500);
  assert.equal(standardCommission, 800);

  // 8% on $3,000 MXN -> $240 MXN, but min fee is $500 -> should return $500 MXN
  const constrainedCommission = calculateCommission(3000, 8, 500);
  assert.equal(constrainedCommission, 500);

  // 0 rent -> 0 commission
  const zeroRent = calculateCommission(0, 8, 500);
  assert.equal(zeroRent, 0);
});

test('CSV Generation: Correctly quotes commas and handles quotes', () => {
  const headers = ['Propiedad', 'Precio', 'Colonia'];
  const rows = [
    ['Casa colonial, Fracc. Las Huertas', 12500, 'Las Huertas'],
    ['Estudio "El Mirador"', 6000, 'Centro'],
  ];

  const csv = generateCsvContent(headers, rows);
  const lines = csv.split('\n');

  assert.equal(lines[0], 'Propiedad,Precio,Colonia');
  // First row must quote the title because it has a comma
  assert.equal(lines[1], '"Casa colonial, Fracc. Las Huertas",12500,Las Huertas');
  // Second row must escape internal double quotes as ""
  assert.equal(lines[2], '"Estudio ""El Mirador""",6000,Centro');
});
