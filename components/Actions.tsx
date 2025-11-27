import React, { useState, useMemo } from 'react';
import { GameState, Asset, Job, Skill, Debt, Currency, LanguageCode } from '../types';
import { JOBS, SKILL_TREE, LOAN_OPTIONS } from '../constants';
import { formatCurrency } from '../services/gameEngine';
import { t, tEntity } from '../services/i18n';

interface Props {
  state: GameState;
  onBuyAsset: (id: string, amount: number) => void;
  onPromote: (idx: number) => void;
  onTrainSkill: (id: string) => void;
  onRepayDebt: (id: string, amount: number) => void;
  onTakeLoan: (id: string, name: string, amount: number, rate: number) => void;
  currency: Currency;
  lang: LanguageCode;
}

export const Actions: React.FC<Props> = ({ state, onBuyAsset, onPromote, onTrainSkill, onRepayDebt, onTakeLoan, currency, lang }) => {
  const [activeTab, setActiveTab] = useState<'INVEST' | 'CAREER' | 'SKILLS' | 'DEBT'>('CAREER');
  const [debtView, setDebtView] = useState<'PAY' | 'BORROW'>('PAY');
  const [debtStrategy, setDebtStrategy] = useState<'AVALANCHE' | 'SNOWBALL'>('AVALANCHE');

  const fmt = (val: number) => formatCurrency(val, currency);

  const Money = ({ val }: { val: number }) => <span className="font-mono">{fmt(val)}</span>;

  // SMART ROUNDING HELPER
  // Calculates clean amounts for buttons (e.g. 10,000 Yen instead of 15,234 Yen)
  // Returns { display: "¥10,000", valueUSD: 66.66 }
  const getSmartAmount = useMemo(() => {
      return (baseUSD: number) => {
          const raw = baseUSD * currency.rate;
          
          // Logic: Find order of magnitude, then snap to nearest 1, 2, 5, 10
          const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
          const sig = raw / magnitude; // significant digit
          
          let snapped = 1;
          if (sig >= 8.5) snapped = 10;
          else if (sig >= 3.5) snapped = 5;
          else if (sig >= 1.5) snapped = 2; 
          else snapped = 1;
          
          const cleanAmount = snapped * magnitude;
          
          // Re-calculate the exact USD value needed to achieve this clean local amount
          const usdValue = cleanAmount / currency.rate;
          
          return {
              display: new Intl.NumberFormat(currency.locale, { 
                  style: 'currency', 
                  currency: currency.code, 
                  maximumFractionDigits: 0 
              }).format(cleanAmount),
              usdValue: usdValue,
              rawLocal: cleanAmount
          };
      }
  }, [currency]);

  // Pre-calculate smart values for standard buttons
  const smallPay = getSmartAmount(100);
  const largePay = getSmartAmount(1000);
  
  const loanSmall = getSmartAmount(1000);
  const loanLarge = getSmartAmount(5000);

  // Sort debts based on strategy
  const sortedDebts = [...state.debts].sort((a, b) => {
      // Always put paid off debts at the bottom
      if (a.principal <= 0 && b.principal > 0) return 1;
      if (b.principal <= 0 && a.principal > 0) return -1;
      // If both paid off, order doesn't matter much, but keep stable
      if (a.principal <= 0 && b.principal <= 0) return 0;

      if (debtStrategy === 'AVALANCHE') {
          // Highest interest rate first
          if (b.interestRate !== a.interestRate) {
              return b.interestRate - a.interestRate;
          }
          // Tie-break: lowest principal (psychological win)
          return a.principal - b.principal;
      } else {
          // Lowest principal first
          if (a.principal !== b.principal) {
              return a.principal - b.principal;
          }
          // Tie-break: highest interest rate
          return b.interestRate - a.interestRate;
      }
  });

  const totalDebt = state.debts.reduce((acc, d) => acc + d.principal, 0);
  const totalMonthlyPayment = state.debts.reduce((acc, d) => d.principal > 0 ? acc + Math.max(d.minPayment, d.principal * 0.025) : acc, 0);

  return (
    <div className="bg-game-card rounded-xl border border-slate-700 shadow-lg h-full flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {(['CAREER', 'DEBT', 'INVEST', 'SKILLS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs md:text-sm font-bold tracking-wide transition-colors ${
              activeTab === tab 
                ? 'bg-slate-700 text-white border-b-2 border-emerald-500' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t(lang, `tabs.${tab.toLowerCase()}`)}
          </button>
        ))}
      </div>

      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* CAREER TAB */}
        {activeTab === 'CAREER' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="text-slate-400 text-xs uppercase mb-1">{t(lang, 'actions.currentJob')}</h4>
                <div className="flex justify-between items-end">
                    <span className="text-xl font-bold text-white">
                        {tEntity(lang, 'jobs', state.income.job.id, 'title')}
                    </span>
                    <span className="text-emerald-400 font-mono"><Money val={state.income.job.baseSalary}/>/yr</span>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-slate-400 text-xs uppercase">{t(lang, 'actions.careerPath')}</h4>
                {JOBS.map((job, idx) => {
                    const isCurrent = job.id === state.income.job.id;
                    const canUnlock = state.financialIQ >= job.reqSkillLevel;
                    const currentIdx = JOBS.findIndex(j => j.id === state.income.job.id);
                    const isNext = idx === currentIdx + 1;
                    const jobTitle = tEntity(lang, 'jobs', job.id, 'title');

                    if (idx <= currentIdx && !isCurrent) return null; 

                    return (
                        <div key={job.id} className={`p-4 rounded-lg border flex justify-between items-center ${isCurrent ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700 bg-slate-800'}`}>
                            <div>
                                <div className="font-bold text-white">{jobTitle}</div>
                                <div className="text-xs text-slate-400">{t(lang, 'actions.reqIq')}: {job.reqSkillLevel}</div>
                            </div>
                            {isCurrent ? (
                                <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded">{t(lang, 'actions.active')}</span>
                            ) : (
                                <button 
                                    disabled={!isNext || !canUnlock}
                                    onClick={() => onPromote(idx)}
                                    className={`px-3 py-1.5 rounded text-sm font-bold ${
                                        isNext && canUnlock 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    }`}
                                >
                                    {isNext ? (!canUnlock ? t(lang, 'actions.locked') : t(lang, 'actions.promote')) : t(lang, 'actions.future')}
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
          </div>
        )}

        {/* DEBT TAB */}
        {activeTab === 'DEBT' && (
            <div className="space-y-4">
                <div className="flex bg-slate-800 p-1 rounded-lg mb-4">
                    <button onClick={() => setDebtView('PAY')} className={`flex-1 text-xs font-bold py-2 rounded ${debtView === 'PAY' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>{t(lang, 'actions.managePay')}</button>
                    <button onClick={() => setDebtView('BORROW')} className={`flex-1 text-xs font-bold py-2 rounded ${debtView === 'BORROW' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>{t(lang, 'actions.borrowCash')}</button>
                </div>

                {debtView === 'PAY' && (
                    <>
                        {/* Debt Summary */}
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">{t(lang, 'actions.totalPrincipal')}</p>
                                <p className="text-lg font-bold text-white">-{fmt(totalDebt)}</p>
                            </div>
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">{t(lang, 'actions.monthlyOb')}</p>
                                <p className="text-lg font-bold text-red-400">-{fmt(totalMonthlyPayment)}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center my-2">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{t(lang, 'actions.strategy')}:</span>
                            <div className="flex gap-1">
                                <button onClick={() => setDebtStrategy('AVALANCHE')} className={`text-[10px] px-2 py-1 rounded border transition-colors ${debtStrategy === 'AVALANCHE' ? 'bg-blue-900/40 border-blue-500 text-blue-300' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}>{t(lang, 'actions.avalanche')}</button>
                                <button onClick={() => setDebtStrategy('SNOWBALL')} className={`text-[10px] px-2 py-1 rounded border transition-colors ${debtStrategy === 'SNOWBALL' ? 'bg-blue-900/40 border-blue-500 text-blue-300' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}>{t(lang, 'actions.snowball')}</button>
                            </div>
                        </div>
                        
                        <div className="text-[10px] text-slate-500 bg-slate-900/50 p-2 rounded mb-2 border border-slate-800 text-center">
                            {t(lang, 'actions.debtHint').split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                        </div>

                        {sortedDebts.every(d => d.principal <= 0) ? (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-500 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                                <span className="text-4xl mb-2">🎉</span>
                                <p className="font-bold">{t(lang, 'actions.debtFree')}</p>
                                <p className="text-xs">{t(lang, 'actions.debtFreeSub')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedDebts.map((debt, index) => {
                                    if (debt.principal <= 0) return null;
                                    const isHighInterest = debt.interestRate > 0.08;
                                    const dynamicMin = Math.max(debt.minPayment, debt.principal * 0.025);
                                    const debtName = tEntity(lang, 'loans', debt.id, 'name') || debt.name;
                                    
                                    // Highlight first item as priority
                                    const isPriority = index === 0;

                                    return (
                                        <div key={debt.id} className={`relative p-4 rounded-lg border transition-all ${isPriority ? 'ring-1 ring-emerald-500/50' : ''} ${isHighInterest ? 'border-red-500/30 bg-gradient-to-br from-red-950/20 to-slate-800' : 'border-slate-700 bg-slate-800'}`}>
                                            {isPriority && (
                                                <div className="absolute -top-2 left-4 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-emerald-500">
                                                    ⭐
                                                </div>
                                            )}
                                            
                                            <div className="flex justify-between items-start mb-3 mt-1">
                                                <div>
                                                    <div className="font-bold text-white flex items-center gap-2 text-sm">
                                                        {debtName}
                                                        {isHighInterest && <span className="text-[9px] bg-red-500/80 text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">High %</span>}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1 flex gap-3">
                                                        <span className={`${isHighInterest ? 'text-red-300' : 'text-emerald-300'}`}>{(debt.interestRate * 100).toFixed(1)}% APR</span>
                                                        <span>•</span>
                                                        <span>Min: {fmt(dynamicMin)}/mo</span>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-mono text-white">-{fmt(debt.principal)}</div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2">
                                                <button 
                                                    onClick={() => onRepayDebt(debt.id, smallPay.usdValue)}
                                                    disabled={state.cash < smallPay.usdValue}
                                                    className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 py-2 rounded text-[10px] md:text-xs font-bold disabled:opacity-30 transition-colors"
                                                >
                                                    {t(lang, 'actions.extra')} {smallPay.display}
                                                </button>
                                                <button 
                                                    onClick={() => onRepayDebt(debt.id, largePay.usdValue)}
                                                    disabled={state.cash < largePay.usdValue}
                                                    className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 py-2 rounded text-[10px] md:text-xs font-bold disabled:opacity-30 transition-colors"
                                                >
                                                    {t(lang, 'actions.extra')} {largePay.display}
                                                </button>
                                                <button 
                                                    onClick={() => onRepayDebt(debt.id, Math.min(state.cash, debt.principal))}
                                                    disabled={state.cash < 1}
                                                    className="bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-500 text-white py-2 rounded text-[10px] md:text-xs font-bold disabled:opacity-30 transition-colors"
                                                >
                                                    {t(lang, 'actions.payOff')}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {debtView === 'BORROW' && (
                    <div className="space-y-4">
                        <div className="text-xs text-amber-500 bg-amber-950/30 border border-amber-900/50 p-3 rounded flex gap-2 items-start">
                             <span className="text-lg">⚠️</span>
                             <span>{t(lang, 'actions.borrowWarning')}</span>
                        </div>
                        {LOAN_OPTIONS.map(loan => {
                             // Estimate monthly payment (2.5% rule from engine)
                             const estMonthlyCost = (amount: number) => Math.floor(amount * 0.025);
                             const loanName = tEntity(lang, 'loans', loan.id, 'name') || loan.name;
                             
                             return (
                                <div key={loan.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                                    <div className="flex justify-between mb-1 items-center">
                                        <span className="font-bold text-white text-sm">{loanName}</span>
                                        <span className={`font-mono text-xs px-2 py-0.5 rounded ${loan.interestRate > 0.2 ? 'bg-red-900 text-red-300' : 'bg-slate-700 text-slate-300'}`}>{(loan.interestRate * 100).toFixed(0)}% APR</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mb-3 flex justify-between">
                                        <span>Max: {fmt(loan.maxAmount)}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => onTakeLoan(loan.id, loanName, loanSmall.usdValue, loan.interestRate)}
                                            className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 rounded text-xs font-bold flex flex-col items-center gap-0.5"
                                        >
                                            <span>{t(lang, 'actions.borrow')} {loanSmall.display}</span>
                                            <span className="text-[9px] text-slate-400 font-normal">(-{fmt(estMonthlyCost(loanSmall.usdValue))}/mo)</span>
                                        </button>
                                        <button 
                                            onClick={() => onTakeLoan(loan.id, loanName, loanLarge.usdValue, loan.interestRate)}
                                            className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 rounded text-xs font-bold flex flex-col items-center gap-0.5"
                                        >
                                            <span>{t(lang, 'actions.borrow')} {loanLarge.display}</span>
                                            <span className="text-[9px] text-slate-400 font-normal">(-{fmt(estMonthlyCost(loanLarge.usdValue))}/mo)</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {/* INVEST TAB */}
        {activeTab === 'INVEST' && (
           <div className="space-y-4">
               <div className="text-sm text-slate-400 bg-slate-800 p-3 rounded border border-slate-700">
                   <span className="text-yellow-400">{t(lang, 'actions.tip')}</span> {t(lang, 'actions.investTip')}
               </div>
               {state.assets.map(asset => {
                   const assetName = tEntity(lang, 'assets', asset.id, undefined) || asset.name;
                   return (
                   <div key={asset.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                       <div className="flex justify-between mb-2">
                           <span className="font-bold text-white">{assetName}</span>
                           <span className="text-slate-400 text-sm">{t(lang, 'actions.holdings')}: {fmt(asset.value * asset.quantity)}</span>
                       </div>
                       <div className="flex justify-between items-center mb-4 text-xs text-slate-500">
                           <span>{t(lang, 'actions.price')}: {fmt(asset.value)}</span>
                           <span>{t(lang, 'actions.risk')}: {(asset.volatility * 10).toFixed(1)}/10</span>
                       </div>
                       <div className="flex gap-2">
                           <button 
                                onClick={() => onBuyAsset(asset.id, smallPay.usdValue)}
                                disabled={state.cash < smallPay.usdValue}
                                className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-500 border border-emerald-600/50 py-2 rounded font-bold transition-all disabled:opacity-50"
                           >
                               {t(lang, 'actions.buy')} {smallPay.display}
                           </button>
                           <button 
                                onClick={() => onBuyAsset(asset.id, largePay.usdValue)}
                                disabled={state.cash < largePay.usdValue}
                                className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-500 border border-emerald-600/50 py-2 rounded font-bold transition-all disabled:opacity-50"
                           >
                               {t(lang, 'actions.buy')} {largePay.display}
                           </button>
                       </div>
                   </div>
               )})}
           </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'SKILLS' && (
            <div className="space-y-4">
                {SKILL_TREE.map(skill => {
                    const currentLevel = state.skills[skill.id] || 0;
                    const isMax = currentLevel >= skill.maxLevel;
                    const canAfford = state.financialIQ >= skill.cost;
                    
                    return (
                        <div key={skill.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-violet-300">{skill.name}</span>
                                <span className="text-xs text-slate-400">Lvl {currentLevel}/{skill.maxLevel}</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3">{skill.description}</p>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-violet-400">{skill.cost} XP</span>
                                <button
                                    disabled={isMax || !canAfford}
                                    onClick={() => onTrainSkill(skill.id)}
                                    className={`px-4 py-1.5 rounded text-sm font-bold ${
                                        isMax ? 'bg-slate-700 text-slate-500' :
                                        canAfford ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-slate-700 text-slate-500'
                                    }`}
                                >
                                    {isMax ? t(lang, 'actions.maxed') : t(lang, 'actions.learn')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};