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

        {/* Mode Indicator - UI Only - Non Printing */}
        <div className="absolute top-4 right-4 no-print flex gap-2 z-50">
          {viewMode === 'teacher' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold shadow-lg ring-2 ring-white">
              <UserCheck className="w-3 h-3" /> MODE GURU (KUNCI AKTIF)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold shadow-lg ring-2 ring-white">
              <UserCircle className="w-3 h-3" /> MODE SISWA (KUNCI TERSEMBUNYI)
            </div>
          )}
        </div>

        {/* Paper Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-sm shadow-2xl p-12 flex flex-col border border-slate-200 relative min-h-[1050px] print:shadow-none print:border-none print:rounded-none print:p-0 font-serif"
        >
          {/* Reference Header Style (KOP) */}
          <div className="flex items-center gap-4 pb-2 mb-0">
            {identity.logo ? (
              <img src={identity.logo} alt="Logo" className="w-[100px] h-[100px] object-contain flex-shrink-0" />
            ) : (
              <div className="w-[100px] h-[100px] bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0">
                <GraduationCap className="w-12 h-12" />
              </div>
            )}
            <div className="flex-1 text-center font-bold">
              <h3 className="text-[13px] uppercase leading-tight tracking-tight">MAJELIS PENDIDIKAN DASAR MENENGAH DAN PENDIDIKAN NON FORMAL</h3>
              <h3 className="text-[13px] uppercase leading-tight tracking-tight">PIMPINAN DAERAH MUHAMMADIYAH KOTA PROBOLINGGO</h3>
              <h1 className="text-xl uppercase tracking-normal mt-0.5 mb-0.5">{identity.schoolName || 'SMP MUHAMMADIYAH 1 KOTA PROBOLINGGO'}</h1>
              <p className="text-[12px] uppercase mb-0.5">TERAKREDITASI A</p>
              <div className="text-[10px] font-normal text-slate-800 leading-tight">
                {identity.schoolAddress && <span>{identity.schoolAddress} </span>}
                {identity.schoolEmail && <span>Email: <span className="text-blue-600 underline">{identity.schoolEmail}</span> </span>}
                <br />
                {identity.schoolPhone && <span>Telp/fax. {identity.schoolPhone} </span>}
                {identity.schoolWebsite && <span>Website: {identity.schoolWebsite}</span>}
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-slate-900 mb-0.5"></div>
          <div className="border-t-[3px] border-slate-900 mb-6"></div>

          <h2 className="text-center font-bold text-base uppercase mb-4 tracking-normal">MATA PELAJARAN: {identity.subject}</h2>

          <div className="bg-[#C5D1EB] border-2 border-slate-900 p-2.5 text-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest">{identity.examType || 'ASESMEN SUMATIF'}</h2>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-12 border-2 border-slate-900 mb-8 text-[12px] font-bold">
            <div className="col-span-6 p-2 border-r-2 border-slate-900 flex items-center">
              <span className="mr-2 shrink-0">Nama:</span>
              <div className="flex-1 border-b border-dotted border-slate-500 h-4 min-w-[200px]"></div>
            </div>
            <div className="col-span-3 p-2 border-r-2 border-slate-900 flex items-center">
              <span className="mr-2 shrink-0">Kelas:</span>
              <div className="flex-1 border-b border-dotted border-slate-500 h-4"></div>
            </div>
            <div className="col-span-3 p-2 flex items-center">
              <span className="mr-2 shrink-0">Tanggal:</span>
              <div className="flex-1 border-b border-dotted border-slate-500 h-4"></div>
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
                    <div className="prose prose-slate prose-sm max-w-none text-slate-900 font-bold leading-relaxed pr-8">
                      <ReactMarkdown>{q.text}</ReactMarkdown>
                    </div>
                  </div>
                  
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 pl-8">
                      {q.options.map((option, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-3 text-[13px] text-slate-900">
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

        {/* Answer Key - Controlled by ViewMode */}
        {viewMode === 'teacher' && (
          <div className="mt-12 border-t-2 border-dashed border-slate-300 pt-12 print:break-before-page">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] flex-1 bg-blue-100"></div>
              <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] px-4 py-1.5 bg-blue-50 rounded-full border border-blue-200">Kunci Jawaban & Pembahasan</h2>
              <div className="h-[2px] flex-1 bg-blue-100"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q, idx) => (
                <div key={idx} className="p-5 bg-white rounded-2xl border-2 border-slate-100 space-y-2 shadow-sm transition-all hover:border-blue-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-blue-600 uppercase">Butir Soal {idx + 1}</span>
                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 uppercase">{q.cognitiveLevel}</span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-900">
                    Kunci: <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-md ml-1">{q.correctAnswer.charAt(0)}</span>
                  </p>
                  <div className="text-[12px] text-slate-500 leading-relaxed pt-2 border-t border-slate-50">
                    <span className="font-bold text-slate-700 italic block mb-1">Pembahasan:</span> 
                    {q.explanation}
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
