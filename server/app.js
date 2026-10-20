import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { parseCsv } from '../lib/csv.js';
import { validateRows } from '../lib/validation.js';

const publicFiles = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
};
const send = (response, status, data) => {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
};

export function createApp() {
  const products = [];
  return createServer(async (request, response) => {
    try {
      if (request.method === 'GET' && request.url === '/api/products') return send(response, 200, { products });
      const asset = request.method === 'GET' ? publicFiles[request.url] : undefined;
      if (asset) {
        response.writeHead(200, { 'content-type': asset[1] });
        return response.end(await readFile(new URL(`../public/${asset[0]}`, import.meta.url)));
      }
      if (request.method !== 'POST' || !['/api/preview', '/api/import'].includes(request.url)) {
        return send(response, 404, { error: 'Not found' });
      }
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (Buffer.byteLength(body) > 1_000_000) return send(response, 413, { error: 'Use a CSV smaller than 1 MB.' });
      }
      const input = JSON.parse(body);
      const rows = validateRows(parseCsv(input.csv));
      const errors = rows.reduce((count, row) => count + row.issues.length, 0);
      if (request.url === '/api/preview') return send(response, 200, { rows, errors });
      if (errors) return send(response, 422, { error: 'Fix the file before importing.', rows, errors });
          const added = rows.map(({ sku, name, price }) => ({ sku: sku.trim(), name: name.trim(), price: Number(price) }));
          products.push(...added);
          return send(response, 201, { imported: added.length, total: products.length });
    } catch (error) {
      return send(response, 400, { error: error instanceof Error ? error.message : 'Unable to read the CSV.' });
    }
  });
}
