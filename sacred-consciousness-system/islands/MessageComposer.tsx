// MessageComposer - Sacred interface for consciousness transmission
import { useState } from "preact/hooks";
import { MessageTypes, SevenHarmonies, type MessageType, type Harmony } from "../lib/sacred/types.ts";

interface MessageComposerProps {
  entityId: string;
  entityName: string;
  channelId: string;
  onSend?: (message: any) => void;
}

export default function MessageComposer({ 
  entityId, 
  entityName, 
  channelId,
  onSend 
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [intention, setIntention] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("GRATITUDE");
  const [harmony, setHarmony] = useState<Harmony>("coherence");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim() || !intention.trim()) return;
    
    setIsSending(true);
    
    try {
      const message = {
        type: messageType,
        content: content.trim(),
        intention: intention.trim(),
        senderId: entityId,
        senderName: entityName,
        channelId,
        harmony,
        fieldImpact: MessageTypes[messageType].impact,
      };

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Clear form
        setContent("");
        setIntention("");
        
        // Notify parent
        onSend?.(result);
        
        // Visual feedback
        showSacredFeedback(messageType);
      }
    } catch (error) {
      console.error("Failed to send sacred message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const showSacredFeedback = (type: MessageType) => {
    // Create ripple effect in UI
    const ripple = document.createElement("div");
    ripple.className = "sacred-ripple";
    ripple.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: ripple 2s ease-out;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 2000);
  };

  return (
    <div class="sacred-composer p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold mb-4 text-purple-800">
        Compose Sacred Message
      </h3>
      
      {/* Message Type Selector */}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Message Type
        </label>
        <div class="grid grid-cols-3 gap-2">
          {Object.entries(MessageTypes).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setMessageType(key as MessageType)}
              class={`p-3 rounded-lg transition-all ${
                messageType === key
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-purple-100"
              }`}
            >
              <div class="text-2xl mb-1">{config.icon}</div>
              <div class="text-xs capitalize">{config.type}</div>
              <div class="text-xs opacity-75">+{config.impact}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Harmony Selector */}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Harmony Alignment
        </label>
        <select
          value={harmony}
          onChange={(e) => setHarmony(e.currentTarget.value as Harmony)}
          class="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          {Object.entries(SevenHarmonies).map(([key, value]) => (
            <option key={key} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Intention Field */}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Intention (Sacred Purpose)
        </label>
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.currentTarget.value)}
          placeholder="What is your heart's intention?"
          maxLength={200}
          class="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <div class="text-xs text-gray-500 mt-1">
          {intention.length}/200 characters
        </div>
      </div>

      {/* Content Field */}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Message Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          placeholder="Share your sacred transmission..."
          rows={4}
          maxLength={1000}
          class="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <div class="text-xs text-gray-500 mt-1">
          {content.length}/1000 characters
        </div>
      </div>

      {/* Sacred Send Button */}
      <button
        onClick={handleSend}
        disabled={isSending || !content.trim() || !intention.trim()}
        class={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          isSending || !content.trim() || !intention.trim()
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        {isSending ? (
          <span class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Transmitting...
          </span>
        ) : (
          "Send Sacred Message"
        )}
      </button>

      {/* Sacred Geometry Animation */}
      <style>{`
        @keyframes ripple {
          to {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }
        
        .sacred-composer {
          position: relative;
          overflow: hidden;
        }
        
        .sacred-composer::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(147, 51, 234, 0.1),
            transparent
          );
          animation: rotate 30s linear infinite;
          pointer-events: none;
        }
        
        @keyframes rotate {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}