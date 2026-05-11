/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center leading-none">
            BuatinSoal <span className="text-blue-600 ml-1">AI</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
            Kurikulum Merdeka Edition
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
