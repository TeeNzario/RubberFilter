/**
 * Excel exporter — creates a Summary.xlsx and triggers a browser
 * download without any server round-trip.
 *
 * Output format (vertical, 3 rows per main rubber):
 *
 *   A        B      C
 *   ───────  ────   ──────────────────
 *            10%    (10% rubbers)
 *   T258     5%     T514,T573,T582
 *            3%     T548
 *   (blank row)
 *            10%    …
 *   T419     5%     …
 *            3%     …
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { SummaryRow } from '../types';

/**
 * Build a Summary.xlsx in the vertical 3-row-per-rubber format and
 * trigger a browser download.
 */
export function exportSummaryToExcel(summary: SummaryRow[]): void {
  // Build an Array-of-Arrays with 3 rows per main rubber + blank separator
  const aoa: (string | undefined)[][] = [];
  const merges: XLSX.Range[] = [];

  for (let i = 0; i < summary.length; i++) {
    const row = summary[i];
    if (!row) continue;

    const startRow = aoa.length; // 0-indexed row where this group begins

    // Row 1: MainRubber | 10% | list  (name goes here — top-left of merge)
    aoa.push([row.mainRubber, '10%', row.pct10.join(',')]);
    // Row 2: (blank) | 5% | list
    aoa.push([undefined, '5%', row.pct5.join(',')]);
    // Row 3: (blank) | 3% | list
    aoa.push([undefined, '3%', row.pct3.join(',')]);

    // Merge column A across the 3 rows so the rubber name is centred
    merges.push({
      s: { r: startRow, c: 0 },
      e: { r: startRow + 2, c: 0 },
    });

    // Blank separator row between groups (skip after the last one)
    if (i < summary.length - 1) {
      aoa.push([]);
    }
  }

  // Create worksheet from AOA
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Apply vertical merges
  ws['!merges'] = merges;

  // Column widths
  ws['!cols'] = [
    { wch: 12 }, // A — Main Rubber
    { wch: 6 },  // B — 10% / 5% / 3%
    { wch: 40 }, // C — rubber list
  ];

  // Assemble workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Summary');

  // Write to binary array → Blob → saveAs (file-saver handles filename reliably)
  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([wbOut], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, 'Summary.xlsx');
}

