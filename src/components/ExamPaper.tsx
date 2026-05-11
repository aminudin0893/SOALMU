/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamData } from '../types';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Book,
  User,
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
  UserCheck,
  UserCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { exportToExcel } from '../services/excelService';

interface ExamPaperProps {
  data: ExamData | null;
  isLoading: boolean;
  activeView: string;
  viewMode: 'teacher' | 'student';
}

export function ExamPaper({ data, isLoading, viewMode }: ExamPaperProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Menyusun Naskah Ujian</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            AI sedang menganalisis materi Anda dan merumuskan butir soal berkualitas tinggi...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/30">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-600">Belum Ada Data</h3>
        <p className="text-sm max-w-xs mx-auto mt-2 leading-relaxed">
          Silakan masukkan identitas dan topik ujian di panel kiri, lalu klik tombol "Buat Soal Sekarang".
        </p>
      </div>
    );
  }

  const { identity, questions, kisiKisi } = data;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 lg:p-8 custom-scrollbar">
      <div className="max-w-[640px] mx-auto space-y-8">
        
        {/* Actions bar */}
        <div className="flex items-center justify-between no-print mb-8 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" /> CETAK / PDF
            </button>
            <button 
              onClick={() => exportToExcel(data)}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> EXCEL (.XLS)
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-[11px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
              <Download className="w-3.5 h-3.5" /> UNDUH .DOCX
            </button>
          </div>
        </div>

        {/* Mode Indicator - UI Only */}
        <div className="absolute top-4 right-4 no-print flex gap-2">
          {viewMode === 'teacher' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold shadow-lg">
              <UserCheck className="w-3 h-3" /> MODE GURU
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold shadow-lg">
              <UserCircle className="w-3 h-3" /> MODE SISWA
            </div>
          )}
        </div>

        {/* Paper Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-sm shadow-2xl p-12 flex flex-col border border-slate-200 relative min-h-[900px] print:shadow-none print:border-none print:rounded-none print:p-0 font-serif"
        >
          {/* Reference Header Style */}
          <div className="flex items-center gap-6 pb-4 mb-2 border-b-2 border-slate-900 border-double">
            {identity.logo ? (
              <img src={identity.logo} alt="Logo" className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-slate-300">
                <GraduationCap className="w-12 h-12" />
              </div>
            )}
            <div className="flex-1 text-center">
              <h3 className="text-[12px] font-bold uppercase leading-tight tracking-tight">MAJELIS PENDIDIKAN DASAR MENENGAH DAN PENDIDIKAN NON FORMAL</h3>
              <h3 className="text-[12px] font-bold uppercase leading-tight tracking-tight">PIMPINAN DAERAH MUHAMMADIYAH KOTA PROBOLINGGO</h3>
              <h1 className="text-xl font-bold uppercase tracking-tight mt-1 mb-1">{identity.schoolName || 'NAMA SEKOLAH ANDA'}</h1>
              <p className="text-[10px] font-bold uppercase mb-1">TERAKREDITASI A</p>
              <div className="text-[9px] font-medium text-slate-600 leading-tight">
                {identity.schoolAddress && <span>{identity.schoolAddress} </span>}
                {identity.schoolEmail && <span>Email: <span className="text-blue-600 underline">{identity.schoolEmail}</span> </span>}
                {identity.schoolPhone && <span>Telp/fax. {identity.schoolPhone} </span>}
                {identity.schoolWebsite && <span>Website: {identity.schoolWebsite}</span>}
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-slate-900 mb-6"></div>

          <h2 className="text-center font-bold text-sm uppercase mb-4 tracking-widest border-b-[1px] border-slate-900 pb-2">MATA PELAJARAN: {identity.subject}</h2>

          <div className="bg-blue-100/30 border border-slate-900 p-3 text-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest">{identity.examType || 'ASESMEN SUMATIF'}</h2>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-3 border border-slate-900 mb-8 text-[11px]">
            <div className="p-2 border-r border-slate-900 flex items-center">
              <span className="font-medium mr-2">Nama:</span>
              <div className="flex-1 border-b border-dotted border-slate-500 mt-2"></div>
            </div>
            <div className="p-2 border-r border-slate-900 flex items-center">
              <span className="font-medium mr-2">Kelas:</span>
              <div className="flex-1 border-b border-dotted border-slate-500 mt-2"></div>
            </div>
            <div className="p-2 flex items-center">
              <span className="font-medium mr-2">Tanggal:</span>
              <div className="flex-1 border-b border-dotted border-slate-500 mt-2"></div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-black uppercase border-b border-slate-900 pb-1 mb-4">BAGIAN : PENILAIAN PILIHAN GANDA</h3>
          </div>

          <div className="flex-1 space-y-8">
            {/* Questions Section */}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-bold text-slate-900 w-4 shrink-0">{idx + 1}.</span>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-900 font-bold leading-relaxed">
                      <ReactMarkdown>{q.text}</ReactMarkdown>
                    </div>
                  </div>
                  
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-flow-col grid-rows-2 gap-x-12 gap-y-1 pl-8">
                      {q.options.map((option, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-3 text-[12px] text-slate-800">
                          <span className="font-normal shrink-0">{String.fromCharCode(65 + oIdx)}. {option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Paper Footer with Watermark-like appearance */}
          <div className="absolute bottom-12 right-12 flex items-center gap-2 opacity-10 pointer-events-none select-none">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-bold">B</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">BUATINSOAL AI</span>
          </div>
        </motion.div>

        {/* Answer Key Separator for non-print view */}
        {viewMode === 'teacher' && (
          <div className="no-print border-t border-slate-200 pt-12 space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-200"></div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kunci Jawaban & Pembahasan</h2>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Butir Soal {idx + 1}</span>
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{q.cognitiveLevel}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">Jawaban: <span className="text-emerald-600 ml-1">{q.correctAnswer}</span></p>
                  <div className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-50">
                    <span className="font-bold mr-1">Pembahasan:</span> {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Dummy for icon
function FileText(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
