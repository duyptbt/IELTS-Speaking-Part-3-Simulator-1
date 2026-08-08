import React from 'react';
import { Volume2, Settings, RotateCcw, HelpCircle, Palette, Music } from 'lucide-react';

interface HeaderProps {
  onOpenVoiceSettings: () => void;
  onOpenUISettings?: () => void;
  onOpenPronunciationGuide?: () => void;
  onResetTest?: () => void;
  onOpenHelp?: () => void;
  activeVoiceName?: string;
  isTestRunning?: boolean;
  activeThemeName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenVoiceSettings,
  onOpenUISettings,
  onOpenPronunciationGuide,
  onResetTest,
  onOpenHelp,
  activeVoiceName,
  isTestRunning,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-xl tracking-wider">
            IELTS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-slate-100 leading-tight">
                Speaking Part 3 Simulator
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              6 Questions per Set • Practice Sets • Custom UI Themes & Audio Tools
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pronunciation & Intonation Guide Button */}
          {onOpenPronunciationGuide && (
            <button
              onClick={onOpenPronunciationGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all text-xs font-bold border border-amber-500/30 shadow-sm"
              title="Band 7.5 Pronunciation & Intonation Guide"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Band 7.5 Pronunciation</span>
            </button>
          )}

          {/* Active Voice Badge */}
          <button
            onClick={onOpenVoiceSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all text-xs border border-slate-700/60"
            title="Configure Examiner Voice & Audio"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline truncate max-w-[140px]">
              {activeVoiceName || 'Google US English'}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* UI Settings Theme & Layout Customizer Button */}
          {onOpenUISettings && (
            <button
              onClick={onOpenUISettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white transition-all text-xs font-semibold border border-indigo-700/50 shadow-sm"
              title="Configure UI Theme, Fonts & Card Styles"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">UI Settings</span>
            </button>
          )}

          {/* Help Tool Info */}
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700/60"
              title="How text reveal tools work"
            >
              <HelpCircle className="w-4 h-4 text-slate-300" />
            </button>
          )}

          {/* Reset button if test is running */}
          {isTestRunning && onResetTest && (
            <button
              onClick={onResetTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition text-xs font-medium border border-rose-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
