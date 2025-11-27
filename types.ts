export enum GameStage {
  EARLY_CAREER = "Early Career",
  ESTABLISHED = "Established",
  WEALTH_BUILDING = "Wealth Building",
  FINANCIAL_FREEDOM = "Financial Freedom"
}

export type LanguageCode = 'en' | 'pt' | 'es' | 'jp' | 'fr' | 'de';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string; // Emoji
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Conversion from Game Unit (USD)
  locale: string;
  decimals: number;
}

export interface Asset {
  id: string;
  name: string; // Fallback name
  type: 'STOCK' | 'REAL_ESTATE' | 'CRYPTO' | 'BOND';
  value: number;
  quantity: number;
  growthRate: number; // Annualized expected
  volatility: number; // 0-1
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number; // XP cost
  level: number;
  maxLevel: number;
  effect: (state: GameState) => Partial<GameState>;
  category: 'INCOME' | 'INVESTING' | 'MINDSET';
}

export interface Job {
  id: string;
  title: string;
  baseSalary: number;
  reqSkillLevel: number;
}

export interface LogEntry {
  id: string;
  month: number;
  message: string;
  type: 'INFO' | 'EARNING' | 'EXPENSE' | 'EVENT';
  amount?: number;
}

export interface Debt {
  id: string;
  name: string;
  principal: number;
  interestRate: number; // Annual
  minPayment: number;
}

export interface GameState {
  age: number; // In months (starts at 216 = 18 years)
  cash: number;
  netWorth: number;
  happiness: number; // 0-100
  financialIQ: number; // XP
  
  income: {
    job: Job;
    sideHustle: number;
  };
  
  expenses: {
    living: number;
    lifestyle: number; // Inflates with wealth
  };
  
  assets: Asset[];
  debts: Debt[];
  
  history: {
    netWorth: { month: number; value: number }[];
    logs: LogEntry[];
  };

  skills: Record<string, number>; // SkillID -> Level
  
  budgetSplit: {
    needs: number; // 50%
    wants: number; // 30%
    savings: number; // 20%
  };
}

export const INITIAL_STATE: GameState = {
  age: 216, // 18 years old
  cash: 1000,
  netWorth: -15000, // Assets (0) + Cash (1000) - Debts (16000)
  happiness: 80,
  financialIQ: 0,
  income: {
    job: { id: 'barista', title: 'Barista', baseSalary: 2400, reqSkillLevel: 0 },
    sideHustle: 0
  },
  expenses: {
    living: 1500,
    lifestyle: 200
  },
  assets: [
    { id: 'index_fund', name: 'Global Index Fund', type: 'STOCK', value: 100, quantity: 0, growthRate: 0.08, volatility: 0.15 },
    { id: 'bond_fund', name: 'Safe Gov Bonds', type: 'BOND', value: 100, quantity: 0, growthRate: 0.04, volatility: 0.05 },
    { id: 'crypto_coin', name: 'Speculative Coin', type: 'CRYPTO', value: 10, quantity: 0, growthRate: 0.20, volatility: 0.80 },
  ],
  debts: [
    { id: 'student_loan', name: 'Student Loan', principal: 15000, interestRate: 0.05, minPayment: 150 },
    { id: 'credit_card', name: 'Credit Card', principal: 1000, interestRate: 0.22, minPayment: 50 }
  ],
  history: {
    netWorth: [{ month: 0, value: -15000 }],
    logs: [{ id: 'init', month: 0, message: "Welcome to Wealth Quest!", type: 'INFO' }]
  },
  skills: {
    'budgeting': 0,
    'investing': 0,
    'negotiation': 0
  },
  budgetSplit: {
    needs: 50,
    wants: 30,
    savings: 20
  }
};