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
  onViewModeChange: (mode: 'teacher' | 'student') => void;
}

export function ExamPaper({ data, isLoading, viewMode, onViewModeChange }: ExamPaperProps) {
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

  const { identity, questions } = data;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-10 custom-scrollbar print:overflow-visible print:p-0 print:bg-white scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 print:max-w-none print:m-0 pb-40 lg:pb-10">
        
        {/* Actions bar - Card style inspired by Sentosaku */}
        <div className="flex flex-col gap-4 no-print mb-8">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                <span className="text-sm font-bold text-slate-700">Soal Siap Digunakan</span>
              </div>
              
              <div className="h-8 w-px bg-slate-100 hidden md:block mx-2" />
              
              <button 
                onClick={() => onViewModeChange(viewMode === 'teacher' ? 'student' : 'teacher')}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                  viewMode === 'teacher' 
                    ? 'bg-blue-600 text-white shadow-blue-100' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {viewMode === 'teacher' ? <UserCheck className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                {viewMode === 'teacher' ? 'Mode Guru' : 'Mode Siswa'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:flex w-full md:w-auto gap-3">
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Printer className="w-4 h-4 text-blue-600" /> Cetak
              </button>
              <button 
                onClick={() => exportToExcel(data)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 col-span-2 md:col-span-1">
                <Download className="w-4 h-4" /> Dokumen (.docx)
              </button>
            </div>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 flex flex-col items-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-sm shadow-2xl p-6 md:p-12 flex flex-col border border-slate-200 relative w-full sm:w-[794px] mx-auto print:shadow-none print:border-none print:rounded-none print:p-0 print:w-full print:mx-0 print:block font-serif overflow-visible origin-top"
          >
            <style>{`
            @media print {
              @page {
                size: A4;
                margin: 20mm 15mm;
              }
              body {
                background: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .print-break-inside-avoid {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              /* Ensure the main container doesn't restrict height */
              html, body, #root, main {
                height: auto !important;
                overflow: visible !important;
              }
            }
          `}</style>
          {/* Reference Header Style (KOP) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-2 mb-0">
            {identity.logo ? (
              <img src={identity.logo} alt="Logo" className="w-16 h-16 sm:w-[110px] sm:h-[110px] object-contain flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 sm:w-[110px] sm:h-[110px] bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0">
                <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
            )}
            <div className="flex-1 text-center text-slate-900">
              <h3 className="text-[10px] sm:text-[14px] font-bold uppercase leading-tight tracking-tight">MAJELIS PENDIDIKAN DASAR MENENGAH DAN PENDIDIKAN NON FORMAL</h3>
              <h3 className="text-[10px] sm:text-[14px] font-bold uppercase leading-tight tracking-tight">PIMPINAN DAERAH MUHAMMADIYAH KOTA PROBOLINGGO</h3>
              <h1 className="text-sm sm:text-xl font-black uppercase tracking-normal mt-1 mb-1">{identity.schoolName || 'SMP MUHAMMADIYAH 1 KOTA PROBOLINGGO'}</h1>
              <p className="text-[10px] sm:text-[13px] font-bold uppercase mb-1">TERAKREDITASI A</p>
              <div className="text-[8px] sm:text-[10px] font-medium leading-tight">
                {identity.schoolAddress && <span>{identity.schoolAddress} </span>}
                {identity.schoolEmail && <span>Email: <span className="text-blue-600 underline font-semibold">{identity.schoolEmail}</span> </span>}
                <br />
                {identity.schoolPhone && <span>Telp/fax. {identity.schoolPhone} </span>}
                {identity.schoolWebsite && <span>Website: <span className="font-semibold">{identity.schoolWebsite}</span></span>}
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-slate-900 mb-0.5"></div>
          <div className="border-t-[3px] border-slate-900 mb-6"></div>

          <h2 className="text-center font-bold text-base uppercase mb-4 tracking-normal">MATA PELAJARAN: {identity.subject}</h2>

          <div className="bg-[#C5D1EB] border-2 border-slate-900 p-2.5 text-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest">{identity.examType || 'ASESMEN SUMATIF'}</h2>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-2 border-slate-900 mb-8 text-[11px] sm:text-[12px] font-bold">
            <div className="col-span-1 sm:col-span-6 p-2 border-b-2 sm:border-b-0 sm:border-r-2 border-slate-900 flex items-center">
              <span className="mr-2 shrink-0">Nama:</span>
              <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
            </div>
            <div className="col-span-1 sm:col-span-3 p-2 border-b-2 sm:border-b-0 sm:border-r-2 border-slate-900 flex items-center">
              <span className="mr-2 shrink-0">Kelas:</span>
              <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
            </div>
            <div className="col-span-1 sm:col-span-3 p-2 flex items-center">
              <span className="mr-2 shrink-0">Tanggal:</span>
              <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[13px] font-black uppercase border-b border-slate-900 pb-1 mb-4">BAGIAN : PENILAIAN PILIHAN GANDA</h3>
          </div>

          <div className="flex-1 space-y-8">
            {/* Questions Section */}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="space-y-3 print-break-inside-avoid pb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-bold text-slate-900 w-4 shrink-0">{idx + 1}.</span>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-900 font-normal leading-relaxed pr-8">
                      <ReactMarkdown>{q.text}</ReactMarkdown>
                    </div>
                  </div>
                  
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 pl-4 sm:pl-8 max-w-[600px]">
                      {q.options.slice(0, 4).map((option, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-1 text-[13px] text-slate-900">
                          <span className="font-normal shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                          <span className="font-normal leading-tight">{option.replace(/^[A-E][.\)]\s*/i, '')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Key for Teacher Mode */}
                  {viewMode === 'teacher' && (
                    <div className="ml-8 mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-[11px] font-bold text-blue-800 italic">
                      Kunci Jawaban: {q.correctAnswer.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
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
