import React, { useState, useRef, useEffect } from 'react';
import { GameState, Currency, LanguageCode } from '../types';
import { getFinancialAdvice, analyzeReceipt, searchFinancialNews } from '../services/geminiService';

interface Props {
  state: GameState;
  currency: Currency;
  lang: LanguageCode;
}

const QUICK_ACTIONS = [
    { label: "📊 Analysis", prompt: "Analyze my finances. What is the single best move I can make right now?" },
    { label: "💳 Debt Plan", prompt: "I have debt. Create a mathematically optimal payoff strategy for me." },
    { label: "🚀 Career", prompt: "How do I get promoted to the next job level? What skills do I need?" },
    { label: "📈 Invest", prompt: "I have extra cash. What asset class should I buy and why?" },
];

const MessageBubble = ({ text, role }: { text: string, role: 'user' | 'ai' }) => {
  // Simple bold parser: **text** -> <b>text</b>
  const parseText = (raw: string) => {
    const parts = raw.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-emerald-300 font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start animate-fade-in'}`}>
        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
            role === 'user' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
        }`}>
            {parseText(text)}
        </div>
    </div>
  );
};

export const Advisor: React.FC<Props> = ({ state, currency, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [mode, setMode] = useState<'CHAT' | 'SCAN' | 'NEWS'>('CHAT');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "👋 Hi! I'm your Wealth Coach. I can analyze your game stats in real-time. What's on your mind?" }
  ]);
  const [loading, setLoading] = useState(false);
  
  // News State
  const [newsQuery, setNewsQuery] = useState('Stock Market Trends');
  const [newsResult, setNewsResult] = useState<{text: string, sources: any[]} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  // Proactive Tip on First Open
  useEffect(() => {
    if (isOpen && !hasOpenedOnce && messages.length === 1) {
        setHasOpenedOnce(true);
        const fetchInitialTip = async () => {
            setLoading(true);
            // Artificial delay for realism
            await new Promise(r => setTimeout(r, 600));
            const tip = await getFinancialAdvice("Review my current situation and give me one short, high-impact tip to start.", state, currency, lang);
            setMessages(prev => [...prev, { role: 'ai', text: tip }]);
            setLoading(false);
        };
        fetchInitialTip();
    }
  }, [isOpen, hasOpenedOnce, messages.length, state, currency, lang]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Pass full state object to service
    const response = await getFinancialAdvice(userMsg, state, currency, lang);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeReceipt(base64String);
        setLoading(false);
        if (result && result.total) {
             // Basic naive conversion for receipt logging
             const convertedTotal = (result.total * currency.rate).toFixed(0);
             setMessages(prev => [...prev, { role: 'ai', text: `🧾 **Receipt Analyzed**\nCategory: ${result.category}\nTotal: **${currency.symbol}${convertedTotal}**\n\n(Note: In a full game loop, this would automatically be deducted from your cash!)` }]);
        } else {
             setMessages(prev => [...prev, { role: 'ai', text: `Couldn't read that receipt clearly. Try another image!` }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
      setLoading(true);
      const res = await searchFinancialNews(newsQuery, lang);
      setNewsResult(res);
      setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 text-white border-2 border-white/20 group"
      >
        <span className="sr-only">Open Advisor</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={() => setIsOpen(false)} />
      
      <div className="pointer-events-auto bg-slate-900 w-full max-w-lg h-[85vh] sm:h-[700px] sm:rounded-2xl shadow-2xl flex flex-col border border-slate-700 overflow-hidden transform transition-all animate-slide-up">
        {/* Header */}
        <div className="bg-slate-800/90 backdrop-blur p-4 flex justify-between items-center border-b border-slate-700 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
                <h3 className="font-bold text-white text-sm">Wealth Coach AI</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Online & Thinking</span>
                </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-950 p-1.5 gap-1 border-b border-slate-800 shrink-0">
            <button onClick={() => setMode('CHAT')} className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'CHAT' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900'}`}>
                <span>💬</span> Chat
            </button>
            <button onClick={() => setMode('SCAN')} className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'SCAN' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900'}`}>
                <span>📸</span> Scan
            </button>
            <button onClick={() => setMode('NEWS')} className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'NEWS' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-900'}`}>
                <span>📰</span> News
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50 custom-scrollbar scroll-smooth relative">
            {mode === 'CHAT' && (
                <div className="space-y-6 pb-4">
                    {messages.map((m, i) => (
                        <MessageBubble key={i} text={m.text} role={m.role} />
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                                <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {mode === 'SCAN' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-6 animate-fade-in">
                    <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-700 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/10 scale-0 group-hover:scale-100 transition-transform rounded-3xl"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2 text-lg">Expense Scanner</h4>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto">Upload a photo of a receipt. The AI will extract the total and category to update your budget.</p>
                    </div>
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all w-full shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5">
                        <span className="flex items-center justify-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                             Upload Receipt
                        </span>
                        <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden"/>
                    </label>
                    {loading && <p className="text-xs text-blue-400 animate-pulse font-mono">Analyzing image pixels...</p>}
                </div>
            )}

            {mode === 'NEWS' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex gap-2">
                        <input 
                            value={newsQuery} 
                            onChange={e => setNewsQuery(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-slate-800 border-slate-700 rounded-xl px-4 py-3 w-full text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500" 
                            placeholder="Topic (e.g. 'Crypto Regulation')"
                        />
                        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 px-5 rounded-xl text-white font-bold shadow-lg transition-colors flex items-center">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Go'}
                        </button>
                    </div>
                    {newsResult ? (
                        <div className="bg-slate-800 p-5 rounded-xl text-sm text-slate-300 border border-slate-700 shadow-sm">
                            <h4 className="text-xs uppercase font-bold text-blue-400 mb-3 tracking-wider">Market Intelligence</h4>
                            <p className="whitespace-pre-line mb-4 leading-relaxed">{newsResult.text}</p>
                            <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
                                <span className="font-bold mb-2 block text-slate-400">Verified Sources:</span>
                                {newsResult.sources.map((c: any, i: number) => (
                                    <a key={i} href={c.web?.uri} target="_blank" rel="noreferrer" className="block text-slate-400 hover:text-blue-400 transition-colors truncate mt-1.5 flex items-center gap-2 p-1 hover:bg-slate-700/50 rounded">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                        {c.web?.title || c.web?.uri}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
                             <span className="text-4xl mb-2 opacity-30">🌐</span>
                             <p className="text-sm">Search the real web for financial news.<br/>Powered by Google Search Grounding.</p>
                         </div>
                    )}
                </div>
            )}
        </div>

        {/* Quick Actions (Chat Only) */}
        {mode === 'CHAT' && !loading && (
            <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 overflow-x-auto no-scrollbar">
                 <div className="flex gap-2">
                     {QUICK_ACTIONS.map((action, i) => (
                         <button 
                            key={i}
                            onClick={() => handleSend(action.prompt)}
                            className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-semibold text-slate-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
                         >
                            {action.label}
                         </button>
                     ))}
                 </div>
            </div>
        )}

        {/* Input Area (Chat only) */}
        {mode === 'CHAT' && (
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask your coach anything..."
                    disabled={loading}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 placeholder:text-slate-600"
                />
                <button 
                    onClick={() => handleSend()} 
                    disabled={loading || !input.trim()} 
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:shadow-none aspect-square flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};