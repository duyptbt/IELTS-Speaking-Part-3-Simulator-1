import React from 'react';
import {
  X,
  Palette,
  Type,
  Layout,
  Activity,
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Zap,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { UISettings, UITheme, TextScale, QuestionCardStyle, VisualizerStyle } from '../types';

interface UISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UISettings;
  onSaveSettings: (newSettings: UISettings) => void;
  onResetDefault: () => void;
}

export const DEFAULT_UI_SETTINGS: UISettings = {
  theme: 'slate-dark',
  textScale: 'standard',
  cardStyle: 'modern',
  visualizerStyle: 'bar',
  audioBeeps: true,
  autoAdvance: true,
};

export const UISettingsModal: React.FC<UISettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetDefault,
}) => {
  if (!isOpen) return null;

  const themes: { id: UITheme; name: string; desc: string; icon: any; colorClass: string }[] = [
    {
      id: 'cambridge-navy',
      name: 'Cambridge Royal Navy',
      desc: 'Prestigious university navy canvas with warm gold & ivory accents.',
      icon: GraduationCap,
      colorClass: 'bg-[#0d172a] border-amber-400/60 text-amber-300',
    },
    {
      id: 'oxford-parchment',
      name: 'Oxford Scholarly Parchment',
      desc: 'Classic ivory university library style with deep wine & slate typography.',
      icon: BookOpen,
      colorClass: 'bg-[#f8f6f0] border-amber-800/40 text-amber-900',
    },
    {
      id: 'academic-emerald',
      name: 'Academic Emerald',
      desc: 'Focused dark forest palette with mint accents.',
      icon: Sparkles,
      colorClass: 'bg-emerald-950 border-emerald-500/50 text-emerald-400',
    },
    {
      id: 'slate-dark',
      name: 'Slate Dark (Default)',
      desc: 'Balanced deep slate canvas with indigo accents.',
      icon: Moon,
      colorClass: 'bg-slate-900 border-indigo-500/50 text-indigo-400',
    },
    {
      id: 'midnight-navy',
      name: 'Midnight Navy',
      desc: 'Deep oceanic blues with vibrant cyan highlighting.',
      icon: Moon,
      colorClass: 'bg-blue-950 border-cyan-500/50 text-cyan-400',
    },
    {
      id: 'studio-light',
      name: 'Studio Light Mode',
      desc: 'Clean paper-white layout for daytime practice.',
      icon: Sun,
      colorClass: 'bg-slate-100 border-blue-600 text-blue-600',
    },
    {
      id: 'high-contrast',
      name: 'High Contrast Dark',
      desc: 'Maximum legibility black canvas with amber gold.',
      icon: Zap,
      colorClass: 'bg-black border-amber-400 text-amber-400',
    },
  ];

  const textScales: { id: TextScale; name: string; sampleText: string; desc: string }[] = [
    {
      id: 'standard',
      name: 'Standard Text',
      sampleText: 'Aa (100%)',
      desc: 'Default size, ideal for standard desktop screens.',
    },
    {
      id: 'comfortable',
      name: 'Comfortable (+15%)',
      sampleText: 'Aa (115%)',
      desc: 'Slightly larger font size for easier reading.',
    },
    {
      id: 'large',
      name: 'Large Display (+30%)',
      sampleText: 'Aa (130%)',
      desc: 'Prominent, bold text scale for maximum focus.',
    },
  ];

  const cardStyles: { id: QuestionCardStyle; name: string; desc: string }[] = [
    {
      id: 'modern',
      name: 'Modern Elevated Cards',
      desc: 'Rounded corners, rich subtle gradients, and glowing audio borders.',
    },
    {
      id: 'minimal',
      name: 'Minimal Paper Layout',
      desc: 'Flat layout with clean typography dividers and minimal ornamentation.',
    },
    {
      id: 'focused',
      name: 'Simulated Desk Screen',
      desc: 'Spacious full-width layout resembling official computer-delivered IELTS screens.',
    },
  ];

  const visualizerStyles: { id: VisualizerStyle; name: string; desc: string }[] = [
    {
      id: 'bar',
      name: 'Smooth Audio Level Bar',
      desc: 'Dynamic horizontal signal strength bar with percentage readout.',
    },
    {
      id: 'equalizer',
      name: 'Multi-bar Animated Waveform',
      desc: 'Frequency waveform bars that bounce to your voice.',
    },
    {
      id: 'pulse',
      name: 'Ambient Pulsing Circle',
      desc: 'Minimal glowing circle indicator that expands when speech is detected.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">UI & Visual Customization</h2>
              <p className="text-xs text-slate-400">Customize themes, text sizing, cards, and audio visualizer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* Section 1: Color Themes */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              1. Visual Color Theme Palette
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((t) => {
                const IconComponent = t.icon;
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSaveSettings({ ...settings, theme: t.id })}
                    className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-blue-500 bg-slate-800/90 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg border text-xs font-bold ${t.colorClass}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-semibold text-sm text-white">{t.name}</span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Text Size Scale */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-400" />
              2. Typography Text Scale
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {textScales.map((ts) => {
                const isSelected = settings.textScale === ts.id;
                return (
                  <button
                    key={ts.id}
                    onClick={() => onSaveSettings({ ...settings, textScale: ts.id })}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-indigo-500 bg-slate-800/90 ring-2 ring-indigo-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-indigo-400">{ts.sampleText}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div>
                      <span className="block font-semibold text-xs text-white">{ts.name}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ts.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Question Layout Style */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layout className="w-4 h-4 text-teal-400" />
              3. Question Card Layout Style
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cardStyles.map((cs) => {
                const isSelected = settings.cardStyle === cs.id;
                return (
                  <button
                    key={cs.id}
                    onClick={() => onSaveSettings({ ...settings, cardStyle: cs.id })}
                    className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                      isSelected
                        ? 'border-teal-500 bg-slate-800/90 ring-2 ring-teal-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{cs.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cs.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Microphone Waveform Visualizer */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              4. Audio Recording Visualizer Style
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {visualizerStyles.map((vs) => {
                const isSelected = settings.visualizerStyle === vs.id;
                return (
                  <button
                    key={vs.id}
                    onClick={() => onSaveSettings({ ...settings, visualizerStyle: vs.id })}
                    className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                      isSelected
                        ? 'border-rose-500 bg-slate-800/90 ring-2 ring-rose-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{vs.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{vs.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Interaction Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              5. Audio & Navigation Toggles
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Audio Beeps */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-xs text-white">Soft Audio Transition Beeps</span>
                  <span className="text-[11px] text-slate-400">Plays subtle chime when recording starts</span>
                </div>
                <button
                  onClick={() => onSaveSettings({ ...settings, audioBeeps: !settings.audioBeeps })}
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    settings.audioBeeps ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition transform ${
                      settings.audioBeeps ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Advance */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-xs text-white">Auto-Advance on 35s Limit</span>
                  <span className="text-[11px] text-slate-400">Proceeds to next question automatically</span>
                </div>
                <button
                  onClick={() => onSaveSettings({ ...settings, autoAdvance: !settings.autoAdvance })}
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    settings.autoAdvance ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition transform ${
                      settings.autoAdvance ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <button
            onClick={onResetDefault}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
