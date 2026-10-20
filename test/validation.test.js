import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRows } from '../lib/validation.js';
const row = overrides => ({ row: 2, sku: 'MUG-01', name: 'Coffee mug', price: '299', ...overrides });
test('accepts a valid row and a free product', () => {
  assert.equal(validateRows([row({})])[0].issues.length, 0);
  assert.equal(validateRows([row({ price: '0' })])[0].issues.length, 0);
});
test('rejects missing names and codes', () => {
  assert.equal(validateRows([row({ name: ' ' })])[0].issues[0].field, 'name');
  assert.equal(validateRows([row({ sku: ' ' })])[0].issues[0].field, 'sku');
});
test('rejects empty, negative, non-numeric and infinite prices', () => {
  for (const price of ['', '-1', 'oops', 'Infinity']) assert.equal(validateRows([row({ price })])[0].issues[0].field, 'price');
});
test('rejects an exact repeated product code', () => {
  assert.equal(validateRows([row({}), row({ row: 3 })])[1].issues[0].field, 'sku');
});

    test('compares codes without letter case or surrounding spaces', () => {
      assert.equal(validateRows([row({}), row({ row: 3, sku: ' mug-01 ' })])[1].issues[0].field, 'sku');
    });
