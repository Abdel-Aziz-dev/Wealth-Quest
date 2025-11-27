import React from 'react';
import { GameState, Currency, LanguageCode } from '../types';
import { WealthChart } from './WealthChart';
import { formatCurrency } from '../services/gameEngine';
import { t } from '../services/i18n';

interface Props {
  state: GameState;
  onAdvance: () => void;
  currency: Currency;
  lang: LanguageCode;
}

export const Dashboard: React.FC<Props> = ({ state, onAdvance, currency, lang }) => {
  const currentMonth = state.age - 216;
  const years = Math.floor(state.age / 12);
  const months = state.age % 12;

  const totalDebt = state.debts.reduce((acc, d) => acc + d.principal, 0);
  const totalMinPayments = state.debts.reduce((acc, d) => d.principal > 0 ? acc + d.minPayment : acc, 0);

  // Calculate projected monthly cashflow
  const salary = (state.income.job.baseSalary / 12);
  const totalExp = state.expenses.living + state.expenses.lifestyle + totalMinPayments;
  const cashflow = salary + state.income.sideHustle - totalExp;

  const fmt = (val: number) => formatCurrency(val, currency);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div id="tutorial-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-game-card p-4 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{t(lang, 'app.netWorth')}</p>
          <p className={`text-2xl font-bold ${state.netWorth < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {fmt(state.netWorth)}
          </p>
        </div>
        <div className="bg-game-card p-4 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{t(lang, 'app.cash')}</p>
          <p className={`text-2xl font-bold ${state.cash < 0 ? 'text-red-500' : 'text-white'}`}>
            {fmt(state.cash)}
          </p>
        </div>
        <div className="bg-game-card p-4 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{t(lang, 'app.debt')}</p>
          <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-400' : 'text-slate-500'}`}>
             {totalDebt > 0 ? '-' : ''}{fmt(totalDebt)}
          </p>
        </div>
        <div className="bg-game-card p-4 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{t(lang, 'app.iq')}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-violet-400">{state.financialIQ}</span>
            <span className="text-xs text-slate-500">XP</span>
          </div>
        </div>
      </div>

      {/* Main Graph - Replaced with enhanced WealthChart */}
      <div id="tutorial-chart">
        <WealthChart history={state.history.netWorth} currency={currency} lang={lang} />
      </div>

      {/* Cashflow & Next Turn */}
      <div className="flex flex-col md:flex-row gap-6">
        <div id="tutorial-cashflow" className="flex-1 bg-game-card p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-300 font-semibold mb-4">{t(lang, 'dashboard.monthlyCashflow')}</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{t(lang, 'dashboard.income')}</span>
                    <span className="text-emerald-400 font-mono">+{fmt(salary + state.income.sideHustle)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{t(lang, 'dashboard.expenses')}</span>
                    <span className="text-slate-400 font-mono">-{fmt(state.expenses.living + state.expenses.lifestyle)}</span>
                </div>
                {totalMinPayments > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-red-400">{t(lang, 'dashboard.debtPayments')}</span>
                        <span className="text-red-400 font-mono">-{fmt(totalMinPayments)}</span>
                    </div>
                )}
                <div className="h-px bg-slate-700 my-2"></div>
                <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-200">{t(lang, 'dashboard.net')}</span>
                    <span className={`font-mono ${cashflow > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                        {cashflow > 0 ? '+' : ''}{fmt(cashflow)}
                    </span>
                </div>
            </div>
        </div>

        <button 
            id="tutorial-next-btn"
            onClick={onAdvance}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-bold text-xl rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center py-6 md:py-0 group"
        >
            <div className="flex flex-col items-center">
                <span>{t(lang, 'dashboard.nextMonth')} &rarr;</span>
                <span className="text-xs font-normal opacity-70 group-hover:opacity-100">{t(lang, 'dashboard.age', {years, months})}</span>
            </div>
        </button>
      </div>
    </div>
  );
};