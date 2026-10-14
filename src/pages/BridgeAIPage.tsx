import React, { useState } from 'react';
import { askBridgeAIAssistant } from '../services/api';
import { Sparkles, Send, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface BridgeAIPageProps {
  setActiveTab: (tab: string) => void;
}

export const BridgeAIPage: React.FC<BridgeAIPageProps> = ({ setActiveTab }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; links?: any[] }>>([
    {
      sender: 'ai',
      text: 'Hello! I am BridgeAI, your intelligent student assistant for living and studying in China. How can I help you today with housing, visa procedures, SIM cards, or Yiwu market navigation?',
      links: [
        { title: 'Check Housing Listings', url: 'housing' },
        { title: 'Verified Arrival Guide', url: 'guides' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "How do I register at the local police station (JW202 rule) upon arrival in Yiwu?",
    "Can international students link foreign Visa cards to WeChat Pay and Alipay?",
    "Where can I find affordable student housing near Yiwu Industrial & Commercial College?"
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await askBridgeAIAssistant(textToSend);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.reply,
          links: res.suggestedLinks
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I am currently operating in verified local mode. Please feel free to check our Guides or Smart Match feature!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Banner */}
      <div className="bg-[#000000] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-neutral-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#CB0000] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-black font-display">BridgeAI Assistant</h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300">
          Grounded in verified platform resources. Trained to guide international students on arrival, visa rules, payments, and campus life in China.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-xs h-[500px] flex flex-col justify-between">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xl p-4 rounded-2xl text-xs space-y-2 ${
                m.sender === 'user'
                  ? 'bg-[#000000] text-white rounded-br-none'
                  : 'bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-bl-none'
              }`}>
                <p className="leading-relaxed font-normal whitespace-pre-line">{m.text}</p>

                {m.links && m.links.length > 0 && (
                  <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-2">
                    {m.links.map((lnk, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTab(lnk.url)}
                        className="text-[11px] font-bold text-[#CB0000] bg-white border border-neutral-200 px-2.5 py-1 rounded-lg hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>{lnk.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 p-3 rounded-2xl text-xs text-neutral-500 font-medium animate-pulse">
                BridgeAI is searching verified guides...
              </div>
            </div>
          )}
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="pt-2 border-t border-neutral-100 space-y-2">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Suggested queries:
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BridgeAI any question about student life in China..."
            className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-[#CB0000]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Ask</span>
          </button>
        </form>

      </div>

    </div>
  );
};
