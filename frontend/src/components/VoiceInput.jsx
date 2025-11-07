import { useState, useEffect } from 'react';
import { MdMic, MdMicOff } from 'react-icons/md';

const VoiceInput = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        parseVoiceInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setSupported(true);
    }
  }, []);

  const parseVoiceInput = (text) => {
    const taskData = { title: text, priority: 'medium', tags: [] };

    // Parse priority
    if (/high priority|urgent|important/i.test(text)) {
      taskData.priority = 'high';
      taskData.title = text.replace(/high priority|urgent|important/gi, '').trim();
    } else if (/low priority/i.test(text)) {
      taskData.priority = 'low';
      taskData.title = text.replace(/low priority/gi, '').trim();
    }

    // Parse due date
    const today = new Date();
    if (/today/i.test(text)) {
      taskData.dueDate = today.toISOString().split('T')[0];
      taskData.title = taskData.title.replace(/today/gi, '').trim();
    } else if (/tomorrow/i.test(text)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskData.dueDate = tomorrow.toISOString().split('T')[0];
      taskData.title = taskData.title.replace(/tomorrow/gi, '').trim();
    } else if (/next week/i.test(text)) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      taskData.dueDate = nextWeek.toISOString().split('T')[0];
      taskData.title = taskData.title.replace(/next week/gi, '').trim();
    }

    // Parse tags
    const tagMatch = text.match(/tag(?:ged)?\s+(\w+)/i);
    if (tagMatch) {
      taskData.tags = [tagMatch[1]];
      taskData.title = taskData.title.replace(/tag(?:ged)?\s+\w+/gi, '').trim();
    }

    onResult(taskData);
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-3 rounded-full transition-all ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <MdMicOff className="text-xl" /> : <MdMic className="text-xl" />}
    </button>
  );
};

export default VoiceInput;
