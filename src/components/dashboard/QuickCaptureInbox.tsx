import { motion } from "framer-motion";
import { Inbox, Plus, Mic, Tag, Clock, Zap, MoreHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useVoiceCommands } from "@/contexts/VoiceCommandContext";

interface QuickCaptureInboxProps {
  onCapture?: (text: string) => void;
}

const mockInboxItems = [
  { id: "1", text: "Review project proposal", context: "@work", timestamp: "2m ago" },
  { id: "2", text: "Call dentist for appointment", context: "@phone", timestamp: "15m ago" },
  { id: "3", text: "Research vacation destinations", context: "@computer", timestamp: "1h ago" },
];

const contexts = [
  { id: "work", label: "@work", icon: "💼" },
  { id: "home", label: "@home", icon: "🏠" },
  { id: "phone", label: "@phone", icon: "📱" },
  { id: "computer", label: "@computer", icon: "💻" },
  { id: "errands", label: "@errands", icon: "🛒" },
];

export function QuickCaptureInbox({ onCapture }: QuickCaptureInboxProps) {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState(mockInboxItems);
  const { toggleListening, isListening } = useVoiceCommands();

  const handleCapture = () => {
    if (inputValue.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: inputValue,
        context: "",
        timestamp: "now",
      };
      setItems([newItem, ...items]);
      setInputValue("");
      onCapture?.(inputValue);
    }
  };

  const handleClear = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Quick Capture</h3>
            <p className="text-xs text-muted-foreground">GTD Inbox • {items.length} items</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Capture Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="What's on your mind?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCapture()}
            className="pr-10 bg-muted/50 border-0"
          />
          <button
            onClick={toggleListening}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
              isListening ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <Button onClick={handleCapture} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Context Tags */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {contexts.map((ctx) => (
          <button
            key={ctx.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-sm whitespace-nowrap transition-colors"
          >
            <span>{ctx.icon}</span>
            <span className="text-muted-foreground">{ctx.label}</span>
          </button>
        ))}
      </div>

      {/* Inbox Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <button
              onClick={() => handleClear(item.id)}
              className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary flex items-center justify-center transition-colors"
            >
              <Check className="w-3 h-3 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{item.text}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {item.context && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.context}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.timestamp}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
              <Zap className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Inbox zero! 🎉</p>
        </div>
      )}
    </motion.div>
  );
}
