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
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { exportToExcel } from '../services/excelService';

interface ExamPaperProps {
  data: ExamData | null;
  isLoading: boolean;
  activeView: string;
}

export function ExamPaper({ data, isLoading }: ExamPaperProps) {
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

        {/* Paper Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-sm shadow-2xl p-12 flex flex-col border border-slate-200 relative min-h-[900px] print:shadow-none print:border-none print:rounded-none print:p-0"
        >
          {/* Exam Header */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-6 mb-8">
            <h1 className="text-xl font-bold uppercase tracking-tight leading-tight">Penilaian Harian Semester Ganjil</h1>
            <h2 className="text-lg font-bold uppercase tracking-tighter">SMP NEGERI INDONESIA</h2>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Tahun Pelajaran {identity.academicYear}</p>
          </div>

          {/* Identity Table-style */}
          <div className="grid grid-cols-2 text-[12px] mb-10 gap-x-12 gap-y-2 font-medium border-b border-slate-100 pb-6">
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Mata Pelajaran</span>
              <span className="font-bold">: {identity.subject}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Nama Guru</span>
              <span className="font-bold">: {identity.teacherName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Kelas / Fase</span>
              <span className="font-bold">: {identity.grade} / {identity.phase}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Nama Siswa</span>
              <span className="font-bold border-b border-slate-300 flex-1 ml-2"></span>
            </div>
          </div>

          <div className="flex-1 space-y-10">
            {/* Questions Section */}
            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-bold text-slate-900 w-6 shrink-0">{idx + 1}.</span>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-900 font-medium leading-relaxed">
                      <ReactMarkdown>{q.text}</ReactMarkdown>
                    </div>
                  </div>
                  
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pl-9">
                      {q.options.map((option, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-4 text-sm text-slate-700">
                          <span className="font-bold w-4">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{option}</span>
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
