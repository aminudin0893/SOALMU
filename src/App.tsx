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
    <div className="flex flex-col h-screen h-[100dvh] bg-white font-sans overflow-hidden print:h-auto print:overflow-visible">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative print:h-auto print:overflow-visible print:block">
        {/* Mobile View Toggle */}
        <div className="lg:hidden flex bg-white/95 backdrop-blur-md border-b border-slate-200 p-2 z-40 no-print shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveView('input')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeView === 'input'
                  ? 'bg-white shadow-md text-blue-600 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Input Data
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeView === 'preview'
                  ? 'bg-white shadow-md text-blue-600 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Hasil Preview
            </button>
          </div>
        </div>

        {/* Sidebar / Input Area */}
        <div className={`${activeView === 'input' ? 'flex w-full' : 'hidden'} lg:flex lg:w-96 shrink-0 no-print min-h-0`}>
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
        <div className={`${activeView === 'preview' ? 'flex flex-1' : 'hidden'} lg:flex flex-1 flex-col min-h-0 print:h-auto print:overflow-visible print:block bg-slate-100`}>
          <ExamPaper 
            data={examData} 
            isLoading={isLoading} 
            activeView={activeView} 
            viewMode={viewMode} 
            onViewModeChange={setViewMode}
          />
        </div>
      </main>

      <footer className="h-auto py-2 lg:h-10 bg-slate-900 text-slate-400 px-4 lg:px-6 flex flex-col lg:flex-row items-center justify-between text-[10px] shrink-0 border-t border-slate-800 no-print gap-2">
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

