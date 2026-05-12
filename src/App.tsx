/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExamPaper } from './components/ExamPaper';
import { ExamIdentity, ExamData, QuestionType, CognitiveLevel, ExamMode } from './types';
import { generateQuestions } from './services/geminiService';
import { Edit3, Eye } from 'lucide-react';

export default function App() {
  const [identity, setIdentity] = useState<ExamIdentity>({
    subject: 'Pendidikan Agama Islam',
    grade: '7',
    phase: 'D',
    academicYear: '2024/2025',
    topics: ['Sejarah Kebudayaan Islam'],
    levels: [CognitiveLevel.C2],
    questionCount: 5,
    teacherName: 'Aminudin, S.Pd.',
    schoolName: 'SMP MUHAMMADIYAH 1 KOTA PROBOLINGGO',
    schoolAddress: 'Jl. Mayjend Panjaitan 73 Kota Probolinggo',
    schoolEmail: 'smp_muh_prob@yahoo.co.id',
    schoolPhone: '0335-422307',
    schoolWebsite: 'smpmusapro.sch.id',
    examType: 'ASESMEN SUMATIF'
  });

  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [selectedMode, setSelectedMode] = useState<ExamMode>(ExamMode.BIASA);
  const [activeView, setActiveView] = useState<'input' | 'preview'>('input');
  const [viewMode, setViewMode] = useState<'teacher' | 'student'>('teacher');
  
  const [apiKey, setApiKey] = useState(() => {
    // Priority: Local Storage -> Environment
    const stored = localStorage.getItem('BUATINSOAL_GEMINI_KEY');
    if (stored) return stored;
    return (process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") ? "" : (process.env.GEMINI_API_KEY || "");
  });

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('BUATINSOAL_GEMINI_KEY', apiKey);
      alert('API Key tersimpan secara lokal!');
    } else {
      localStorage.removeItem('BUATINSOAL_GEMINI_KEY');
      alert('API Key dikosongkan.');
    }
  };

  const handleGenerate = async () => {
    if (!apiKey && !(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")) {
      alert("Harap masukkan API Key terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setActiveView('preview');
    try {
      const response = await generateQuestions(identity, selectedType, apiKey);
      setExamData({
        identity,
        questions: response.questions,
        kisiKisi: response.kisiKisi
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Gagal membuat soal. Periksa konsol untuk detail atau coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans print:h-auto print:overflow-visible">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row relative min-h-0 print:h-auto print:overflow-visible print:block">
        {/* Mobile View Toggle - Removed in favor of bottom nav for better UX */}
        
        {/* Sidebar / Input Area */}
        <div className={`${activeView === 'input' ? 'flex w-full' : 'hidden'} lg:flex lg:w-[420px] shrink-0 no-print min-h-0 lg:border-r lg:border-slate-200 bg-white`}>
          <Sidebar 
            identity={identity}
            onIdentityChange={setIdentity}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            activeView={activeView}
            onViewChange={setActiveView}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onSaveApiKey={handleSaveApiKey}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        
        {/* Main Content / Preview Area */}
        <div className={`${activeView === 'preview' ? 'flex flex-1' : 'hidden'} lg:flex flex-1 flex-col min-h-0 print:h-auto print:overflow-visible print:block bg-slate-50 relative`}>
          <ExamPaper 
            data={examData} 
            isLoading={isLoading} 
            activeView={activeView} 
            viewMode={viewMode} 
            onViewModeChange={setViewMode}
          />

          {/* Floating Bottom Navigation for Mobile */}
          <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm no-print">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl flex p-1.5 items-center">
              <button
                onClick={() => setActiveView('input')}
                className={`flex-1 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  activeView === 'input'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Input</span>
              </button>
              <div className="w-[1px] h-8 bg-slate-200 mx-1" />
              <button
                onClick={() => setActiveView('preview')}
                className={`flex-1 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  activeView === 'preview'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Preview</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-10 bg-slate-900 text-slate-400 px-6 hidden lg:flex items-center justify-between text-[10px] shrink-0 border-t border-slate-800 no-print">
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px] lg:text-[10px]">Status:</span>
            <span className="text-emerald-400 font-bold text-[8px] lg:text-[10px]">AKTIF</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-center">
            <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px] lg:text-[10px]">Engine:</span>
            <span className="text-blue-400 font-bold text-[8px] lg:text-[10px]">GEMINI 1.5 FLASH</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Regional:</span>
            <span className="text-white font-bold text-[10px]">ID (INDONESIA)</span>
          </div>
        </div>
        <div className="font-bold uppercase tracking-widest opacity-60 text-[8px] lg:text-[10px]">
          © 2026 BuatinSoal AI Technology • Kurikulum Merdeka v4.2
        </div>
      </footer>
    </div>
  );
}

