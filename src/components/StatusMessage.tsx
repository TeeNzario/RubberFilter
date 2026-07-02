/**
 * Status banner — displays contextual messages for each processing
 * stage (reading → processing → success / error).
 */

import type { ProcessingStatus } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface StatusMessageProps {
  status: ProcessingStatus;
  message: string;
}

/** Icon + colour palette per status. */
function statusStyle(status: ProcessingStatus) {
  switch (status) {
    case 'reading':
    case 'processing':
      return {
        bg: 'bg-indigo-500/10 border-indigo-500/30',
        text: 'text-indigo-300',
        icon: <LoadingSpinner size="sm" />,
      };
    case 'success':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        text: 'text-emerald-300',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        ),
      };
    case 'error':
      return {
        bg: 'bg-red-500/10 border-red-500/30',
        text: 'text-red-300',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        ),
      };
    default:
      return { bg: '', text: 'text-slate-400', icon: null };
  }
}

export default function StatusMessage({ status, message }: StatusMessageProps) {
  if (status === 'idle') return null;

  const { bg, text, icon } = statusStyle(status);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${bg} ${text} mb-6 animate-fade-in`}
    >
      {icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
