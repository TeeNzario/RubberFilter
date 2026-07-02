/**
 * Drag-and-drop file upload zone with click-to-browse fallback.
 * Accepts .xlsx and .xls files only.
 */

import { useRef, useState, useCallback } from "react";

interface FileUploadProps {
  /** Currently selected file (shown in the UI). */
  file: File | null;
  /** Callback when a valid Excel file is selected. */
  onFileSelect: (file: File) => void;
}

/** Accepted MIME types and extensions. */
const ACCEPT =
  ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

function isExcel(file: File): boolean {
  return /\.(xlsx|xls)$/i.test(file.name);
}

/** Format bytes into a human-readable string. */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({ file, onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Drag events ────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const dropped = e.dataTransfer.files[0];
      if (dropped && isExcel(dropped)) {
        onFileSelect(dropped);
      }
    },
    [onFileSelect],
  );

  // ── Click / change events ─────────────────────────────────────────

  const handleClick = useCallback(() => inputRef.current?.click(), []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileSelect(selected);
    },
    [onFileSelect],
  );

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div
      role="button"
      tabIndex={0}
      id="upload-zone"
      aria-label="Upload Excel file"
      className={`
        relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center
        transition-all duration-300 ease-out cursor-pointer
        ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
            : "border-white/20 hover:border-indigo-400/60 hover:bg-white/[0.02]"
        }
      `}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleChange}
      />

      {file ? (
        /* ── File selected state ──────────────────────────────────── */
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          {/* Green check icon */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <div>
            <p className="text-white font-semibold text-lg">{file.name}</p>
            <p className="text-slate-400 text-sm mt-0.5">
              {formatSize(file.size)} · Click or drop to replace
            </p>
          </div>
        </div>
      ) : (
        /* ── Empty state ──────────────────────────────────────────── */
        <div className="flex flex-col items-center gap-4">
          {/* Upload cloud icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </div>

          <div>
            <p className="text-white font-semibold text-lg">
              {isDragging
                ? "วางตรงนี้คร้าบบบบบบ"
                : "ลากไฟล์ หรือกดอัปโหลดไฟล์ตรงนี้น้องกัญ"}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              or{" "}
              <span className="text-indigo-400 underline underline-offset-2">
                เลือกไฟล์ฮะ
              </span>{" "}
              · .xlsx, .xls
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
