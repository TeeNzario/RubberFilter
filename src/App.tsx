/**
 * Root application component.
 *
 * Orchestrates the full flow:
 *   1. Upload Excel file
 *   2. Parse → Generate summary
 *   3. Preview table
 *   4. Download Summary.xlsx
 */

import { useState, useCallback } from 'react';
import type { SummaryRow, StatusInfo } from './types';

import Header from './components/Header';
import FileUpload from './components/FileUpload';
import StatusMessage from './components/StatusMessage';
import ResultTable from './components/ResultTable';
import LoadingSpinner from './components/LoadingSpinner';

import { parseExcelFile, readFileAsArrayBuffer } from './utils/excelParser';
import { generateSummary } from './utils/summaryGenerator';
import { exportSummaryToExcel } from './utils/excelExporter';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<SummaryRow[] | null>(null);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'idle',
    message: '',
  });

  // ── File selection ─────────────────────────────────────────────────

  const handleFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setSummary(null);
    setStatusInfo({ status: 'idle', message: '' });
  }, []);

  // ── Generate summary ──────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!file) return;

    try {
      setStatusInfo({ status: 'reading', message: 'Reading Excel file…' });
      const buffer = await readFileAsArrayBuffer(file);

      setStatusInfo({ status: 'processing', message: 'Analyzing matrix…' });

      // Small delay so the UI updates before the synchronous parse runs
      await new Promise((r) => setTimeout(r, 50));

      const matrixData = parseExcelFile(buffer);
      const result = generateSummary(matrixData);

      setSummary(result);
      setStatusInfo({
        status: 'success',
        message: `Done — ${matrixData.mainRubbers.length} main rubbers × ${matrixData.secondaryRubbers.length} secondary rubbers processed.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setSummary(null);
      setStatusInfo({ status: 'error', message });
    }
  }, [file]);

  // ── Download ──────────────────────────────────────────────────────

  const handleDownload = useCallback(() => {
    if (summary) exportSummaryToExcel(summary);
  }, [summary]);

  // ── Derived state ─────────────────────────────────────────────────

  const isProcessing =
    statusInfo.status === 'reading' || statusInfo.status === 'processing';

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Header />

        {/* ── Upload + action card ──────────────────────────────── */}
        <div className="glass-card p-6 sm:p-8 mb-6 animate-slide-up">
          <FileUpload file={file} onFileSelect={handleFileSelect} />

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {/* Generate */}
            <button
              id="btn-generate"
              className="btn-primary"
              disabled={!file || isProcessing}
              onClick={handleGenerate}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing…
                </>
              ) : (
                <>
                  {/* Sparkle icon */}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                  สรุปผลยาง
                </>
              )}
            </button>

            {/* Download — only visible after a successful generate */}
            {summary && (
              <button
                id="btn-download"
                className="btn-success animate-fade-in"
                onClick={handleDownload}
              >
                {/* Download icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                โหลดไฟล์สรุป
              </button>
            )}
          </div>
        </div>

        {/* ── Status message ────────────────────────────────────── */}
        <StatusMessage
          status={statusInfo.status}
          message={statusInfo.message}
        />

        {/* ── Results table ─────────────────────────────────────── */}
        {summary && <ResultTable data={summary} />}

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="text-center text-slate-600 text-xs mt-10 pb-4">
          Everything runs in your browser — no data leaves your device.
        </footer>
      </div>
    </div>
  );
}
