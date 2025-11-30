import React, { useState, useRef, useEffect } from 'react';
import { Screen, Transaction } from '../types';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Header } from '../components/Shared';
import { voice } from '../api';

interface Props {
  onNavigate: (screen: Screen) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onToggleMenu: () => void;
}

const VoiceScreen: React.FC<Props> = ({ onNavigate, onAddTransaction, onToggleMenu }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('Appuyez pour parler');
  const [transcription, setTranscription] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' }); // or audio/webm depending on browser
        await processAudio(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("Je vous écoute...");
      setTranscription('');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setStatus("Erreur micro");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("Traitement...");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_command.mp3');

      const response = await voice.send(formData);
      const result = response.data;

      if (result.status === 'success' && result.transaction) {
        setTranscription(result.transcription);
        setStatus("Transaction ajoutée !");

        // Add to local state/context if needed, though backend has it now.
        // We might want to show a success message or navigate.
        // onAddTransaction is likely for optimistic UI or local state update.
        // Let's call it to update the UI.
        onAddTransaction(result.transaction);

        setTimeout(() => {
          setStatus("Appuyez pour parler");
          setTranscription('');
        }, 3000);
      } else {
        setTranscription(result.transcription || "Je n'ai pas compris.");
        setStatus("Commande non reconnue");
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      setStatus("Erreur serveur");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isProcessing) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 relative pb-24 transition-colors">
      {/* Top Menu */}
      <Header
        onBack={() => onNavigate(Screen.DASHBOARD)}
        onMenu={onToggleMenu}
      />

      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        {/* Ripple Effect Circle */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Outer Ring */}
          <div className={`absolute w-[320px] h-[320px] rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-1000 ${isRecording ? 'scale-110 opacity-50 animate-pulse' : 'scale-100'}`}></div>
          {/* Middle Ring */}
          <div className={`absolute w-[230px] h-[230px] rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-1000 delay-100 ${isRecording ? 'scale-110 opacity-60 animate-pulse' : 'scale-100'}`}></div>

          {/* Inner Button */}
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`w-[140px] h-[140px] rounded-full border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center relative z-10 shadow-sm transition-colors duration-300 ${isRecording ? 'bg-red-50 dark:bg-red-900/30 text-red-500 border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-800 text-accent dark:text-green-400'}`}
          >
            {isProcessing ? (
              <Loader2 size={48} className="animate-spin" />
            ) : isRecording ? (
              <Square size={48} fill="currentColor" />
            ) : (
              <Mic size={64} />
            )}
          </button>
        </div>

        <div className="text-center space-y-2 px-6">
          {isRecording ? (
            <>
              <h2 className="text-4xl text-primary dark:text-white font-bold animate-pulse">Je vous écoute...</h2>
              <p className="text-gray-400 text-sm">Dites "Ajoute une dépense de 5000 pour le Taxi"</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl text-primary dark:text-white font-bold">
                {isProcessing ? "Analyse en cours..." : "Nouvel enregistrement"}
              </h2>
              {transcription && (
                <p className="text-gray-600 dark:text-gray-300 mt-4 italic">"{transcription}"</p>
              )}
            </>
          )}
        </div>
        <div className="absolute bottom-32 text-gray-400 text-sm font-medium">{status}</div>
      </div>
    </div>
  );
};

export default VoiceScreen;