/**
 * generate_test_excel.mjs
 *
 * Generates a test Excel file that matches the NEW template layout:
 *   Row 4  → "ยางหลัก" merged header label
 *   Row 5  → Main Rubber names starting at Column E (index 4)
 *   Row 6+ → Secondary Rubber names in Column D (index 3), data from Column E
 *
 * Data is taken directly from the screenshot provided.
 *
 * Run with:
 *   node generate_test_excel.mjs
 *
 * Output:
 *   test_rubber_template.xlsx  (in the current directory)
 */

import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';

// ── Data from the screenshot ──────────────────────────────────────────────────

const mainRubbers = ['T555', 'T485', 'T898', 'T782', 'T946', 'T327', 'T552', 'T896', 'T813'];

// Secondary rubber names + their row values (in order of mainRubbers columns)
const rows = [
  { name: 'T555', values: [3,   'X', 'X', 3,   5,   'X', 'X', 10,  'X'] },
  { name: 'T485', values: [5,   'X', 'X', 5,   5,   10,  3,   5,   'X'] },
  { name: 'T898', values: [3,   'X', 10,  5,   5,   5,   'X', 5,   5  ] },
  { name: 'T782', values: [3,   3,   3,   3,   3,   3,   5,   5,   5  ] },
  { name: 'T946', values: [5,   5,   'X', 10,  3,   5,   'X', 3,   'X'] },
  { name: 'T327', values: ['X', 5,   'X', 'X', 'X', 5,   10,  3,   3  ] },
  { name: 'T552', values: ['X', 5,   5,   'X', 'X', 3,   'X', 'X', 3  ] },
  { name: 'T896', values: [10,  10,  'X', 'X', 'X', 5,   5,   5,   3  ] },
  { name: 'T813', values: ['X', 'X', 5,   'X', 3,   'X', 3,   5,   10 ] },
];

// ── Build the worksheet data as a 2-D array ───────────────────────────────────
//
//  Excel layout (1-indexed):
//    Row 1  → empty
//    Row 2  → empty
//    Row 3  → empty
//    Row 4  → "ยางหลัก" in col E (merged visually, but we just put the label)
//    Row 5  → Main Rubber names starting at col E
//    Row 6+ → Secondary names in col D, data in cols E+
//
//  0-indexed column map:
//    A=0, B=1, C=2, D=3, E=4, F=5, …

const workbook = XLSX.utils.book_new();
const ws = {};

// Helper: write a cell value
function setCell(ws, r, c, v) {
  const addr = XLSX.utils.encode_cell({ r, c });
  const type = typeof v === 'number' ? 'n' : 's';
  ws[addr] = { v, t: type };
}

// Row 3 (index 3): "ยางหลัก" label at column E (index 4)
setCell(ws, 3, 4, 'ยางหลัก');

// Row 4 (index 4): Main Rubber headers starting at column E (index 4)
mainRubbers.forEach((name, i) => {
  setCell(ws, 4, 4 + i, name);
});

// Rows 5+ (index 5+): Secondary name in col D (index 3), then data
rows.forEach((row, rowIdx) => {
  const r = 5 + rowIdx;
  setCell(ws, r, 3, row.name); // Column D
  row.values.forEach((val, colIdx) => {
    setCell(ws, r, 4 + colIdx, val); // Column E onwards
  });
});

// Set the worksheet range
const lastRow = 5 + rows.length - 1;        // 0-indexed last data row
const lastCol = 4 + mainRubbers.length - 1;  // 0-indexed last data col
ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastRow, c: lastCol } });

// Optional: set column widths for readability
ws['!cols'] = [
  { wch: 4 },  // A
  { wch: 4 },  // B
  { wch: 4 },  // C
  { wch: 8 },  // D – Secondary Rubber names
  ...mainRubbers.map(() => ({ wch: 7 })), // E onwards – data columns
];

XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');

// ── Write file ────────────────────────────────────────────────────────────────
const outputPath = './test_rubber_template.xlsx';
const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
writeFileSync(outputPath, buffer);

console.log(`✅  File written: ${outputPath}`);
console.log(`   Main Rubbers   : ${mainRubbers.length} columns (${mainRubbers.join(', ')})`);
console.log(`   Secondary Rows : ${rows.length} rows`);
console.log('');
console.log('Layout check:');
console.log('  Row 4 (Excel)  → "ยางหลัก" label at col E');
console.log('  Row 5 (Excel)  → Main Rubber headers starting at col E');
console.log('  Row 6+ (Excel) → Secondary names in col D, data from col E');
