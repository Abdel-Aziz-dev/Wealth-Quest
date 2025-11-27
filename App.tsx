import React, { useState, useEffect } from 'react';
import { GameState, INITIAL_STATE, Currency, Language } from './types';
import { advanceMonth, buyAsset, promoteJob, repayDebt, takeLoan, formatCurrency } from './services/gameEngine';
import { CURRENCIES, LANGUAGES } from './constants';
import { Dashboard } from './components/Dashboard';
import { Actions } from './components/Actions';
import { Advisor } from './components/Advisor';
import { Tutorial } from './components/Tutorial';
import { t } from './services/i18n';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showLog, setShowLog] = useState(false);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default USD
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]); // Default EN
  
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Auto-start tutorial if not completed
  useEffect(() => {
    if (!gameState.tutorialCompleted) {
       // Small delay for initial render
       setTimeout(() => setShowTutorial(true), 500);
    }
  }, []);

  const handleAdvance = () => {
    // Pass currency so logs are generated in the correct currency
    const nextState = advanceMonth(gameState, currency, language.code);
    setGameState(nextState);
  };

  const handleBuyAsset = (id: string, amount: number) => {
    setGameState(prev => buyAsset(prev, id, amount, currency, language.code));
  };

  const handlePromote = (idx: number) => {
      setGameState(prev => promoteJob(prev, idx, language.code));
  };
  
  const handleRepayDebt = (id: string, amount: number) => {
      setGameState(prev => repayDebt(prev, id, amount, currency, language.code));
  };

  const handleTakeLoan = (id: string, name: string, amount: number, rate: number) => {
      setGameState(prev => takeLoan(prev, id, name, amount, rate, currency, language.code));
  };

  const handleTrainSkill = (id: string) => {
      setGameState(prev => {
          const cost = 500; // Simplified static cost for now or lookup from constants
          if (prev.financialIQ >= cost) {
             return {
                 ...prev,
                 financialIQ: prev.financialIQ - cost,
                 skills: { ...prev.skills, [id]: (prev.skills[id] || 0) + 1 }
             }
          }
          return prev;
      });
  };

  const completeTutorial = () => {
      setShowTutorial(false);
      setGameState(prev => {
          // If already completed, just close (re-playing tutorial)
          if (prev.tutorialCompleted) return prev;

          // Reward logic: $500 Bonus
          const bonus = 500;
          // Simple log entry manually added here
          const newLog = {
              id: 'tut-bonus',
              month: prev.age - 216,
              message: t(language.code, 'tutorial.finish_desc'), // Reuse description as log message or create new key
              type: 'EARNING' as const,
              amount: bonus
          };
          
          return {
              ...prev,
              tutorialCompleted: true,
              cash: prev.cash + bonus,
              history: {
                  ...prev.history,
                  logs: [newLog, ...prev.history.logs]
              }
          };
      });
  };

  return (
    <div className="min-h-screen bg-game-bg text-slate-200 font-sans pb-20 md:pb-0">
      {/* Top Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-900/50">W</div>
                <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">{t(language.code, 'app.title')}</h1>
                
                {/* Language Selector */}
                <div className="relative ml-2 sm:ml-4 z-50">
                   <button 
                    id="tutorial-lang-btn"
                    onClick={() => {
                        setIsLangOpen(!isLangOpen);
                        setIsCurrencyOpen(false);
                    }}
                    className={`flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border transition-all text-sm font-bold text-slate-300 hover:text-white shadow-sm hover:shadow-md ${isLangOpen ? 'border-blue-500/50 ring-2 ring-blue-500/20 text-white' : 'border-slate-700'}`}
                   >
                       <span>{language.flag}</span>
                       <span className="hidden sm:inline">{language.code.toUpperCase()}</span>
                       <svg className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                   </button>
                   
                   {isLangOpen && (
                      <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                          <div className="absolute top-full left-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in origin-top-left">
                              {LANGUAGES.map(l => (
                                  <button 
                                    key={l.code}
                                    onClick={() => {
                                        setLanguage(l);
                                        setIsLangOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-700 transition-colors flex justify-between items-center group/item ${language.code === l.code ? 'bg-slate-700/50 text-blue-400' : 'text-slate-400'}`}
                                  >
                                      <span className="group-hover/item:text-white transition-colors">{l.name}</span>
                                      <span className="text-lg">{l.flag}</span>
                                  </button>
                              ))}
                          </div>
                      </>
                   )}
                </div>

                {/* Currency Selector */}
                <div className="relative z-50">
                  <button 
                    id="tutorial-currency-btn"
                    onClick={() => {
                        setIsCurrencyOpen(!isCurrencyOpen);
                        setIsLangOpen(false);
                    }}
                    className={`flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border transition-all text-sm font-bold text-slate-300 hover:text-white shadow-sm hover:shadow-md ${isCurrencyOpen ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 text-white' : 'border-slate-700'}`}
                  >
                     <span className="text-emerald-400">{currency.symbol}</span>
                     <span className="hidden sm:inline">{currency.code}</span>
                     <svg className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {isCurrencyOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in origin-top-left">
                          {CURRENCIES.map(c => (
                              <button 
                                key={c.code}
                                onClick={() => {
                                    setCurrency(c);
                                    setIsCurrencyOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-700 transition-colors flex justify-between items-center group/item ${currency.code === c.code ? 'bg-slate-700/50 text-emerald-400' : 'text-slate-400'}`}
                              >
                                  <span className="group-hover/item:text-white transition-colors">{c.code}</span>
                                  <span className="text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded text-xs">{c.symbol}</span>
                              </button>
                          ))}
                        </div>
                      </>
                  )}
                </div>
                
                {/* Help/Tutorial Button */}
                <button 
                    onClick={() => setShowTutorial(true)}
                    className="ml-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center transition-all"
                    title="Start Tutorial"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            <button onClick={() => setShowLog(!showLog)} className="md:hidden text-slate-400">
                {t(language.code, 'app.logs')}
            </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dashboard (Takes full width on mobile, 2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
            <Dashboard state={gameState} onAdvance={handleAdvance} currency={currency} lang={language.code} />
            
            {/* Log Feed (Visible on Desktop) */}
            <div className="hidden md:block bg-game-card p-4 rounded-xl border border-slate-700 h-64 overflow-y-auto custom-scrollbar">
                <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 sticky top-0 bg-game-card pb-2">{t(language.code, 'app.logs')}</h3>
                <div className="space-y-2">
                    {gameState.history.logs.map(log => (
                        <div key={log.id} className="text-sm flex gap-2">
                            <span className="text-slate-500 font-mono text-xs">M{log.month}</span>
                            <span className={
                                log.type === 'EARNING' ? 'text-emerald-400' :
                                log.type === 'EXPENSE' ? 'text-red-400' :
                                'text-slate-300'
                            }>{log.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto">
            <Actions 
                state={gameState} 
                onBuyAsset={handleBuyAsset}
                onPromote={handlePromote}
                onTrainSkill={handleTrainSkill}
                onRepayDebt={handleRepayDebt}
                onTakeLoan={handleTakeLoan}
                currency={currency}
                lang={language.code}
            />
        </div>
      </main>

      <Advisor state={gameState} currency={currency} lang={language.code} />

      {/* Tutorial Overlay */}
      {showTutorial && (
          <Tutorial 
            lang={language.code} 
            onComplete={completeTutorial} 
            onClose={() => setShowTutorial(false)} 
          />
      )}

      {/* Mobile Log Drawer */}
      {showLog && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden flex flex-col pt-20 px-4">
             <div className="bg-slate-900 rounded-t-xl flex-1 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white">{t(language.code, 'app.logs')}</h3>
                    <button onClick={() => setShowLog(false)} className="text-slate-400">{t(language.code, 'app.close')}</button>
                </div>
                {gameState.history.logs.map(log => (
                    <div key={log.id} className="py-2 border-b border-slate-800 text-sm">
                        <span className="text-xs text-slate-500 mr-2">M{log.month}</span>
                        <span className="text-slate-200">{log.message}</span>
                    </div>
                ))}
             </div>
        </div>
      )}
    </div>
  );
};

export default App;