import React, { useState } from 'react';
import { X, Volume2, Sparkles, CheckCircle2, TrendingUp, Music, Mic, BookOpen, AlertCircle, Play } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/tts';
import { VoiceSettings } from '../types';

interface PronunciationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings?: VoiceSettings;
}

interface AudioExample {
  id: string;
  category: string;
  text: string;
  speakTextStr: string;
  phoneticOrNotation: string;
  explanation: string;
  toneType: 'rising' | 'falling' | 'fall-rise' | 'stress' | 'linking';
}

const PRONUNCIATION_EXAMPLES: AudioExample[] = [
  {
    id: 'ex-1',
    category: '1. Falling Intonation (↘) for Confident Statements',
    text: "Educational institutions must establish clear rules to maintain order ↘.",
    speakTextStr: "Educational institutions must establish clear rules to maintain order.",
    phoneticOrNotation: 'Tone drops sharply on "maintain order ↘"',
    explanation: 'Expresses authoritative confidence. A falling pitch at the end of key arguments signals to the examiner that your analytical point is concluded.',
    toneType: 'falling',
  },
  {
    id: 'ex-2',
    category: '2. Rising Intonation (↗) in Lists',
    text: 'Lawyers need analytical skills ↗, persuasive communication ↗, and high resilience ↘.',
    speakTextStr: 'Lawyers need analytical skills, persuasive communication, and high resilience.',
    phoneticOrNotation: 'Pitch rises on items 1 and 2 (↗), then falls on the final item (↘)',
    explanation: 'Demonstrates sophisticated listing rhythm in Part 3 answers. Keeps the examiner engaged before concluding with a falling tone on the last trait.',
    toneType: 'rising',
  },
  {
    id: 'ex-3',
    category: '3. Fall-Rise Intonation (↘↗) for Concessions & Complex Arguments',
    text: "While electric cars are becoming more popular ↘↗, high prices still discourage buyers.",
    speakTextStr: "While electric cars are becoming more popular, high prices still discourage buyers.",
    phoneticOrNotation: 'Pitch falls then rises on "more popular ↘↗"',
    explanation: 'Essential Band 7.5 feature for Part 3! Expresses contrast, concession, or balanced perspectives ("Even though X is true, Y is also important").',
    toneType: 'fall-rise',
  },
  {
    id: 'ex-4',
    category: '4. Sentence Stress (Content vs Function Words)',
    text: 'DISCIPLINE is ESSENTIAL for CREATING a SAFE LEARNING ENVIRONMENT.',
    speakTextStr: 'Discipline is essential for creating a safe learning environment.',
    phoneticOrNotation: 'STRESSED: DISCIPLINE • ESSENTIAL • CREATING • SAFE • LEARNING • ENVIRONMENT',
    explanation: 'Avoids robotic equal stress. Emphasizing key abstract nouns, adjectives, and verbs creates the dynamic rhythm expected in Part 3 discussions.',
    toneType: 'stress',
  },
  {
    id: 'ex-5',
    category: '5. Connected Speech & Linking Words',
    text: "It's_an effective way_to persuade people_to buy_electric vehicles.",
    speakTextStr: "It's an effective way to persuade people to buy electric vehicles.",
    phoneticOrNotation: '/ɪtsən ɪfektɪv weɪtə pəsweɪd piːpl tə baɪ ɪlektrɪk viːəklz/',
    explanation: 'Smooth consonant-to-vowel linking (It\'s_an, way_to, buy_electric) ensures seamless flow when delivering detailed explanations.',
    toneType: 'linking',
  },
];

export const PronunciationGuideModal: React.FC<PronunciationGuideModalProps> = ({
  isOpen,
  onClose,
  voiceSettings,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlayExample = async (example: AudioExample) => {
    if (playingId === example.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    setPlayingId(example.id);
    await speakText(
      example.speakTextStr,
      voiceSettings,
      {
        onEnd: () => setPlayingId(null),
        onError: () => setPlayingId(null),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Band 7.5 Pronunciation & Intonation Masterclass
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Cambridge Official Criteria
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Master pitch contours, sentence stress, and connected speech to score Band 7.5+
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          {/* Key Requirement Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900 border border-blue-800/50 space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> What Cambridge Examiners Look for at Band 7.5:
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              <strong className="text-white">Band 7.5</strong> candidates show <span className="text-blue-300 font-semibold">flexible intonation</span> (pitch variation), clear <span className="text-indigo-300 font-semibold">sentence stress</span> on key words, and <span className="text-amber-300 font-semibold">connected speech</span>. You do not need a native accent, but your speech must be easy to understand throughout without strain.
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 1. Pitch Contour
              </span>
              <p className="text-[11px] text-slate-400">
                Varying voice pitch (falling ↘ for statements, rising ↗ for lists, fall-rise ↘↗ for contrast).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5" /> 2. Sentence Stress
              </span>
              <p className="text-[11px] text-slate-400">
                Emphasizing content words (nouns, main verbs) while shortening functional words.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3. Connected Speech
              </span>
              <p className="text-[11px] text-slate-400">
                Linking end consonants to starting vowels smoothly (e.g. "look_at_it").
              </p>
            </div>
          </div>

          {/* Interactive Examples Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Interactive Audio Practice & Tone Marks</span>
              <span className="text-xs text-slate-400 font-normal">Click play to listen & shadow</span>
            </h3>

            <div className="space-y-3">
              {PRONUNCIATION_EXAMPLES.map((ex) => {
                const isPlaying = playingId === ex.id;
                return (
                  <div
                    key={ex.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-300">
                        {ex.category}
                      </span>

                      <button
                        onClick={() => handlePlayExample(ex)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Volume2 className="w-3.5 h-3.5" /> Playing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Listen Audio
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm font-medium text-white bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono leading-relaxed">
                      "{ex.text}"
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="text-blue-400 font-mono text-[11px]">
                        🎵 {ex.phoneticOrNotation}
                      </span>
                      <p className="text-slate-400 text-xs sm:text-right max-w-md">
                        {ex.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Common Band 6.0 Traps to Avoid */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Common Band 6.0 Pronunciation Traps to Avoid:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-amber-200">Robotic Monotone:</strong> Speaking every single syllable with equal length and force. Remember that English is a stress-timed language.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-amber-200">Dropping End Consonants:</strong> Omitting plural "-s" or past tense "-ed" (e.g. saying "cost" instead of "costs", or "walk" instead of "walked").</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-amber-200">Over-emphasizing Weak Words:</strong> Fully pronouncing words like "to" /tuː/ or "can" /kæn/ instead of weak form /tə/ and /kən/.</span>
              </li>
            </ul>
          </div>

          {/* Quick Self-Assessment Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Band 7.5 Self-Check Before Test:
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Did I vary my voice pitch naturally?</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Did I stress important nouns & verbs?</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Did I link words smoothly without pauses?</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Are my end consonant sounds clear?</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
          >
            Got It! Return to Test Prep
          </button>
        </div>
      </div>
    </div>
  );
};
