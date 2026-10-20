const csv = document.querySelector('#csv');
const preview = document.querySelector('#preview');
const confirm = document.querySelector('#confirm');
const status = document.querySelector('#status');
const rows = document.querySelector('#rows');
let busy = false;
const describeIssue = issue => issue.message;
const cell = value => { const node = document.createElement('td'); node.textContent = String(value); return node; };

async function request(path) {
  const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ csv: csv.value }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to import.');
  return result;
}

function invalidate() { confirm.disabled = true; rows.replaceChildren(); status.textContent = 'Preview the current file before confirming.'; }
csv.addEventListener('input', invalidate);
document.querySelector('#file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (file) { csv.value = await file.text(); invalidate(); }
});

preview.addEventListener('click', async () => {
  if (busy) return;
  busy = true; preview.disabled = true; csv.disabled = true; confirm.disabled = true;
  try {
    const result = await request('/api/preview');
    rows.replaceChildren(...result.rows.map(row => {
      const tr = document.createElement('tr');
      tr.dataset.invalid = String(row.issues.length > 0);
      tr.append(...[row.row, row.sku, row.name, row.price, row.issues.map(describeIssue).join(' ') || 'Ready'].map(cell));
      return tr;
    }));
    status.textContent = result.errors ? `${result.errors} issues. Fix the file and preview again.` : `${result.rows.length} products ready to import.`;
    confirm.disabled = result.errors > 0;
  } catch (error) { status.textContent = error.message; }
  finally { busy = false; preview.disabled = false; csv.disabled = false; }
});

confirm.addEventListener('click', async () => {
  if (busy || confirm.disabled) return;
  busy = true; confirm.disabled = true; preview.disabled = true; csv.disabled = true;
  try {
    const result = await request('/api/import');
    document.querySelector('#saved').textContent = `${result.imported} products imported. ${result.total} products saved in this session.`;
    rows.replaceChildren(); status.textContent = 'Choose another file to import more products.';
  } catch (error) { status.textContent = error.message; }
  finally { busy = false; preview.disabled = false; csv.disabled = false; }
});
