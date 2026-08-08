import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { UISettingsModal, DEFAULT_UI_SETTINGS } from './components/UISettingsModal';
import { PronunciationGuideModal } from './components/PronunciationGuideModal';
import { IntroScreen } from './components/IntroScreen';
import { TestExamView } from './components/TestExamView';
import { ResultsView } from './components/ResultsView';
import { TestMode, VoiceSettings, AnswerRecord, UISettings } from './types';
import { QUESTION_SETS } from './data/questions';
import { DEFAULT_VOICE_SETTINGS, getAvailableVoices, findBestBritishFemaleVoice } from './utils/tts';

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'test' | 'results'>('intro');
  const [selectedSetId, setSelectedSetId] = useState<string>('set-1');
  const [testMode, setTestMode] = useState<TestMode>('exam');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [uiSettings, setUiSettings] = useState<UISettings>(DEFAULT_UI_SETTINGS);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isUiModalOpen, setIsUiModalOpen] = useState(false);
  const [isPronunciationModalOpen, setIsPronunciationModalOpen] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const currentSet = QUESTION_SETS.find((s) => s.id === selectedSetId) || QUESTION_SETS[0];

  // Initialize best British female voice on mount
  useEffect(() => {
    getAvailableVoices().then((voices) => {
      const bestGb = findBestBritishFemaleVoice(voices);
      if (bestGb) {
        setVoiceSettings((prev) => ({ ...prev, voiceName: bestGb.name }));
      }
    });
  }, []);

  const handleStartTest = (mode: TestMode) => {
    setTestMode(mode);
    setAnswers([]);
    setScreen('test');
  };

  const handleFinishTest = (userAnswers: AnswerRecord[]) => {
    setAnswers(userAnswers);
    setScreen('results');
  };

  const handleResetTest = () => {
    setScreen('intro');
    setAnswers([]);
  };

  // Determine root theme container style
  const themeContainerClass =
    uiSettings.theme === 'midnight-navy'
      ? 'bg-blue-950 text-slate-100'
      : uiSettings.theme === 'studio-light'
      ? 'bg-slate-100 text-slate-900'
      : uiSettings.theme === 'academic-emerald'
      ? 'bg-emerald-950 text-emerald-50'
      : uiSettings.theme === 'high-contrast'
      ? 'bg-black text-amber-300'
      : 'bg-slate-950 text-slate-100';

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col transition-colors duration-300 ${themeContainerClass}`}>
      {/* Top Navigation */}
      <Header
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        onOpenUISettings={() => setIsUiModalOpen(true)}
        onOpenPronunciationGuide={() => setIsPronunciationModalOpen(true)}
        onResetTest={handleResetTest}
        onOpenHelp={() => setScreen('intro')}
        activeVoiceName={voiceSettings.voiceName}
        isTestRunning={screen === 'test'}
      />

      {/* Main Screen Container */}
      <main className="flex-1 pb-16">
        {screen === 'intro' && (
          <IntroScreen
            selectedSetId={selectedSetId}
            onSelectSetId={setSelectedSetId}
            onStartTest={handleStartTest}
            onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
            onOpenPronunciationGuide={() => setIsPronunciationModalOpen(true)}
            activeVoiceName={voiceSettings.voiceName}
          />
        )}

        {screen === 'test' && (
          <TestExamView
            testMode={testMode}
            voiceSettings={voiceSettings}
            uiSettings={uiSettings}
            questions={currentSet.questions}
            topics={currentSet.topics}
            onFinishTest={handleFinishTest}
            onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
            onOpenUISettings={() => setIsUiModalOpen(true)}
          />
        )}

        {screen === 'results' && (
          <ResultsView
            answers={answers}
            questions={currentSet.questions}
            onRetakeTest={() => handleStartTest('exam')}
          />
        )}
      </main>

      {/* Voice Configuration Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        settings={voiceSettings}
        onSaveSettings={(newSettings) => setVoiceSettings(newSettings)}
      />

      {/* UI & Theme Customization Modal */}
      <UISettingsModal
        isOpen={isUiModalOpen}
        onClose={() => setIsUiModalOpen(false)}
        settings={uiSettings}
        onSaveSettings={(newSettings) => setUiSettings(newSettings)}
        onResetDefault={() => setUiSettings(DEFAULT_UI_SETTINGS)}
      />

      {/* Band 7.5 Pronunciation & Intonation Guide Modal */}
      <PronunciationGuideModal
        isOpen={isPronunciationModalOpen}
        onClose={() => setIsPronunciationModalOpen(false)}
        voiceSettings={voiceSettings}
      />
    </div>
  );
}
