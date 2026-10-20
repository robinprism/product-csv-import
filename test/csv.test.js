import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv } from '../lib/csv.js';
test('reads quoted commas and escaped quotes', () => {
  assert.deepEqual(parseCsv('sku,name,price\nM1,"Mug, ""large""",299')[0], { row: 2, sku: 'M1', name: 'Mug, "large"', price: '299' });
});
test('accepts a byte-order mark and Windows newlines', () => {
  assert.equal(parseCsv('\uFEFFsku,name,price\r\nM1,Mug,0\r\n')[0].price, '0');
});
test('rejects missing columns and unclosed quotes', () => {
  assert.throws(() => parseCsv('sku,name\nM1,Mug'), /three columns/);
  assert.throws(() => parseCsv('sku,name,price\nM1,"Mug,2'), /not closed/);
});
