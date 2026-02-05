import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useVoiceCommands } from "@/contexts/VoiceCommandContext";

export function VoiceOverlay() {
  const { isListening, isProcessing, transcript, interimTranscript, toggleListening, isSupported } = useVoiceCommands();
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);

  useEffect(() => {
    if (transcript && !transcriptHistory.includes(transcript)) {
      setTranscriptHistory((prev) => [...prev.slice(-2), transcript]);
    }
  }, [transcript, transcriptHistory]);

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
      <AnimatePresence>
        {/* Transcript Bubbles */}
        {isListening && (interimTranscript || transcript) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-max max-w-md"
          >
            <div className="glass rounded-2xl px-6 py-3 backdrop-blur-xl border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Volume2 className="w-3 h-3" />
                <span>Listening...</span>
              </div>
              <p className="text-foreground">
                {interimTranscript || transcript}
              </p>
            </div>
            {/* Bubble tail */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45 glass border-r border-b border-primary/20" />
          </motion.div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2"
          >
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Voice Button */}
      <motion.button
        onClick={toggleListening}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
          isListening
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        {/* Pulsating rings when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            </>
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
        >
          {isListening ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>

      {/* Hotkey hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
      >
        Hold <kbd className="px-1.5 py-0.5 rounded bg-muted">Space</kbd> to talk
      </motion.div>
    </div>
  );
}
