import React, { useState } from 'react';
import {
  Download,
  FileText,
  RotateCcw,
  CheckCircle2,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  Mic,
  BookOpen,
  FileSpreadsheet,
  Archive,
  Loader2,
  PackageCheck,
  FolderArchive,
} from 'lucide-react';
import JSZip from 'jszip';
import { AnswerRecord, Question } from '../types';
import { QUESTIONS } from '../data/questions';

interface ResultsViewProps {
  answers: AnswerRecord[];
  questions?: Question[];
  onRetakeTest: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  answers,
  questions,
  onRetakeTest,
}) => {
  const activeQuestions = questions || QUESTIONS;
  const topicsSummary = Array.from(new Set(activeQuestions.map((q) => q.topicTitle))).join(' & ');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(1);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const totalDuration = answers.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;

  const handlePrint = () => {
    window.print();
  };

  // Download Everything in a single ZIP Bundle
  const handleDownloadEverythingZIP = async () => {
    setIsZipping(true);
    setZipSuccess(false);

    try {
      const zip = new JSZip();
      const timestamp = new Date().toLocaleString();
      const dateStr = new Date().toISOString().slice(0, 10);

      // 1. Full TXT Transcript
      let txtContent = `=====================================================\n`;
      txtContent += `IELTS SPEAKING PART 3 - COMPLETE TEST PACKAGE\n`;
      txtContent += `Date: ${timestamp}\n`;
      txtContent += `Questions Answered: ${answers.length} / ${activeQuestions.length}\n`;
      txtContent += `Total Duration Spoken: ${minutes}m ${seconds}s\n`;
      txtContent += `=====================================================\n\n`;

      activeQuestions.forEach((q, idx) => {
        const rec = answers.find((a) => a.questionId === q.id);
        txtContent += `-----------------------------------------------------\n`;
        txtContent += `QUESTION ${idx + 1} [Topic: ${q.topicTitle.toUpperCase()}]\n`;
        txtContent += `Examiner Prompt: "${q.questionText}"\n`;
        txtContent += `Spoken Duration: ${rec?.durationSeconds || 0} seconds\n`;
        txtContent += `Candidate Answer: "${rec?.userAudioText || '(No transcript recorded)'}"\n`;
        txtContent += `Band 7.5 Reference Answer: "${q.modelAnswer}"\n`;
        if (q.bandExplanation) {
          txtContent += `Why Band 7.5: ${q.bandExplanation}\n`;
        }
        txtContent += `\n`;
      });

      zip.file('01_Test_Transcripts_And_Answers.txt', txtContent);

      // 2. Full Markdown Report
      let mdContent = `# IELTS Speaking Part 3 - Candidate Answers & Questions\n\n`;
      mdContent += `- **Date**: ${timestamp}\n`;
      mdContent += `- **Total Questions Answered**: ${answers.length} / ${activeQuestions.length}\n`;
      mdContent += `- **Total Audio Duration**: ${minutes}m ${seconds}s\n\n`;
      mdContent += `---\n\n`;

      activeQuestions.forEach((q, idx) => {
        const rec = answers.find((a) => a.questionId === q.id);
        mdContent += `### Question ${idx + 1}: ${q.questionText}\n`;
        mdContent += `**Topic**: ${q.topicTitle} | **Duration**: ${rec?.durationSeconds || 0}s\n\n`;
        mdContent += `> **Candidate Response**:\n> "${rec?.userAudioText || '(No transcript recorded)'}"\n\n`;
        mdContent += `**Cambridge Band 7.5 Reference Answer**:\n_${q.modelAnswer}_\n\n`;
        if (q.bandExplanation) {
          mdContent += `*${q.bandExplanation}*\n\n`;
        }
        mdContent += `---\n\n`;
      });

      zip.file('02_Test_Report.md', mdContent);

      // 3. Structured JSON Data
      const exportData = {
        testName: 'IELTS Speaking Part 3',
        date: new Date().toISOString(),
        summary: {
          questionsAnswered: answers.length,
          totalQuestions: QUESTIONS.length,
          totalDurationSeconds: totalDuration,
        },
        responses: QUESTIONS.map((q) => {
          const rec = answers.find((a) => a.questionId === q.id);
          return {
            questionId: q.id,
            topic: q.topicTitle,
            questionText: q.questionText,
            durationSeconds: rec?.durationSeconds || 0,
            candidateTranscript: rec?.userAudioText || '',
            referenceModelAnswer: q.modelAnswer,
            bandExplanation: q.bandExplanation || '',
          };
        }),
      };

      zip.file('03_Test_Data.json', JSON.stringify(exportData, null, 2));

      // 4. Cambridge Model Answers Reference Document
      let modelAnswersDoc = `CAMBRIDGE IELTS SPEAKING PART 3 - BAND 7.5 MODEL ANSWERS & EXPLANATIONS\n\n`;
      QUESTIONS.forEach((q, idx) => {
        modelAnswersDoc += `Q${idx + 1} (${q.topicTitle}): "${q.questionText}"\n`;
        modelAnswersDoc += `Band 7.5 Answer: "${q.modelAnswer}"\n`;
        if (q.bandExplanation) {
          modelAnswersDoc += `${q.bandExplanation}\n`;
        }
        modelAnswersDoc += `\n`;
      });

      zip.file('04_Band7.5_Model_Answers_Reference.txt', modelAnswersDoc);

      // 5. Audio Files Directory
      const audioFolder = zip.folder('audio_recordings');

      for (let i = 0; i < QUESTIONS.length; i++) {
        const q = QUESTIONS[i];
        const answerRec = answers.find((a) => a.questionId === q.id);
        if (!answerRec) continue;

        let blob: Blob | null = answerRec.audioBlob || null;

        if (!blob && answerRec.audioUrl) {
          try {
            const resp = await fetch(answerRec.audioUrl);
            blob = await resp.blob();
          } catch (e) {
            console.warn(`Could not fetch audio for question ${q.id}`, e);
          }
        }

        if (blob) {
          const fileName = `Q${q.id}_${q.topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}.webm`;
          audioFolder?.file(fileName, blob);
        }
      }

      // Generate Zip File
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `IELTS_Speaking_Part3_Complete_Package_${dateStr}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (error) {
      console.error('Error creating ZIP package:', error);
      alert('Failed to package downloads into a ZIP file. Please try downloading individual files.');
    } finally {
      setIsZipping(false);
    }
  };

  // Download Transcript as TXT
  const handleDownloadTranscriptTXT = () => {
    const timestamp = new Date().toLocaleString();
    let textContent = `=====================================================\n`;
    textContextHeader();
    function textContextHeader() {
      textContent += `IELTS SPEAKING PART 3 - TEST RECORDINGS & TRANSCRIPT\n`;
      textContent += `Date: ${timestamp}\n`;
      textContent += `Questions Answered: ${answers.length} / ${activeQuestions.length}\n`;
      textContent += `Total Duration Spoken: ${minutes}m ${seconds}s\n`;
      textContent += `=====================================================\n\n`;
    }

    activeQuestions.forEach((q, idx) => {
      const rec = answers.find((a) => a.questionId === q.id);
      textContent += `-----------------------------------------------------\n`;
      textContent += `QUESTION ${idx + 1} (${q.topicTitle.toUpperCase()})\n`;
      textContent += `Examiner Prompt: "${q.questionText}"\n`;
      textContent += `Spoken Duration: ${rec?.durationSeconds || 0} seconds\n`;
      textContent += `Candidate Answer: "${rec?.userAudioText || '(No transcript recorded)'}"\n`;
      textContent += `Band 7.5 Reference Response: "${q.modelAnswer}"\n`;
      if (q.bandExplanation) {
        textContent += `Why Band 7.5: ${q.bandExplanation}\n`;
      }
      textContent += `\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IELTS_Speaking_Part3_Answers_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Transcript as Markdown
  const handleDownloadTranscriptMD = () => {
    const timestamp = new Date().toLocaleString();
    let mdContent = `# IELTS Speaking Part 3 - Candidate Responses\n\n`;
    mdContent += `- **Date**: ${timestamp}\n`;
    mdContent += `- **Total Questions**: ${answers.length} / ${activeQuestions.length}\n`;
    mdContent += `- **Total Duration Spoken**: ${minutes}m ${seconds}s\n\n`;
    mdContent += `---\n\n`;

    activeQuestions.forEach((q, idx) => {
      const rec = answers.find((a) => a.questionId === q.id);
      mdContent += `### Q${idx + 1}: ${q.questionText}\n`;
      mdContent += `**Topic**: ${q.topicTitle} | **Duration**: ${rec?.durationSeconds || 0}s\n\n`;
      mdContent += `> **Candidate Response**:\n> "${rec?.userAudioText || '(No transcript recorded)'}"\n\n`;
      mdContent += `**Band 7.5 Reference Response**:\n_${q.modelAnswer}_\n\n`;
      if (q.bandExplanation) {
        mdContent += `*${q.bandExplanation}*\n\n`;
      }
      mdContent += `---\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IELTS_Speaking_Part3_Answers_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Transcript as JSON
  const handleDownloadTranscriptJSON = () => {
    const exportData = {
      testName: 'IELTS Speaking Part 3',
      date: new Date().toISOString(),
      summary: {
        questionsAnswered: answers.length,
        totalQuestions: activeQuestions.length,
        totalDurationSeconds: totalDuration,
      },
      responses: activeQuestions.map((q) => {
        const rec = answers.find((a) => a.questionId === q.id);
        return {
          questionId: q.id,
          topic: q.topicTitle,
          questionText: q.questionText,
          durationSeconds: rec?.durationSeconds || 0,
          candidateTranscript: rec?.userAudioText || '',
          referenceModelAnswer: q.modelAnswer,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IELTS_Speaking_Part3_Data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Individual audio file download helper
  const handleDownloadAudio = (questionId: number, audioUrl?: string, audioBlob?: Blob) => {
    if (!audioUrl && !audioBlob) {
      alert('No audio recording available for this question.');
      return;
    }

    const downloadUrl = audioUrl || (audioBlob ? URL.createObjectURL(audioBlob) : '');
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `IELTS_Speaking_Part3_Q${questionId}_Answer.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Test Session Completed
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Your Recorded Answers & Questions
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              All {activeQuestions.length} responses across {topicsSummary} have been saved. Review your recorded spoken audio, transcripts, and download your complete test output below.
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl shrink-0">
            <div className="text-center px-2">
              <span className="block text-2xl font-bold text-blue-400">{answers.length}/{activeQuestions.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Questions</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="block text-2xl font-bold text-emerald-400">
                {minutes}m {seconds}s
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Spoken Audio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Export & Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Featured "Download Everything" Hero Action */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Complete Bundle Export
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Download Everything (Single ZIP Archive)
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Downloads a complete archive containing all {activeQuestions.length} recorded audio files (.webm), transcripts (.txt), markdown report (.md), structured data (.json), and Cambridge Band 7.5+ model answers.
            </p>
          </div>

          <button
            onClick={handleDownloadEverythingZIP}
            disabled={isZipping}
            className={`w-full md:w-auto px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition shadow-xl shrink-0 ${
              zipSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isZipping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                Packaging ZIP File...
              </>
            ) : zipSuccess ? (
              <>
                <PackageCheck className="w-5 h-5 text-white" />
                ZIP Downloaded Successfully!
              </>
            ) : (
              <>
                <Archive className="w-5 h-5" />
                Download Everything (.zip)
              </>
            )}
          </button>
        </div>

        {/* Individual File Export Toolbar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Or Download Individual Format Files:
            </h3>
            <span className="text-[11px] text-slate-400">Select format</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Download Text File */}
            <button
              onClick={handleDownloadTranscriptTXT}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Download TXT File
            </button>

            {/* Download Markdown */}
            <button
              onClick={handleDownloadTranscriptMD}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Download Markdown (.md)
            </button>

            {/* Download JSON */}
            <button
              onClick={handleDownloadTranscriptJSON}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              Download JSON Data
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Retake test CTA button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Question-by-Question Audio & Transcripts
        </h2>

        <button
          onClick={onRetakeTest}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold text-xs border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Simulation
        </button>
      </div>

      {/* Question-by-Question Detailed Review */}
      <div className="space-y-3">
        {activeQuestions.map((q) => {
          const answerRec = answers.find((a) => a.questionId === q.id);
          const isExpanded = expandedQuestionId === q.id;

          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{q.id}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Topic: {q.topicTitle}
                    </span>
                    <h3 className="text-sm font-semibold text-white truncate">{q.questionText}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {answerRec?.durationSeconds || 0}s spoken
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Content */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-5 text-xs">
                  {/* Spoken Audio Player & Audio Download Button */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-slate-200">Spoken Recording:</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {answerRec?.audioUrl || answerRec?.audioBlob ? (
                        <>
                          <audio controls src={answerRec.audioUrl} className="w-full sm:w-64 h-9" />
                          <button
                            onClick={() =>
                              handleDownloadAudio(
                                q.id,
                                answerRec.audioUrl,
                                answerRec.audioBlob
                              )
                            }
                            className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
                            title="Download audio recording (.webm)"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Audio
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-500 italic">No audio recorded for this response</span>
                      )}
                    </div>
                  </div>

                  {/* Candidate Transcript */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Candidate Spoken Transcript:
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 italic leading-relaxed text-sm">
                      "{answerRec?.userAudioText || '(No transcript recorded for this response)'}"
                    </div>
                  </div>

                  {/* Reference Model Answer */}
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
                    <span className="font-bold text-blue-300 block flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Cambridge Band 7.5 Sample Answer for Comparison:
                    </span>
                    <p className="text-slate-200 leading-relaxed text-sm italic font-serif">
                      "{q.modelAnswer}"
                    </p>
                    {q.bandExplanation && (
                      <p className="text-xs text-blue-300/90 pt-1 border-t border-blue-900/30">
                        {q.bandExplanation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
