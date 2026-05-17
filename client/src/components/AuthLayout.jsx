export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-900" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Ithara.ai</h1>
          <p className="text-indigo-100 mt-2 text-lg">Team Task Manager</p>
          <p className="text-indigo-200/80 mt-6 max-w-sm leading-relaxed">
            Plan, track, and deliver work with your team — beautifully simple.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-white font-display">Ithara.ai</h1>
            <p className="text-slate-400 text-sm">Team Task Manager</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-semibold text-white font-display">{title}</h2>
            {subtitle && <p className="text-slate-400 text-sm mt-1 mb-6">{subtitle}</p>}
            {!subtitle && <div className="mb-6" />}
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
