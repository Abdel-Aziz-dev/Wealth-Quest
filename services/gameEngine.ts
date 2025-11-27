import { GameState, LogEntry, Asset, Currency, LanguageCode } from '../types';
import { JOBS, EVENTS } from '../constants';
import { t, tEntity } from './i18n';

// Cache formatters to avoid expensive instantiation on every render
const formatterCache = new Map<string, Intl.NumberFormat>();

export const formatCurrency = (val: number, currency: Currency) => {
    // Convert base value (USD) to target currency
    // Use || 0 to prevent NaN/undefined propagation
    const converted = (val || 0) * currency.rate;
    
    // Create distinct cache key based on currency properties
    const key = `${currency.locale}-${currency.code}-${currency.decimals}`;
    
    let formatter = formatterCache.get(key);
    if (!formatter) {
        formatter = new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: currency.decimals,
            maximumFractionDigits: currency.decimals,
        });
        formatterCache.set(key, formatter);
    }
    
    return formatter.format(converted);
};

export const formatCompactCurrency = (val: number, currency: Currency) => {
    const converted = (val || 0) * currency.rate;
    // Cache key for compact notation
    const key = `compact-${currency.locale}-${currency.code}`;
    
    let formatter = formatterCache.get(key);
    if (!formatter) {
        formatter = new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            notation: 'compact',
            maximumFractionDigits: 1
        });
        formatterCache.set(key, formatter);
    }
    
    return formatter.format(converted);
};

// Fallback for when currency isn't strictly passed, though we aim to pass it everywhere
const defaultCurrency: Currency = { code: 'USD', symbol: '$', rate: 1, locale: 'en-US', decimals: 0 };
export const formatMoney = (val: number) => formatCurrency(val, defaultCurrency);

const LOG_MAX = 50;

const addLog = (logs: LogEntry[], message: string, type: LogEntry['type'], month: number, amount?: number): LogEntry[] => {
  const newLog: LogEntry = {
    id: Math.random().toString(36).substr(2, 9),
    month,
    message,
    type,
    amount
  };
  return [newLog, ...logs].slice(0, LOG_MAX);
};

