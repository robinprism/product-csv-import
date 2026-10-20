/** Finish the validation. Keep each row's values and return its issues. */
export function validateRows(rows) {
  return rows.map(row => ({ ...row, issues: [{ field: 'assignment', message: 'Validation is not implemented yet.' }] }));
}
