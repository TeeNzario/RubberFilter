/**
 * Excel parser for the fixed Rubber Stock template.
 *
 * HARDCODED LAYOUT (based on the provided screenshot):
 *   Row 5  → Main Rubber headers (T258, T419, T502, …)
 *   Col C  → Secondary Rubber labels (T514, T573, T582, …)
 *   Col D+ → Start of Main Rubber columns
 *   D6+    → Matrix values (3 | 5 | 10 | X | empty)
 *
 * The title / merged "BASE" rows above the matrix are ignored entirely.
 */

import * as XLSX from 'xlsx';
import type { MatrixData } from '../types';

// ─── Fixed positions (0-indexed) ────────────────────────────────────

/** Row index for Main Rubber header row (Excel row 5). */
const HEADER_ROW = 4;

/** First data row (Excel row 6). */
const DATA_START_ROW = 5;

/** Column index for Secondary Rubber names (Excel column C). */
const SECONDARY_COL = 2;

/** First Main Rubber data column (Excel column D). */
const MAIN_START_COL = 3;

/** Pattern that matches a T-code like T258, T514, etc. */
const T_CODE = /^T\d+$/i;

/** The only valid percentage values in the matrix. */
const VALID_PCT = new Set([3, 5, 10]);

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Read a single cell as a trimmed string. Returns `null` when the cell
 * is undefined, empty, or otherwise blank.
 */
function cellString(
  sheet: XLSX.WorkSheet,
  row: number,
  col: number,
): string | null {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[addr] as XLSX.CellObject | undefined;
  if (!cell || cell.v === undefined || cell.v === null) return null;
  return String(cell.v).trim();
}

/**
 * Read a matrix cell and return its percentage value (3, 5, or 10).
 * Returns `null` for X, empty, or any non-percentage value.
 */
function readPct(
  sheet: XLSX.WorkSheet,
  row: number,
  col: number,
): number | null {
  const raw = cellString(sheet, row, col);
  if (raw === null || raw === '' || raw.toUpperCase() === 'X') return null;

  const num = Number(raw);
  return !Number.isNaN(num) && VALID_PCT.has(num) ? num : null;
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Parse the first worksheet of the given ArrayBuffer and return the
 * structured matrix data.
 *
 * @throws {Error} if the file cannot be read or the expected layout is
 *                 not found.
 */
export function parseExcelFile(buffer: ArrayBuffer): MatrixData {
  const workbook = XLSX.read(buffer, { type: 'array' });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('The Excel file contains no worksheets.');

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error('Could not read the worksheet.');

  const ref = sheet['!ref'];
  if (!ref) throw new Error('The worksheet appears to be empty.');

  const range = XLSX.utils.decode_range(ref);

  // 1. Collect Main Rubber headers from row 5 (columns D →)
  const mainCols: { name: string; col: number }[] = [];
  for (let c = MAIN_START_COL; c <= range.e.c; c++) {
    const val = cellString(sheet, HEADER_ROW, c);
    if (val && T_CODE.test(val)) {
      mainCols.push({ name: val.toUpperCase(), col: c });
    }
  }

  if (mainCols.length === 0) {
    throw new Error(
      'No Main Rubber headers found in row 5 (starting from column D). ' +
        'Make sure the file follows the expected template.',
    );
  }

  // 2. Collect Secondary Rubber names from column C (rows 6 →)
  const secRows: { name: string; row: number }[] = [];
  for (let r = DATA_START_ROW; r <= range.e.r; r++) {
    const val = cellString(sheet, r, SECONDARY_COL);
    if (val && T_CODE.test(val)) {
      secRows.push({ name: val.toUpperCase(), row: r });
    }
  }

  if (secRows.length === 0) {
    throw new Error(
      'No Secondary Rubber names found in column C (starting from row 6). ' +
        'Make sure the file follows the expected template.',
    );
  }

  // 3. Build the value matrix
  const matrix: Record<string, Record<string, number | null>> = {};

  for (const main of mainCols) {
    const col: Record<string, number | null> = {};
    for (const sec of secRows) {
      col[sec.name] = readPct(sheet, sec.row, main.col);
    }
    matrix[main.name] = col;
  }

  return {
    mainRubbers: mainCols.map((m) => m.name),
    secondaryRubbers: secRows.map((s) => s.name),
    matrix,
  };
}

/**
 * Convenience wrapper that reads a `File` object as an `ArrayBuffer`
 * before handing it to the parser.
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsArrayBuffer(file);
  });
}
