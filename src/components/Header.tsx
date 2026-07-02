/**
 * App header with gradient title and subtitle.
 */
export default function Header() {
  return (
    <header className="text-center mb-10 animate-fade-in">
      {/* Icon + title */}
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 14h18M3 6h18M3 18h18"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent">
          ทีนรูปหล่อ ยางฟิลเตอร์
        </h1>
      </div>

    </header>
  );
}
