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
  Globe
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
    <aside className="w-full lg:w-96 border-r border-slate-200 bg-white flex flex-col h-full shrink-0 min-h-0">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar overscroll-contain">
        
        {/* Toggle Mode */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <UserCircle className="w-4 h-4 text-emerald-600" /> Mode Tampilan
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange('teacher')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                viewMode === 'teacher'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserCheck className="w-3 h-3" /> Guru
            </button>
            <button
              onClick={() => onViewModeChange('student')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                viewMode === 'student'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserCircle className="w-3 h-3" /> Siswa
            </button>
          </div>
        </div>
        
        {/* Section: API Key */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <Key className="w-4 h-4 text-blue-600" /> Konfigurasi AI
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              placeholder="Gemini API Key..."
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
            />
            <button
              onClick={onSaveApiKey}
              className="w-full py-2 bg-slate-900 border border-slate-800 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
            >
              Simpan API Key
            </button>
          </div>
        </div>

        {/* Section: Sekolah */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <Building className="w-4 h-4 text-blue-600" /> Identitas Sekolah
          </label>
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              {identity.logo ? (
                <div className="relative group">
                  <img src={identity.logo} alt="School Logo" className="h-16 w-16 object-contain" />
                  <button 
                    onClick={() => onIdentityChange({ ...identity, logo: undefined })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-[10px] font-bold uppercase">Upload Logo Sekolah</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
            
            <input
              type="text"
              placeholder="Nama Sekolah..."
              value={identity.schoolName || ''}
              onChange={(e) => onIdentityChange({ ...identity, schoolName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
            />
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
