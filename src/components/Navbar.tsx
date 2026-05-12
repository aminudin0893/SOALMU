/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="h-20 px-6 sm:px-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50 no-print">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center leading-none">
            BuatinSoal<span className="text-blue-600">MU</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Kurikulum Merdeka
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-600">Gemini 2.0 Flash Connected</span>
        </div>
        <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
          <User className="w-4 h-4" />
        </div>
      </div>
    </nav>
  );
}
