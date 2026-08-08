import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Clock,
  Activity,
  Sliders,
} from 'lucide-react';
import { Question, AnswerRecord, TestMode, VoiceSettings, UISettings, Topic } from '../types';
import { QUESTIONS, TOPICS } from '../data/questions';
import { speakText, stopSpeech } from '../utils/tts';
import { SpeechRecorder, AudioRecorderSession } from '../utils/stt';

interface TestExamViewProps {
  testMode: TestMode;
  voiceSettings: VoiceSettings;
  uiSettings?: UISettings;
  questions?: Question[];
  topics?: Topic[];
  onFinishTest: (answers: AnswerRecord[]) => void;
  onOpenVoiceSettings: () => void;
  onOpenUISettings?: () => void;
}

export const TestExamView: React.FC<TestExamViewProps> = ({
  testMode,
  voiceSettings,
  uiSettings,
  questions,
  topics,
  onFinishTest,
  onOpenVoiceSettings,
  onOpenUISettings,
}) => {
  const activeQuestions = questions || QUESTIONS;
  const activeTopics = topics || TOPICS;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examStage, setExamStage] = useState<'topic_intro' | 'speaking_question' | 'recording_answer' | 'paused'>('topic_intro');
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  // Text Reveal Tool state
  const [isQuestionTextRevealed, setIsQuestionTextRevealed] = useState(false);
  const [showVocabHelper, setShowVocabHelper] = useState(false);
  const [showTipHelper, setShowTipHelper] = useState(false);

  // Recording & Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  // References
  const recorderRef = useRef<SpeechRecorder | null>(null);
  const recorderSessionRef = useRef<AudioRecorderSession | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const volumeIntervalRef = useRef<any>(null);

  const currentQuestion = (activeQuestions && activeQuestions[currentQuestionIndex])
    || (activeQuestions && activeQuestions[0])
    || {
        id: 1,
        questionText: 'Tell me about yourself.',
        topicId: 'general',
        topicTitle: 'General Questions',
        introAudioText: '',
        keyVocabulary: [],
        examinerTip: '',
      };

  const currentTopic = (currentQuestion && activeTopics)
    ? activeTopics.find((t) => t.id === currentQuestion.topicId) || activeTopics[0]
    : activeTopics[0];

  const totalQuestions = activeQuestions?.length || 1;

  // Font sizing scale helper based on uiSettings
  const textScaleClass = uiSettings?.textScale === 'large'
    ? 'text-2xl sm:text-3xl font-extrabold'
    : uiSettings?.textScale === 'comfortable'
    ? 'text-xl sm:text-2xl font-bold'
    : 'text-lg sm:text-xl font-bold';

  // Card rounding & border style helper
  const cardStyleClass = uiSettings?.cardStyle === 'minimal'
    ? 'rounded-xl border-slate-800/60 bg-slate-900/80 shadow-sm'
    : uiSettings?.cardStyle === 'focused'
    ? 'rounded-3xl border-2 border-blue-500/20 bg-slate-900 shadow-2xl p-8 sm:p-10'
    : 'rounded-3xl border border-slate-800 bg-slate-900 shadow-xl';

  // Play audio beep when recording starts if enabled
  const playAudioBeep = () => {
    if (uiSettings?.audioBeeps === false) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      clearInterval(timerIntervalRef.current);
      clearInterval(volumeIntervalRef.current);
      if (recorderSessionRef.current) {
        recorderSessionRef.current.stop();
      }
    };
  }, []);

  // Handle stage progression
  useEffect(() => {
    startCurrentQuestionSequence();
  }, [currentQuestionIndex]);

  const startCurrentQuestionSequence = async () => {
    stopSpeech();
    clearInterval(timerIntervalRef.current);
    clearInterval(volumeIntervalRef.current);

    // Reset helpers and text reveal state for new question
    setIsQuestionTextRevealed(false);
    setShowVocabHelper(false);
    setShowTipHelper(false);
    setLiveTranscript('');
    setRecordingSeconds(0);

    const question = activeQuestions[currentQuestionIndex];

    // Check if we need to speak topic intro first
    if (question.introAudioText) {
      setExamStage('topic_intro');
      await speakText(question.introAudioText, voiceSettings);
    }

    // Now speak the question text
    setExamStage('speaking_question');
    await speakText(question.questionText, voiceSettings);

    // Immediately start recording answer
    startRecordingUserAnswer();
  };

  const startRecordingUserAnswer = async () => {
    // Clear any existing intervals to prevent duplicate timer loops running concurrently
    clearInterval(timerIntervalRef.current);
    clearInterval(volumeIntervalRef.current);

    setExamStage('recording_answer');
    setIsRecording(true);
    setRecordingSeconds(0);
    setLiveTranscript('');
    setMicError(null);
    playAudioBeep();

    // Start timer interval regardless of mic hardware availability so answer timer runs accurately (1 tick per second)
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1;
        // In strict exam mode or if autoAdvance is enabled, limit per question is 45 seconds
        const shouldAutoAdvance = uiSettings?.autoAdvance !== false;
        if ((testMode === 'exam' || shouldAutoAdvance) && next >= 45) {
          handleFinishAnswer();
        }
        return next;
      });
    }, 1000);

    try {
      const recorder = new SpeechRecorder();
      recorderRef.current = recorder;
      const session = await recorder.start();
      recorderSessionRef.current = session;

      // Volume visualizer interval
      volumeIntervalRef.current = setInterval(() => {
        if (session) {
          setMicVolume(session.getVolumeLevel());
        }
        if (recorderRef.current) {
          setLiveTranscript(recorderRef.current.getLiveTranscript());
        }
      }, 100);
    } catch (e: any) {
      console.warn('Microphone stream error on start:', e);
      setIsRecording(false);
      const errMessage = String(e?.message || e?.name || e || '');
      if (errMessage.includes('Requested device not found') || errMessage.includes('NotFoundError') || errMessage.includes('DevicesNotFoundError')) {
        setMicError('No microphone hardware detected on this device. You can speak out loud to practice; the response timer is active.');
      } else if (errMessage.includes('NotAllowedError') || errMessage.includes('Permission')) {
        setMicError('Microphone permission was denied. You can practice speaking out loud with the response timer.');
      } else {
        setMicError('Microphone unavailable. Practice speaking out loud with the active response timer.');
      }
    }
  };

  const handleFinishAnswer = async () => {
    clearInterval(timerIntervalRef.current);
    clearInterval(volumeIntervalRef.current);
    stopSpeech();

    let audioResult = {
      blob: new Blob(),
      audioUrl: '',
      transcript: liveTranscript,
      durationSeconds: recordingSeconds,
    };

    if (recorderSessionRef.current) {
      audioResult = await recorderSessionRef.current.stop();
      recorderSessionRef.current = null;
    }

    setIsRecording(false);

    // Record answer
    const newRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.questionText,
      topicTitle: currentQuestion.topicTitle,
      userAudioText: audioResult.transcript || liveTranscript,
      audioUrl: audioResult.audioUrl,
      audioBlob: audioResult.blob,
      durationSeconds: Math.max(1, recordingSeconds),
      textRevealedDuringTest: isQuestionTextRevealed,
    };

    const updatedAnswers = [...answers, newRecord];
    setAnswers(updatedAnswers);

    // Next question or complete test
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Test finished!
      onFinishTest(updatedAnswers);
    }
  };

  const handleReplayQuestion = async () => {
    stopSpeech();
    setExamStage('speaking_question');
    await speakText(currentQuestion.questionText, voiceSettings);
    if (!isRecording) {
      startRecordingUserAnswer();
    } else {
      setExamStage('recording_answer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Bar Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
              Topic: {currentQuestion.topicTitle}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {testMode === 'exam' ? 'Strict Exam Mode' : 'Self-Paced Practice'}
            </span>

            {onOpenUISettings && (
              <button
                onClick={onOpenUISettings}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition"
                title="Configure UI Theme & Display Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Examiner Avatar & Speech Status Card */}
      <div className={`relative p-6 sm:p-8 space-y-6 text-center ${cardStyleClass}`}>
        {/* Visual Examiner Avatar */}
        <div className="relative inline-block mx-auto">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-900 border-2 ${
              examStage === 'speaking_question' || examStage === 'topic_intro'
                ? 'border-blue-500 shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20'
                : 'border-slate-700'
            } flex items-center justify-center text-white text-3xl sm:text-4xl shadow-inner transition-all`}
          >
            👩‍🏫
          </div>

          {/* Speaking Wave Ping Indicator */}
          {(examStage === 'speaking_question' || examStage === 'topic_intro') && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 text-[10px] text-white font-bold items-center justify-center">
                🔊
              </span>
            </span>
          )}
        </div>

        {/* Status Text */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            IELTS Examiner
          </h2>
          <p className="text-xs sm:text-sm font-medium text-blue-400">
            {examStage === 'topic_intro' && 'Reading Topic Introduction...'}
            {examStage === 'speaking_question' && 'Reading Question Aloud...'}
            {examStage === 'recording_answer' && 'Listening to your response...'}
            {examStage === 'paused' && 'Test Paused'}
          </p>
        </div>

        {/* Mic Error Notice */}
        {micError && (
          <div className="mx-auto max-w-md p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2 text-left animate-in fade-in">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{micError}</span>
            </div>
            <button
              onClick={() => setMicError(null)}
              className="text-amber-400 hover:text-amber-200 text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Replay Audio Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReplayQuestion}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            Replay Examiner Question
          </button>
        </div>
      </div>

      {/* Primary Question Box with TEXT REVEAL TOOL */}
      <div className={`p-6 sm:p-8 space-y-4 ${cardStyleClass}`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Question {currentQuestion.id} Text Display
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Tool Available
            </span>
          </div>

          {/* Tool Reveal Button */}
          <button
            onClick={() => setIsQuestionTextRevealed(!isQuestionTextRevealed)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
              isQuestionTextRevealed
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {isQuestionTextRevealed ? (
              <>
                <Eye className="w-4 h-4" />
                Hide Question Text
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Show Question Text (Tool)
              </>
            )}
          </button>
        </div>

        {/* Question Content (Hidden vs Revealed with UI Text Scale) */}
        <div className="min-h-[90px] flex items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition-all">
          {isQuestionTextRevealed ? (
            <p className={`${textScaleClass} text-white text-center leading-relaxed animate-in fade-in`}>
              "{currentQuestion.questionText}"
            </p>
          ) : (
            <div className="text-center space-y-2 py-2">
              <p className="text-base sm:text-lg font-medium text-slate-400 select-none blur-[6px]">
                "{currentQuestion.questionText}"
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-800/30">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                Question text hidden (IELTS Exam Mode). Click <strong>"Show Question Text"</strong> above if you need help reading.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Recording Card */}
      <div className={`p-6 sm:p-8 space-y-6 ${cardStyleClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your Spoken Answer</h3>
              <p className="text-xs text-slate-400">
                {isRecording ? 'Microphone active — speak clearly now' : 'Waiting for examiner...'}
              </p>
            </div>
          </div>

          {/* Recording Duration Timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-slate-200">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
            {testMode === 'exam' && <span className="text-xs text-slate-500">/ 00:45</span>}
          </div>
        </div>

        {/* Mic Volume Visualizer based on uiSettings */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Mic Signal Level
              </span>
              <span className="font-mono text-emerald-400">{micVolume}%</span>
            </div>

            {/* Visualizer Style Switcher */}
            {uiSettings?.visualizerStyle === 'equalizer' ? (
              /* Multi-bar Animated Equalizer */
              <div className="flex items-end justify-center gap-1.5 h-10 p-2 bg-slate-950 rounded-2xl border border-slate-800">
                {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.3].map((factor, i) => {
                  const barHeight = Math.min(100, Math.max(10, micVolume * factor));
                  return (
                    <div
                      key={i}
                      className="w-3 bg-gradient-to-t from-emerald-500 via-teal-400 to-blue-500 rounded-full transition-all duration-75"
                      style={{ height: `${barHeight}%` }}
                    />
                  );
                })}
              </div>
            ) : uiSettings?.visualizerStyle === 'pulse' ? (
              /* Ambient Pulse Visualizer */
              <div className="flex items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800 gap-3">
                <div
                  className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center transition-all duration-100"
                  style={{ transform: `scale(${1 + micVolume / 100})` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {micVolume > 15 ? 'Active speech detected' : 'Listening for audio input...'}
                </span>
              </div>
            ) : (
              /* Standard Bar Visualizer */
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 flex items-center">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 h-full rounded-full transition-all duration-100"
                  style={{ width: `${Math.max(5, micVolume)}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Live Transcript Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Live Speech Transcript Preview:
          </span>
          <p className="text-slate-200 min-h-[40px] italic">
            {liveTranscript || (
              <span className="text-slate-600 font-normal">
                {isRecording ? '(Start speaking into your mic...)' : '(Transcript will appear here as you speak)'}
              </span>
            )}
          </p>
        </div>

        {/* Helper Tools Bar (Vocabulary & Tips) - Practice Mode Only */}
        {testMode === 'practice' && (
          <>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
              <button
                onClick={() => setShowVocabHelper(!showVocabHelper)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {showVocabHelper ? 'Hide Key Vocab' : 'Show Key Vocabulary'}
              </button>

              <button
                onClick={() => setShowTipHelper(!showTipHelper)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {showTipHelper ? 'Hide Examiner Tip' : 'Show Examiner Tip'}
              </button>
            </div>

            {/* Vocab Drawer */}
            {showVocabHelper && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 space-y-2 text-xs text-slate-200 animate-in fade-in">
                <span className="font-bold text-indigo-300 block">Recommended Vocabulary & Collocations:</span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {currentQuestion.keyVocabulary.map((v, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-900/50">
                      <span className="font-semibold text-blue-300 block">{v.word}</span>
                      <span className="text-slate-400 text-[11px]">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tip Drawer */}
            {showTipHelper && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200 space-y-1 animate-in fade-in">
                <span className="font-bold text-amber-300 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Examiner Strategy Tip:
                </span>
                <p className="text-amber-100/90 leading-relaxed">{currentQuestion.examinerTip}</p>
              </div>
            )}
          </>
        )}

        {/* Primary Action Button: Finish Answer & Next */}
        <div className="pt-2">
          <button
            onClick={handleFinishAnswer}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            Finish Answer & Next Question
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