export const advanceMonth = (state: GameState, currency: Currency, lang: LanguageCode): GameState => {
  const newState = { ...state };
  const currentMonth = newState.age - 216; // Months since start

  // 1. Income
  // Calculate salary with skill multipliers
  const negotiationLevel = newState.skills['negotiation'] || 0;
  const salaryMultiplier = 1 + (negotiationLevel * 0.05);
  const monthlySalary = (newState.income.job.baseSalary * salaryMultiplier) / 12;
  const sideHustle = newState.income.sideHustle;
  const totalIncome = monthlySalary + sideHustle;

  // 2. Assets (Growth & Dividends)
  let investmentGrowth = 0;
  newState.assets = newState.assets.map(asset => {
    // Randomized monthly return based on volatility and annual growth
    const monthlyRate = asset.growthRate / 12;
    const volatilityFactor = (Math.random() - 0.5) * 2 * asset.volatility; 
    const actualChange = monthlyRate + (volatilityFactor * 0.1); // 0.1 factor to dampen massive monthly swings
    
    const newValue = asset.value * (1 + actualChange);
    // Simple dividend logic
    if (asset.quantity > 0) {
      investmentGrowth += (asset.value * asset.quantity) * actualChange;
    }
    return { ...asset, value: newValue };
  });

  // 3. Debts (Interest & Min Payments)
  let totalDebtPayments = 0;
  const paymentDetails: string[] = []; // Track logs for this month

  newState.debts = newState.debts.map(debt => {
      if (debt.principal <= 0) return debt;

      const monthlyInterestRate = debt.interestRate / 12;
      const interestAccrued = debt.principal * monthlyInterestRate;
      
      // COMPOUNDING STEP:
      // Interest is added to the principal *before* the payment is deducted.
      // This ensures negative amortization if payment < interest.
      let currentBalance = debt.principal + interestAccrued;
      
      // Dynamic Minimum Payment (e.g. 2.5% of original principal or strict min)
      const dynamicMinPayment = Math.max(debt.minPayment, debt.principal * 0.025);
      
      let payment = dynamicMinPayment;
      
      // Cap payment if remaining debt is small
      if (currentBalance < payment) {
          payment = currentBalance;
      }

      // Deduct payment from the compounded balance
      currentBalance -= payment;
      totalDebtPayments += payment;
      
      const debtName = tEntity(lang, 'loans', debt.id, 'name') || debt.name;

      if (payment > 0) {
          paymentDetails.push(`${debtName}: ${formatCurrency(payment, currency)}`);
      }

      // Check for Payoff
      if (currentBalance < 0.01) {
          currentBalance = 0;
          // Log specific payoff event immediately
          const msg = t(lang, 'logs.paidOffAuto', { debt: debtName });
          newState.history.logs = addLog(newState.history.logs, msg, 'INFO', currentMonth, -payment);
      }
      
      return { ...debt, principal: Math.max(0, currentBalance) };
  });

  // Log aggregated debt payments if any occured (and weren't just payoffs)
  if (paymentDetails.length > 0 && totalDebtPayments > 0) {
      // Create a summary string: "Debt Auto-Pay: Loan A ($50), Loan B ($100)"
      const logMsg = t(lang, 'logs.debtPayments', { details: paymentDetails.join(', ') });
      newState.history.logs = addLog(newState.history.logs, logMsg, 'EXPENSE', currentMonth, -totalDebtPayments);
  }

  // 4. Expenses
  // Lifestyle creep check
  const budgetSkill = newState.skills['budgeting'] || 0;
  const creepFactor = Math.max(0, 1 - (budgetSkill * 0.1));
  // Expenses rise slightly with net worth (Simulated inflation/creep)
  const wealthCreep = (Math.max(0, newState.netWorth) * 0.0005) * creepFactor;
  
  const totalExpenses = newState.expenses.living + newState.expenses.lifestyle + wealthCreep + totalDebtPayments;

  // 5. Net Flow
  const netFlow = totalIncome - totalExpenses;
  newState.cash += netFlow;
  
  // 6. XP & Happiness
  const savingsRate = (totalIncome - totalExpenses) / totalIncome;
  let xpGain = 10;
  if (savingsRate > 0.2) xpGain += 50; // Good saver bonus
  if (savingsRate > 0.5) xpGain += 100; // FIRE bonus
  
  if (newState.cash < 0) {
    newState.happiness = Math.max(0, newState.happiness - 10);
    // Only add overdraft log if it's a new occurrence or significant
    if (newState.history.logs[0].message.indexOf('Overdraft') === -1) {
       addLog(newState.history.logs, t(lang, 'logs.overdraft'), "INFO", currentMonth);
    }
  } else {
    newState.happiness = Math.min(100, newState.happiness + 1);
  }
  newState.financialIQ += xpGain;

  // 7. Random Events
  if (Math.random() < 0.15) { // 15% chance
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    if (Math.random() < event.probability * 5) { // Weighting check
        if (event.cost) {
            newState.cash -= event.cost;
            addLog(newState.history.logs, event.title, "EXPENSE", currentMonth, -event.cost);
            // Note: Event descriptions from constants are currently hardcoded English. 
            // Ideally we'd map event IDs to translations too.
            newState.history.logs[0].message = `${event.title}: ${event.description}`;
        } else if (event.bonus) {
            newState.cash += event.bonus;
            addLog(newState.history.logs, event.title, "EARNING", currentMonth, event.bonus);
            newState.history.logs[0].message = `${event.title}: ${event.description}`;
        }
    }
  }

  // 8. Update Net Worth History
  const assetsValue = newState.assets.reduce((acc, a) => acc + (a.value * a.quantity), 0);
  const debtsValue = newState.debts.reduce((acc, d) => acc + d.principal, 0);
  newState.netWorth = newState.cash + assetsValue - debtsValue;
  
  newState.history.netWorth.push({ month: currentMonth + 1, value: newState.netWorth });
  
  // Log monthly summary
  if (currentMonth % 12 === 0 && currentMonth > 0) {
      const year = Math.floor(newState.age/12) - 18;
      const msg = t(lang, 'logs.yearComplete', { year, nw: formatCurrency(newState.netWorth, currency) });
      newState.history.logs = addLog(newState.history.logs, msg, 'INFO', currentMonth);
  }

  newState.age += 1;
  return newState;
};

