import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCog, MessageSquare, AlertCircle, Calendar, FileText, Plus, X } from "lucide-react";
import { Proactivity, CommunicationStyle } from "@/hooks/useCalibration";

interface PersonaStepProps {
  onNext: (data: {
    proactivity: Proactivity;
    communication_style: CommunicationStyle;
    urgency_threshold_minutes: number;
    primary_calendar: string;
    notes_destination: string;
    priority_contacts: string[];
  }) => void;
  onBack: () => void;
  initialData?: {
    proactivity?: Proactivity;
    communication_style?: CommunicationStyle;
    urgency_threshold_minutes?: number;
    primary_calendar?: string;
    notes_destination?: string;
    priority_contacts?: string[];
  };
}

const proactivityOptions = [
  {
    value: 'co_pilot' as Proactivity,
    label: 'Co-Pilot',
    desc: 'Guide me, but wait for my lead',
    icon: '🧭',
  },
  {
    value: 'chief_of_staff' as Proactivity,
    label: 'Chief of Staff',
    desc: 'Interrupt me if things are drifting',
    icon: '📋',
  },
];

const calendarOptions = [
  { value: 'google', label: 'Google Calendar' },
  { value: 'outlook', label: 'Microsoft Outlook' },
  { value: 'apple', label: 'Apple Calendar' },
  { value: 'sera', label: 'SERA Only' },
];

const notesOptions = [
  { value: 'sera', label: "SERA's Internal Notes" },
  { value: 'notion', label: 'Notion' },
  { value: 'obsidian', label: 'Obsidian' },
  { value: 'other', label: 'Other' },
];

const urgencyOptions = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
];

export function PersonaStep({ onNext, onBack, initialData }: PersonaStepProps) {
  const [proactivity, setProactivity] = useState<Proactivity>(initialData?.proactivity || 'co_pilot');
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>(
    initialData?.communication_style || 'conversational'
  );
  const [urgencyThreshold, setUrgencyThreshold] = useState(initialData?.urgency_threshold_minutes || 15);
  const [primaryCalendar, setPrimaryCalendar] = useState(initialData?.primary_calendar || 'google');
  const [notesDestination, setNotesDestination] = useState(initialData?.notes_destination || 'sera');
  const [priorityContacts, setPriorityContacts] = useState<string[]>(initialData?.priority_contacts || []);
  const [newContact, setNewContact] = useState('');

  const addContact = () => {
    if (newContact.trim() && !priorityContacts.includes(newContact.trim())) {
      setPriorityContacts([...priorityContacts, newContact.trim()]);
      setNewContact('');
    }
  };

  const removeContact = (contact: string) => {
    setPriorityContacts(priorityContacts.filter((c) => c !== contact));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-light"
        >
          Your AI Companion Style
        </motion.h2>
        <p className="text-muted-foreground">
          How should SERA communicate and assist you?
        </p>
      </div>

      {/* Proactivity Level */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <UserCog className="w-4 h-4 text-primary" />
          How proactive should SERA be?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {proactivityOptions.map(({ value, label, desc, icon }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setProactivity(value)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                proactivity === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <span className="text-2xl mb-2 block">{icon}</span>
              <h4 className="font-medium">{label}</h4>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Communication Style */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Communication preference
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setCommunicationStyle('concise')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              communicationStyle === 'concise'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <h4 className="font-medium">Concise & Direct</h4>
            <p className="text-sm text-muted-foreground">"Task moved to 7PM"</p>
          </button>
          <button
            onClick={() => setCommunicationStyle('conversational')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              communicationStyle === 'conversational'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <h4 className="font-medium">Natural & Friendly</h4>
            <p className="text-sm text-muted-foreground">"I've rescheduled your study session to 7PM when you'll have more energy!"</p>
          </button>
        </div>
      </div>

      {/* Urgency Definition */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          When should SERA trigger re-planning?
        </h3>
        <p className="text-sm text-muted-foreground">
          If a meeting or task shifts by more than...
        </p>
        <div className="flex flex-wrap gap-2">
          {urgencyOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setUrgencyThreshold(value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                urgencyThreshold === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Primary Calendar
          </h3>
          <select
            value={primaryCalendar}
            onChange={(e) => setPrimaryCalendar(e.target.value)}
            className="w-full bg-muted rounded-lg px-4 py-2"
          >
            {calendarOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="glass rounded-2xl p-6 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Notes Destination
          </h3>
          <select
            value={notesDestination}
            onChange={(e) => setNotesDestination(e.target.value)}
            className="w-full bg-muted rounded-lg px-4 py-2"
          >
            {notesOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Priority Contacts */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium">Priority Contacts</h3>
        <p className="text-sm text-muted-foreground">
          Whose meetings are unmovable? (Boss, Advisor, etc.)
        </p>
        
        <div className="flex flex-wrap gap-2">
          {priorityContacts.map((contact) => (
            <motion.span
              key={contact}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-full text-sm"
            >
              {contact}
              <button onClick={() => removeContact(contact)}>
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="e.g., My Boss"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addContact()}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={addContact}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={() => onNext({
            proactivity,
            communication_style: communicationStyle,
            urgency_threshold_minutes: urgencyThreshold,
            primary_calendar: primaryCalendar,
            notes_destination: notesDestination,
            priority_contacts: priorityContacts,
          })}
          className="px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
