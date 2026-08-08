// Check if SpeechRecognition is supported
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export interface AudioRecorderSession {
  stop: () => Promise<{ blob: Blob; audioUrl: string; transcript: string; durationSeconds: number }>;
  getVolumeLevel: () => number;
}

export class SpeechRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recognition: any = null;
  private transcript = '';
  private startTime = 0;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private mediaStream: MediaStream | null = null;

  async start(): Promise<AudioRecorderSession> {
    this.transcript = '';
    this.audioChunks = [];
    this.startTime = Date.now();

    // 1. Request Microphone Access
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 2. Setup Audio Visualizer Analyser
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (e) {
      console.warn('AudioContext setup failed:', e);
    }

    // 3. Setup MediaRecorder
    let mimeType = 'audio/webm';
    if (!MediaRecorder.isTypeSupported('audio/webm')) {
      if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      else mimeType = '';
    }

    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.mediaStream, { mimeType })
      : new MediaRecorder(this.mediaStream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);

    // 4. Setup Speech Recognition if supported
    if (isSpeechRecognitionSupported()) {
      try {
        const SpeechRecognitionClass =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          this.transcript = currentTranscript.trim();
        };

        this.recognition.onerror = (err: any) => {
          console.warn('SpeechRecognition error:', err);
        };

        this.recognition.start();
      } catch (e) {
        console.warn('Failed to start SpeechRecognition:', e);
      }
    }

    // Return controls
    return {
      stop: () => this.stop(),
      getVolumeLevel: () => this.getVolumeLevel(),
    };
  }

  getVolumeLevel(): number {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return Math.min(100, Math.round((sum / this.dataArray.length / 128) * 100));
  }

  getLiveTranscript(): string {
    return this.transcript;
  }

  async stop(): Promise<{ blob: Blob; audioUrl: string; transcript: string; durationSeconds: number }> {
    const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

    // Stop recognition
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    // Stop MediaRecorder and resolve blob
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        this.cleanup();
        resolve({ blob, audioUrl, transcript: this.transcript, durationSeconds });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        this.cleanup();
        resolve({ blob, audioUrl, transcript: this.transcript, durationSeconds });
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}
