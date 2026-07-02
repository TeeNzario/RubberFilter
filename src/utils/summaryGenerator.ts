/**
 * Summary generator — groups secondary rubbers by percentage for each
 * main rubber.
 */

import type { MatrixData, SummaryRow } from '../types';

/**
 * For every Main Rubber column, scan each Secondary Rubber and bucket
 * it into the 10 %, 5 %, or 3 % group based on the cell value.
 *
 * X / empty cells are silently skipped.
 */
export function generateSummary(data: MatrixData): SummaryRow[] {
  return data.mainRubbers.map((mainRubber) => {
    const pct10: string[] = [];
    const pct5: string[] = [];
    const pct3: string[] = [];

    const column = data.matrix[mainRubber];
    if (!column) return { mainRubber, pct10, pct5, pct3 };

    for (const secondaryRubber of data.secondaryRubbers) {
      const value = column[secondaryRubber];
      if (value === null || value === undefined) continue;

      switch (value) {
        case 10:
          pct10.push(secondaryRubber);
          break;
        case 5:
          pct5.push(secondaryRubber);
          break;
        case 3:
          pct3.push(secondaryRubber);
          break;
        // any other value is ignored
      }
    }

    return { mainRubber, pct10, pct5, pct3 };
  });
}
