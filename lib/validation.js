export function validateRows(rows) {
  const seen = new Set();
  return rows.map(row => {
    const issues = [];
    if (!row.sku.trim()) issues.push({ field: 'sku', message: "Add a product code, for example MUG-01." });
    if (!row.name.trim()) issues.push({ field: 'name', message: "Add a product name." });
    if (!row.price.trim() || !Number.isFinite(Number(row.price)) || Number(row.price) < 0) {
      issues.push({ field: 'price', message: "Enter a number that is zero or greater." });
    }
    const code = row.sku.trim().toUpperCase();
    if (code && seen.has(code)) issues.push({ field: 'sku', message: "Use a unique product code; capitalization and surrounding spaces do not make a new code." });
    if (code) seen.add(code);
    return { ...row, issues };
  });
}
