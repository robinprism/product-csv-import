/** A supplied parser. Row numbers include the header as row 1. */
export function parseCsv(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('Choose a non-empty CSV file.');
  const text = input.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const records = [];
  let record = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      record.push(field); field = '';
    } else if (char === '\n' && !quoted) {
      record.push(field); records.push(record); record = []; field = '';
    } else field += char;
  }
  if (quoted) throw new Error('A quoted value is not closed.');
  if (field.length || record.length) { record.push(field); records.push(record); }
  const nonEmpty = records.filter(row => row.some(value => value.trim()));
  const header = nonEmpty.shift()?.map(value => value.trim().toLowerCase());
  if (!header || header.length !== 3 || new Set(header).size !== 3 ||
      !['sku', 'name', 'price'].every(name => header.includes(name))) {
    throw new Error('Use the three columns sku, name and price.');
  }
  if (!nonEmpty.length) throw new Error('Add at least one product below the header.');
  return nonEmpty.map((values, index) => {
    if (values.length !== header.length) throw new Error(`Row ${index + 2} has the wrong number of columns.`);
    return { row: index + 2, ...Object.fromEntries(header.map((name, column) => [name, values[column]])) };
  });
}
