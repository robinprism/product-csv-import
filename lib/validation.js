export function validateRows(rows) {
  const seen = new Set();
  return rows.map(row => {
    const issues = [];
    if (!row.sku.trim()) issues.push({ field: 'sku', message: "Invalid value." });
    if (!row.name.trim()) issues.push({ field: 'name', message: "Invalid value." });
    if (!row.price.trim() || !Number.isFinite(Number(row.price)) || Number(row.price) < 0) {
      issues.push({ field: 'price', message: "Invalid value." });
    }
    const code = row.sku.trim();
    if (code && seen.has(code)) issues.push({ field: 'sku', message: "Duplicate product." });
    if (code) seen.add(code);
    return { ...row, issues };
  });
}
