import React, { useState, useEffect } from 'react';
import { X, Volume2, Play, Check, Sliders, Globe } from 'lucide-react';
import { VoiceSettings } from '../types';
import { getAvailableVoices, findBestBritishFemaleVoice, speakText, stopSpeech } from '../utils/tts';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSaveSettings: (newSettings: VoiceSettings) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(settings.voiceName);
  const [rate, setRate] = useState(settings.rate);
  const [pitch, setPitch] = useState(settings.pitch);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAvailableVoices().then((v) => {
        setVoices(v);
        if (!selectedVoiceName) {
          const bestGb = findBestBritishFemaleVoice(v);
          if (bestGb) setSelectedVoiceName(bestGb.name);
        }
      });
    }
  }, [isOpen, selectedVoiceName]);

  if (!isOpen) return null;

  const handleTestVoice = async () => {
    if (isPlayingTest) {
      stopSpeech();
      setIsPlayingTest(false);
      return;
    }

    setIsPlayingTest(true);
    await speakText(
      "Hello! I am your IELTS examiner today. We will now begin Part 1 of the speaking test.",
      {
        voiceName: selectedVoiceName,
        rate,
        pitch,
      },
      {
        onEnd: () => setIsPlayingTest(false),
        onError: () => setIsPlayingTest(false),
      }
    );
  };

  const handleSave = () => {
    stopSpeech();
    onSaveSettings({
      voiceName: selectedVoiceName,
      rate,
      pitch,
      volume: 1.0,
    });
    onClose();
  };

  const gbVoices = voices.filter(
    (v) => v.lang.toLowerCase().includes('en-gb') || v.lang.toLowerCase().includes('en-uk') || v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('uk')
  );
  const otherVoices = voices.filter((v) => !gbVoices.includes(v));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-slate-100">Examiner Voice Configuration</h2>
              <p className="text-xs text-slate-400">Set primary TTS voice & speech properties</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Voice Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Examiner Voice Selection
            </label>
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {gbVoices.length > 0 && (
                <optgroup label="🇬🇧 British Voices (Recommended)">
                  {gbVoices.map((v, idx) => (
                    <option key={`gb-${v.name}-${v.lang}-${idx}`} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Other Installed Browser Voices">
                {otherVoices.map((v, idx) => (
                  <option key={`other-${v.name}-${v.lang}-${idx}`} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="text-xs text-blue-400/90 mt-1.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Google US English (or closest natural English voice) selected by default.
            </p>
          </div>

          {/* Test Speech Button */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">Sample Examiner Greeting</p>
              <p className="text-xs text-slate-400 italic">"Hello! I am your IELTS examiner today..."</p>
            </div>
            <button
              onClick={handleTestVoice}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isPlayingTest
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isPlayingTest ? 'Stop Sample' : 'Listen Sample'}
            </button>
          </div>

          {/* Rate & Pitch Sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Speech Adjustments
            </div>

            {/* Speaking Rate */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Speaking Tempo</span>
                <span className="font-mono text-blue-400">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.2"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Slow & Clear (0.7x)</span>
                <span>Standard Examiner (0.92x)</span>
                <span>Fast (1.2x)</span>
              </div>
            </div>

            {/* Speaking Pitch */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Voice Pitch</span>
                <span className="font-mono text-indigo-400">{pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Lower Tone</span>
                <span>Natural Female Pitch (1.05)</span>
                <span>Higher Tone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-900/80 border-t border-slate-800">
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
