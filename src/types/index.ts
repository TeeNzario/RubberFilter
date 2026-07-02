/**
 * Shared type definitions for the Rubber Stock Analyzer application.
 */

// ─── Parsed Data ────────────────────────────────────────────────────

/** Parsed matrix extracted from the uploaded Excel file. */
export interface MatrixData {
  /** Main Rubber codes from the header row (columns). */
  mainRubbers: string[];
  /** Secondary Rubber codes from the first data column (rows). */
  secondaryRubbers: string[];
  /**
   * Cell values keyed by [mainRubber][secondaryRubber].
   * Value is the percentage (3, 5, or 10) or `null` for X / empty.
   */
  matrix: Record<string, Record<string, number | null>>;
}

// ─── Summary Output ─────────────────────────────────────────────────

/** One row of the generated summary — one per Main Rubber. */
export interface SummaryRow {
  /** Main Rubber code (e.g. "T258"). */
  mainRubber: string;
  /** Secondary rubbers blended at 10 %. */
  pct10: string[];
  /** Secondary rubbers blended at 5 %. */
  pct5: string[];
  /** Secondary rubbers blended at 3 %. */
  pct3: string[];
}

// ─── UI State ───────────────────────────────────────────────────────

/** Possible processing states for the UI. */
export type ProcessingStatus =
  | 'idle'
  | 'reading'
  | 'processing'
  | 'success'
  | 'error';

/** Payload shown in the status banner. */
export interface StatusInfo {
  status: ProcessingStatus;
  message: string;
}
