/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ExamIdentity, 
  QuestionType, 
  CognitiveLevel, 
  ExamMode 
} from '../types';
import { 
  Settings2, 
  FileText, 
  User, 
  BookOpen, 
  Key, 
  Zap,
  Plus,
  Trash2,
  Upload,
  UserCheck,
  UserCircle,
  Building,
  Mail,
  Phone,
  Globe,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  identity: ExamIdentity;
  onIdentityChange: (identity: ExamIdentity) => void;
  selectedType: QuestionType;
  onTypeChange: (type: QuestionType) => void;
  selectedMode: ExamMode;
  onModeChange: (mode: ExamMode) => void;
  onGenerate: () => void;
  isLoading: boolean;
  activeView: string;
  onViewChange: (view: 'input' | 'preview') => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSaveApiKey: () => void;
  viewMode: 'teacher' | 'student';
  onViewModeChange: (mode: 'teacher' | 'student') => void;
}

export function Sidebar({
  identity,
  onIdentityChange,
  selectedType,
  onTypeChange,
  selectedMode,
  onModeChange,
  onGenerate,
  isLoading,
  activeView,
  onViewChange,
  apiKey,
  onApiKeyChange,
  onSaveApiKey,
  viewMode,
  onViewModeChange
}: SidebarProps) {
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic.trim()) {
      onIdentityChange({
        ...identity,
        topics: [...identity.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const removeTopic = (index: number) => {
    onIdentityChange({
      ...identity,
      topics: identity.topics.filter((_, i) => i !== index)
    });
  };

  const toggleLevel = (level: CognitiveLevel) => {
    const isSelected = identity.levels.includes(level);
    if (isSelected) {
      onIdentityChange({
        ...identity,
        levels: identity.levels.filter(l => l !== level)
      });
    } else {
      onIdentityChange({
        ...identity,
        levels: [...identity.levels, level]
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran logo maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onIdentityChange({
          ...identity,
          logo: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full lg:w-[420px] border-r border-slate-200 bg-white flex flex-col h-full shrink-0 min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 custom-scrollbar scroll-smooth">
        
        {/* Logo Section - Mobile Only */}
        <div className="lg:hidden flex flex-col items-center justify-center mb-8 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-3xl border border-blue-100/50">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">BuatinSoal<span className="text-blue-600">MU</span></h2>
          <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-blue-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engine Active</span>
          </div>
        </div>

        {/* Action Toggle Area */}
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Mode Konfigurasi
          </h3>
          <div className="space-y-4">
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => onViewModeChange('teacher')}
                className={`flex-1 py-3 text-[11px] font-bold uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  viewMode === 'teacher'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Guru
              </button>
              <button
                onClick={() => onViewModeChange('student')}
                className={`flex-1 py-3 text-[11px] font-bold uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  viewMode === 'student'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <UserCircle className="w-4 h-4" /> Siswa
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[QuestionType.MULTIPLE_CHOICE, QuestionType.ESSAY].map((type) => (
                <button
                  key={type}
                  onClick={() => onTypeChange(type)}
                  className={`py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                    selectedType === type
                      ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-2 ring-blue-600/10'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
                  }`}
                >
                  {type === QuestionType.MULTIPLE_CHOICE ? 'Pilihan Ganda' : 'Essay / Isian'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI API Configuration */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <Key className="w-4 h-4 text-blue-500" /> API Key Gemini
          </h3>
          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm gap-2">
            <input
              type="password"
              placeholder="Masukkan API Key..."
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:bg-white transition-all"
            />
            <button
              onClick={onSaveApiKey}
              className="px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Simpan
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed px-1">
            *Dapatkan API Key gratis di <a href="https://aistudio.google.com/" target="_blank" className="text-blue-500 underline font-bold">Google AI Studio</a>.
          </p>
        </div>

        {/* Identity Section */}
        <div className="space-y-6 pt-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <Building className="w-4 h-4 text-emerald-500" /> Identitas Satuan
          </h3>
          
          <div className="grid grid-cols-1 gap-5">
            {/* Logo Upload Card */}
            <div className={`p-6 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center gap-4 ${
              identity.logo ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300'
            }`}>
              {identity.logo ? (
                <div className="relative">
                  <img src={identity.logo} alt="Logo" className="h-20 w-20 object-contain drop-shadow-md" />
                  <button 
                    onClick={() => onIdentityChange({ ...identity, logo: undefined })}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-xl hover:bg-red-600 transition-all active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-3 cursor-pointer group w-full">
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-600">Klik Upload Logo</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">PNG/JPG (Max 2MB)</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                placeholder="Contoh: SMP Muhammadiyah 1 Probolinggo"
                value={identity.schoolName || ''}
                onChange={(e) => onIdentityChange({ ...identity, schoolName: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-medium outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5"
              />
            </div>
            <input
              type="text"
              placeholder="Alamat Sekolah..."
              value={identity.schoolAddress || ''}
              onChange={(e) => onIdentityChange({ ...identity, schoolAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Email..."
                value={identity.schoolEmail || ''}
                onChange={(e) => onIdentityChange({ ...identity, schoolEmail: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] outline-none focus:border-blue-500 transition-all shadow-sm"
              />
              <input
                type="text"
                placeholder="Telp/Fax..."
                value={identity.schoolPhone || ''}
                onChange={(e) => onIdentityChange({ ...identity, schoolPhone: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Section: Identitas */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <User className="w-4 h-4 text-blue-600" /> Konfigurasi Ujian
          </label>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Mata Pelajaran</label>
              <input
                type="text"
                value={identity.subject}
                onChange={(e) => onIdentityChange({ ...identity, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
                placeholder="IPA, Fisika, Matematika..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Kelas</label>
                <input
                  type="text"
                  value={identity.grade}
                  onChange={(e) => onIdentityChange({ ...identity, grade: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
                  placeholder="7, 8, 9..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Fase</label>
                <input
                  type="text"
                  value={identity.phase}
                  onChange={(e) => onIdentityChange({ ...identity, phase: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
                  placeholder="D, E, F..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Jenis Ujian</label>
              <input
                type="text"
                value={identity.examType || ''}
                onChange={(e) => onIdentityChange({ ...identity, examType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
                placeholder="ASESMEN SUMATIF / PENILAIAN HARIAN"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Guru</label>
              <input
                type="text"
                value={identity.teacherName}
                onChange={(e) => onIdentityChange({ ...identity, teacherName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Section: Topics */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <BookOpen className="w-4 h-4 text-blue-600" /> Materi & Topik
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              placeholder="Tambah topik..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
            />
            <button
              onClick={addTopic}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {identity.topics.map((topic, index) => (
                <motion.span
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100"
                >
                  {topic}
                  <button 
                    onClick={() => removeTopic(index)}
                    className="p-0.5 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Section: Question Settings */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <Settings2 className="w-4 h-4 text-blue-600" /> Parameter Soal
          </label>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Tipe Soal</label>
              <div className="grid grid-cols-1 gap-2">
                {[QuestionType.MULTIPLE_CHOICE, QuestionType.ESSAY, QuestionType.TRUE_FALSE, QuestionType.MATCHING].map(type => (
                  <button
                    key={type}
                    onClick={() => onTypeChange(type)}
                    className={`px-3 py-2 text-xs font-bold rounded-md border transition-all text-left flex items-center justify-between ${
                      selectedType === type
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {type}
                    {selectedType === type && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Level Kognitif</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(CognitiveLevel).map(level => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`px-2 py-1 text-[10px] font-bold rounded border transition-all ${
                      identity.levels.includes(level)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300'
                    }`}
                  >
                    {level.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Jumlah Soal</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={identity.questionCount}
                  onChange={(e) => onIdentityChange({ ...identity, questionCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Mode Soal</label>
                <select
                  value={selectedMode}
                  onChange={(e) => onModeChange(e.target.value as ExamMode)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm appearance-none"
                >
                  {Object.values(ExamMode).map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 bg-white border-t border-slate-200">
        <button
          onClick={onGenerate}
          disabled={isLoading || !apiKey}
          className="w-full py-4 lg:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase tracking-wider text-[11px] lg:text-xs shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Zap className="w-4 h-4 fill-current" />
          )}
          GENERATE SOAL SEKARANG
        </button>
      </div>
    </aside>
  );
}
