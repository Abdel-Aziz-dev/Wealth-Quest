import { Job, Skill, Currency, Language } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, locale: 'en-US', decimals: 0 },
  { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE', decimals: 0 },
  { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB', decimals: 0 },
  { code: 'JPY', symbol: '¥', rate: 150, locale: 'ja-JP', decimals: 0 },
  { code: 'INR', symbol: '₹', rate: 83, locale: 'en-IN', decimals: 0 },
  { code: 'BRL', symbol: 'R$', rate: 5.5, locale: 'pt-BR', decimals: 0 },
];

export const JOBS: Job[] = [
  { id: 'barista', title: 'Barista', baseSalary: 2400, reqSkillLevel: 0 },
  { id: 'intern', title: 'Office Intern', baseSalary: 3200, reqSkillLevel: 100 },
  { id: 'junior_dev', title: 'Junior Developer', baseSalary: 5500, reqSkillLevel: 500 },
  { id: 'senior_dev', title: 'Senior Developer', baseSalary: 9500, reqSkillLevel: 1500 },
  { id: 'manager', title: 'Product Manager', baseSalary: 12000, reqSkillLevel: 3000 },
  { id: 'cto', title: 'Startup CTO', baseSalary: 20000, reqSkillLevel: 8000 },
];

export const SKILL_TREE: Skill[] = [
  {
    id: 'budgeting',
    name: 'Budget Master',
    description: 'Reduces lifestyle creep by 10% per level.',
    cost: 500,
    level: 0,
    maxLevel: 5,
    category: 'MINDSET',
    effect: () => ({}) // Logic handled in engine
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    description: 'Increases salary by 5% per level.',
    cost: 1000,
    level: 0,
    maxLevel: 5,
    category: 'INCOME',
    effect: () => ({})
  },
  {
    id: 'investing',
    name: 'Market Wisdom',
    description: 'Reduces portfolio volatility impact.',
    cost: 2000,
    level: 0,
    maxLevel: 3,
    category: 'INVESTING',
    effect: () => ({})
  }
];

export const EVENTS = [
  {
    title: "Car Breakdown",
    description: "Your transmission failed. It's expensive.",
    cost: 800,
    probability: 0.05
  },
  {
    title: "Medical Emergency",
    description: "Unexpected trip to the ER.",
    cost: 1200,
    probability: 0.03
  },
  {
    title: "Side Hustle Boom",
    description: "Your weekend project went viral!",
    bonus: 1500,
    probability: 0.04
  },
  {
    title: "Found Money",
    description: "An old rebate check arrived.",
    bonus: 200,
    probability: 0.1
  }
];

export const LOAN_OPTIONS = [
    { id: 'credit_card', name: 'Credit Card Advance', interestRate: 0.24, maxAmount: 5000 },
    { id: 'personal_loan', name: 'Personal Loan', interestRate: 0.12, maxAmount: 25000 },
    { id: 'shark_loan', name: 'Quick Cash (High Risk)', interestRate: 0.50, maxAmount: 2000 },
];