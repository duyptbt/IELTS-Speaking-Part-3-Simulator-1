export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  questions: Question[];
}

export interface VocabularyItem {
  word: string;
  meaning: string;
}

export interface Question {
  id: number;
  topicId: string;
  topicTitle: string;
  questionText: string;
  introAudioText?: string;
  modelAnswer: string;
  bandExplanation?: string;
  keyVocabulary: VocabularyItem[];
  examinerTip: string;
}

export interface Topic {
  id: string;
  title: string;
  introText: string;
}

export interface AnswerRecord {
  questionId: number;
  questionText: string;
  topicTitle: string;
  userAudioText: string;
  audioUrl?: string;
  audioBlob?: Blob;
  durationSeconds: number;
  textRevealedDuringTest: boolean;
}

export interface VoiceSettings {
  voiceName: string;
  rate: number;
  pitch: number;
  volume: number;
}

export type UITheme = 'slate-dark' | 'midnight-navy' | 'studio-light' | 'academic-emerald' | 'high-contrast';
export type TextScale = 'standard' | 'comfortable' | 'large';
export type QuestionCardStyle = 'modern' | 'minimal' | 'focused';
export type VisualizerStyle = 'bar' | 'equalizer' | 'pulse';

export interface UISettings {
  theme: UITheme;
  textScale: TextScale;
  cardStyle: QuestionCardStyle;
  visualizerStyle: VisualizerStyle;
  audioBeeps: boolean;
  autoAdvance: boolean;
}

export type TestMode = 'exam' | 'practice';
export type TestStage = 'idle' | 'topic_intro' | 'reading_question' | 'recording_answer' | 'question_ended';