export const buyAsset = (state: GameState, assetId: string, amountCash: number, currency: Currency, lang: LanguageCode): GameState => {
    const newState = { ...state };
    const assetIndex = newState.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1 || newState.cash < amountCash) return state;

    const asset = newState.assets[assetIndex];
    const assetName = tEntity(lang, 'assets', asset.id, undefined) || asset.name;

    const units = amountCash / asset.value;
    
    newState.cash -= amountCash;
    newState.assets[assetIndex].quantity += units;
    
    // Recalc net worth (asset swap cash for equity, usually minimal change unless transaction fee)
    // But for safety:
    const assetsValue = newState.assets.reduce((acc, a) => acc + (a.value * a.quantity), 0);
    const debtsValue = newState.debts.reduce((acc, d) => acc + d.principal, 0);
    newState.netWorth = newState.cash + assetsValue - debtsValue;

    const msg = t(lang, 'logs.bought', { asset: assetName });
    newState.history.logs = addLog(newState.history.logs, msg, 'INFO', newState.age - 216, -amountCash);
    return newState;
};

export const promoteJob = (state: GameState, jobIndex: number, lang: LanguageCode): GameState => {
    const newState = { ...state };
    const targetJob = JOBS[jobIndex];
    if (newState.financialIQ >= targetJob.reqSkillLevel) {
        newState.income.job = targetJob;
        const jobTitle = tEntity(lang, 'jobs', targetJob.id, 'title');
        const msg = t(lang, 'logs.promoted', { job: jobTitle });
        newState.history.logs = addLog(newState.history.logs, msg, 'EARNING', newState.age - 216);
    }
    return newState;
};

export const repayDebt = (state: GameState, debtId: string, amount: number, currency: Currency, lang: LanguageCode): GameState => {
    const newState = { ...state };
    const debtIndex = newState.debts.findIndex(d => d.id === debtId);
    
    // Check if debt exists and if user has enough cash (allow paying full principal even if amount passed is higher)
    if (debtIndex === -1) return state;
    
    const debt = newState.debts[debtIndex];
    const debtName = tEntity(lang, 'loans', debt.id, 'name') || debt.name;

    if (debt.principal <= 0) return state;

    // Determine actual payment amount (min of: requested amount, available cash, remaining principal)
    const paymentAmount = Math.min(amount, newState.cash, debt.principal);
    
    if (paymentAmount <= 0) return state; // No money to pay or debt paid off

    newState.cash -= paymentAmount;
    newState.debts[debtIndex].principal -= paymentAmount;
    
    // Floating point fix and Paid Off Check
    if (newState.debts[debtIndex].principal < 0.01) {
        newState.debts[debtIndex].principal = 0;
        const msg = t(lang, 'logs.paidOff', { debt: debtName });
        newState.history.logs = addLog(newState.history.logs, msg, 'INFO', newState.age - 216, -paymentAmount);
    } else {
        const msg = t(lang, 'logs.extraPay', { debt: debtName, amt: formatCurrency(paymentAmount, currency) });
        newState.history.logs = addLog(newState.history.logs, msg, 'EXPENSE', newState.age - 216, -paymentAmount);
    }

    // Recalculate Net Worth
    const assetsValue = newState.assets.reduce((acc, a) => acc + (a.value * a.quantity), 0);
    const debtsValue = newState.debts.reduce((acc, d) => acc + d.principal, 0);
    newState.netWorth = newState.cash + assetsValue - debtsValue;

    return newState;
};

export const takeLoan = (state: GameState, loanId: string, name: string, amount: number, interestRate: number, currency: Currency, lang: LanguageCode): GameState => {
    const newState = { ...state };
    const existingDebtIndex = newState.debts.findIndex(d => d.id === loanId);

    // Look up localized name if possible
    const localizedName = tEntity(lang, 'loans', loanId, 'name') || name;

    if (existingDebtIndex >= 0) {
        // Add to existing debt (e.g. credit card balance)
        newState.debts[existingDebtIndex].principal += amount;
    } else {
        // Create new debt
        newState.debts.push({
            id: loanId,
            name: name, // Internal name stays original, but logs use localized
            principal: amount,
            interestRate: interestRate,
            minPayment: 0 // Will be calculated dynamically in advanceMonth
        });
    }

    newState.cash += amount;
    // Log format: Action (Borrowed), Loan Name, Amount
    const msg = t(lang, 'logs.borrowed', { debt: localizedName, amt: formatCurrency(amount, currency) });
    newState.history.logs = addLog(newState.history.logs, msg, 'EARNING', newState.age - 216, amount);

    // Recalculate Net Worth (Should be neutral: Cash increases, Debt increases)
    const assetsValue = newState.assets.reduce((acc, a) => acc + (a.value * a.quantity), 0);
    const debtsValue = newState.debts.reduce((acc, d) => acc + d.principal, 0);
    newState.netWorth = newState.cash + assetsValue - debtsValue;

    return newState;
};