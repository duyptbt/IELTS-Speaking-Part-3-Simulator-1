import { VoiceSettings } from '../types';

let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Fetch available browser SpeechSynthesis voices, waiting for onvoiceschanged if needed.
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    const onVoicesChanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      cachedVoices = updatedVoices;
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(updatedVoices);
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Safety timeout in case voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 1000);
  });
}

/**
 * Find the primary voice available in the user's browser, prioritizing 'Google US English' (en-US).
 */
export function findBestBritishFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const lowercaseName = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const langMatch = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace('_', '-');

  // 1. Primary: Exact 'Google US English' or 'Google English (US)' or 'Google US English Female'
  const googleUsExact = voices.find(
    (v) => lowercaseName(v).includes('google') && (lowercaseName(v).includes('us english') || lowercaseName(v).includes('en-us') || langMatch(v) === 'en-us')
  );
  if (googleUsExact) return googleUsExact;

  const googleEnglish = voices.find(
    (v) => lowercaseName(v).includes('google') && langMatch(v).startsWith('en')
  );
  if (googleEnglish) return googleEnglish;

  // 2. High-quality US/English voice matches
  const primeNames = [
    'google us english',
    'microsoft zira',
    'microsoft ava',
    'microsoft jenny',
    'samantha',
    'victoria',
    'microsoft hazel',
    'fiona',
    'kate',
    'serena'
  ];

  for (const nameKeyword of primeNames) {
    const match = voices.find((v) => lowercaseName(v).includes(nameKeyword));
    if (match) return match;
  }

  // 3. Any en-US voice
  const usVoice = voices.find((v) => langMatch(v) === 'en-us' || langMatch(v) === 'en_us');
  if (usVoice) return usVoice;

  // 4. Any English voice
  const anyEng = voices.find((v) => langMatch(v).startsWith('en'));
  if (anyEng) return anyEng;

  return voices[0] || null;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceName: '',
  rate: 0.92, // Natural, clear IELTS examiner tempo
  pitch: 1.05, // Crisp British female pitch
  volume: 1.0,
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Cancel ongoing speech synthesis.
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

/**
 * Speak text using Web Speech Synthesis API.
 */
export async function speakText(
  text: string,
  settings: Partial<VoiceSettings> = {},
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  return new Promise(async (resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      callbacks?.onError?.('SpeechSynthesis not supported');
      resolve();
      return;
    }

    stopSpeech();

    const voices = cachedVoices.length > 0 ? cachedVoices : await getAvailableVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (settings.voiceName) {
      selectedVoice = voices.find((v) => v.name === settings.voiceName) || null;
    }

    if (!selectedVoice) {
      selectedVoice = findBestBritishFemaleVoice(voices);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || 'en-GB';
    } else {
      utterance.lang = 'en-GB';
    }

    utterance.rate = settings.rate ?? DEFAULT_VOICE_SETTINGS.rate;
    utterance.pitch = settings.pitch ?? DEFAULT_VOICE_SETTINGS.pitch;
    utterance.volume = settings.volume ?? DEFAULT_VOICE_SETTINGS.volume;

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      callbacks?.onEnd?.();
      resolve();
    };

    utterance.onerror = (e) => {
      console.warn('TTS SpeechSynthesis error:', e);
      currentUtterance = null;
      callbacks?.onError?.(e);
      resolve();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}
