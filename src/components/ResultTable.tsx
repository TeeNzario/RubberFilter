/**
 * Summary results table — displays each Main Rubber's secondary-rubber
 * groups at 10 %, 5 %, and 3 %.
 */

import type { SummaryRow } from '../types';

interface ResultTableProps {
  /** Processed summary rows to display. */
  data: SummaryRow[];
}

/** Render a list of T-codes or an em-dash when the group is empty. */
function renderGroup(codes: string[]): string {
  return codes.length > 0 ? codes.join(', ') : '—';
}

export default function ResultTable({ data }: ResultTableProps) {
  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      {/* Title bar */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <svg
          className="w-5 h-5 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125"
            />
        </svg>
        <h2 className="text-lg font-semibold text-white">Summary Results</h2>
        <span className="ml-auto text-xs text-slate-500 font-medium">
          {data.length} main rubber{data.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.04]">
              <th className="px-5 py-3.5 text-left font-semibold text-slate-300 whitespace-nowrap">
                Main Rubber
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-rose-300 whitespace-nowrap">
                10 %
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-amber-300 whitespace-nowrap">
                5 %
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-sky-300 whitespace-nowrap">
                3 %
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.mainRubber}
                className={`
                  border-t border-white/[0.04] transition-colors duration-150
                  hover:bg-white/[0.03]
                  ${idx % 2 === 1 ? 'bg-white/[0.015]' : ''}
                `}
              >
                <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">
                  {row.mainRubber}
                </td>
                <td className="px-5 py-3 text-slate-300 font-mono text-xs">
                  {renderGroup(row.pct10)}
                </td>
                <td className="px-5 py-3 text-slate-300 font-mono text-xs">
                  {renderGroup(row.pct5)}
                </td>
                <td className="px-5 py-3 text-slate-300 font-mono text-xs">
                  {renderGroup(row.pct3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
