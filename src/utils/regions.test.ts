import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_REGIONS,
  getDefaultRegion,
  getActivePublicRegions,
  getUpcomingRegions,
  toggleRegionActiveStatus,
  createNewRegion,
} from './regions';

test('initial active region must be exclusively Montemorelos', () => {
  const activeRegions = getActivePublicRegions(INITIAL_REGIONS);
  assert.equal(activeRegions.length, 1);
  assert.equal(activeRegions[0].name, 'Montemorelos');
  assert.equal(activeRegions[0].state, 'Nuevo León');
  assert.equal(activeRegions[0].isActivePublic, true);
});

test('default region resolves to Montemorelos', () => {
  const defaultRegion = getDefaultRegion(INITIAL_REGIONS);
  assert.equal(defaultRegion.id, 'montemorelos-nl');
  assert.equal(defaultRegion.name, 'Montemorelos');
});

test('upcoming regions contain expansion candidates in preparation', () => {
  const upcoming = getUpcomingRegions(INITIAL_REGIONS);
  assert.ok(upcoming.length >= 3);
  const names = upcoming.map((r) => r.name);
  assert.ok(names.includes('Linares'));
  assert.ok(names.includes('Allende'));
  assert.ok(names.includes('Santiago'));
  assert.ok(names.includes('Monterrey (Zona Sur / Tec)'));
});

test('admin can create a new expansion region', () => {
  const { updatedRegions, newRegion } = createNewRegion(INITIAL_REGIONS, {
    name: 'Cadereyta',
    state: 'Nuevo León',
    code: 'NL-CAD-06',
    isActivePublic: false,
    isComingSoon: true,
    description: 'Región industrial y residencial en evaluación.',
  });

  assert.equal(updatedRegions.length, INITIAL_REGIONS.length + 1);
  assert.equal(newRegion.name, 'Cadereyta');
  assert.equal(newRegion.isActivePublic, false);
  assert.equal(newRegion.listingCount, 0);
});

test('admin can toggle region active status without disabling all active regions', () => {
  // Try to toggle Linares to active
  const withLinaresActive = toggleRegionActiveStatus(INITIAL_REGIONS, 'linares-nl', true);
  const activeList = withLinaresActive.filter((r) => r.isActivePublic);
  assert.equal(activeList.length, 2);

  // Try to disable Montemorelos while Linares is active
  const onlyLinares = toggleRegionActiveStatus(withLinaresActive, 'montemorelos-nl', false);
  assert.equal(onlyLinares.find((r) => r.id === 'montemorelos-nl')?.isActivePublic, false);

  // Try to disable the last active region (should prevent blackout)
  const prevented = toggleRegionActiveStatus(onlyLinares, 'linares-nl', false);
  assert.equal(prevented.find((r) => r.id === 'linares-nl')?.isActivePublic, true);
});
