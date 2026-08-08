import React, { useState } from 'react';
import { Play, Volume2, Mic, Eye, EyeOff, Sparkles, CheckCircle2, Layers, BookOpen, Check, Lock, Music, TrendingUp } from 'lucide-react';
import { TestMode } from '../types';
import { QUESTION_SETS } from '../data/questions';

interface IntroScreenProps {
  selectedSetId: string;
  onSelectSetId: (setId: string) => void;
  onStartTest: (mode: TestMode) => void;
  onOpenVoiceSettings: () => void;
  onOpenPronunciationGuide?: () => void;
  activeVoiceName?: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  selectedSetId,
  onSelectSetId,
  onStartTest,
  onOpenVoiceSettings,
  onOpenPronunciationGuide,
  activeVoiceName,
}) => {
  const [selectedMode, setSelectedMode] = useState<TestMode>('exam');
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'ok' | 'denied'>('idle');
  const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);

  const activeSet = QUESTION_SETS.find((s) => s.id === selectedSetId) || QUESTION_SETS[0];

  const testMic = async () => {
    setMicStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicStatus('ok');
    } catch (err) {
      console.warn('Mic access denied:', err);
      setMicStatus('denied');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Official IELTS Format • Speaking Part 3
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              IELTS Speaking Part 3 Simulator
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Experience authentic IELTS Speaking Part 3 exam practice. Choose a voice you want to hear.
            </p>
          </div>

          {/* Test Structure Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
              <span className="block text-xs text-slate-400 font-medium">Total Questions</span>
              <span className="text-lg font-bold text-white">6 Questions</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
              <span className="block text-xs text-slate-400 font-medium">Active Set</span>
              <span className="text-sm font-bold text-blue-400 truncate block">{activeSet.title}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
              <span className="block text-xs text-slate-400 font-medium">Primary Voice</span>
              <span className="text-xs font-bold text-indigo-400 truncate block">
                {activeVoiceName || 'Google US English'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
              <span className="block text-xs text-slate-400 font-medium">Export & Download</span>
              <span className="text-lg font-bold text-emerald-400">Audio & Transcripts</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION SET SELECTOR SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Select Question Practice Set</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {QUESTION_SETS.length} Sets Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUESTION_SETS.map((qSet) => {
            const isSelected = selectedSetId === qSet.id;
            return (
              <button
                key={qSet.id}
                onClick={() => onSelectSetId(qSet.id)}
                className={`p-6 rounded-3xl border text-left transition-all relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {qSet.id.toUpperCase()}
                    </span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Click to Select</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{qSet.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{qSet.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Topics: {qSet.topics.map((t) => t.title).join(' • ')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Band 7.5 Pronunciation & Intonation Masterclass Banner */}
      {onOpenPronunciationGuide && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    Master Band 7.5 Pronunciation & Intonation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300">
                    Interactive Guide
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Learn how pitch contours (↗ ↘ ↘↗), sentence stress, and connected speech differentiate Band 7.5 candidates from Band 6.0 in IELTS Speaking.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPronunciationGuide}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/10 shrink-0"
            >
              <Music className="w-4 h-4" />
              Open Pronunciation Masterclass
            </button>
          </div>
        </div>
      )}

      {/* Feature Callout: Audio-First / Hidden Text Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <EyeOff className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Question Text Hidden by Default
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/20 text-amber-300">
                Real Test Simulation
              </span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              In an authentic IELTS Speaking exam, candidates listen to questions read orally by the examiner rather than reading from a script.
              By default, question text is hidden during the simulation. However, a <strong className="text-blue-400">"Show Question Text" tool button</strong> is available at any time if you need extra support!
            </p>
          </div>
        </div>
      </div>

      {/* Topics Overview Cards for activeSet */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Questions Included in {activeSet.title}
            </h2>
            <p className="text-xs text-slate-400">6 Questions Total • 2 Topics</p>
          </div>
          
          <button
            onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition self-start sm:self-auto"
          >
            {showQuestionsPreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                Hide Question Text
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                Show Question Text
              </>
            )}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {activeSet.topics.map((topic, idx) => {
            const topicQs = activeSet.questions.filter((q) => q.topicId === topic.id);
            return (
              <div
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                      Topic {idx + 1} of 2
                    </span>
                    <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {topicQs.length} Questions
                  </span>
                </div>

                <p className="text-xs italic text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-3 py-2 rounded-lg">
                  🔊 TTS Intro: "{topic.introText}"
                </p>

                <ul className="space-y-2">
                  {topicQs.map((q, qIdx) => (
                    <li
                      key={q.id}
                      className="text-xs text-slate-300 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[11px] shrink-0">
                          {qIdx + 1}
                        </span>
                        {showQuestionsPreview ? (
                          <span className="leading-relaxed text-slate-200">{q.questionText}</span>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px] italic select-none">
                            Question {qIdx + 1} • [Hidden to simulate audio exam]
                          </span>
                        )}
                      </div>
                      {!showQuestionsPreview && (
                        <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Mode Selector */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Choose Your Practice Mode</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Exam Mode */}
          <div
            onClick={() => setSelectedMode('exam')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all ${
              selectedMode === 'exam'
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white text-base">Strict Exam Mode</span>
              <input
                type="radio"
                name="testMode"
                checked={selectedMode === 'exam'}
                onChange={() => setSelectedMode('exam')}
                className="w-4 h-4 accent-blue-500"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Simulates live exam pressure. Examiner reads questions continuously, auto-starts recording, and enforces a 45s response time per question.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Timed 45s Limit</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Auto Recording</span>
            </div>
          </div>

          {/* Practice Mode */}
          <div
            onClick={() => setSelectedMode('practice')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all ${
              selectedMode === 'practice'
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white text-base">Self-Paced Practice Mode</span>
              <input
                type="radio"
                name="testMode"
                checked={selectedMode === 'practice'}
                onChange={() => setSelectedMode('practice')}
                className="w-4 h-4 accent-blue-500"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Self-paced session. You control when to listen, pause, read hints/vocabulary, and move to the next question.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">No Time Limits</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Vocabulary Hints</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio & Mic Verification Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Microphone & Audio Check</p>
            <p className="text-xs text-slate-400">
              {micStatus === 'ok' ? 'Microphone verified and ready!' : 'Ensure your microphone is enabled to record your answers.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={testMic}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {micStatus === 'ok' ? '✓ Mic Tested' : micStatus === 'testing' ? 'Testing...' : 'Test Microphone'}
          </button>
          <button
            onClick={onOpenVoiceSettings}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Voice Settings
          </button>
        </div>
      </div>

      {/* Start Button CTA */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => onStartTest(selectedMode)}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-3 group"
        >
          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          Start {activeSet.title} Simulation
        </button>
      </div>
    </div>
  );
};
