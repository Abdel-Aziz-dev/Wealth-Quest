import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Currency, LanguageCode } from '../types';
import { JOBS, SKILL_TREE } from '../constants';
import { t } from './i18n';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to sanitize state for the AI to reduce token usage
const buildContext = (state: GameState, currency: Currency) => {
  const nextJob = JOBS.find(j => j.reqSkillLevel > state.financialIQ);
  const affordableSkills = SKILL_TREE.filter(s => state.financialIQ >= s.cost && (state.skills[s.id] || 0) < s.maxLevel);
  
  // Convert currency helper
  const conv = (val: number) => Math.floor(val * currency.rate);

  // Calculate total debt and highest interest rate for context
  const totalDebt = state.debts.reduce((acc, d) => acc + d.principal, 0);
  const highestAPR = state.debts.length > 0 ? Math.max(...state.debts.map(d => d.interestRate)) : 0;
  const monthlyCashflow = (state.income.job.baseSalary / 12) + state.income.sideHustle - (state.expenses.living + state.expenses.lifestyle + state.debts.reduce((acc, d) => acc + d.minPayment, 0));

  return JSON.stringify({
    currency: currency.code,
    stats: {
        age_years: Math.floor(state.age / 12),
        cash: conv(state.cash),
        net_worth: conv(state.netWorth),
        financial_iq_xp: state.financialIQ,
        monthly_cashflow: conv(monthlyCashflow),
        happiness: state.happiness
    },
    portfolio: {
        assets: state.assets.map(a => ({ name: a.name, total_value: conv(a.value * a.quantity), type: a.type, volatility: a.volatility })),
        debts: state.debts.filter(d => d.principal > 0).map(d => ({ name: d.name, amount: conv(d.principal), apr: (d.interestRate * 100).toFixed(1) + "%", min_payment: conv(d.minPayment) }))
    },
    career: {
        current_job: state.income.job.title,
        base_salary: conv(state.income.job.baseSalary),
        next_job_opportunity: nextJob ? { title: nextJob.title, req_xp: nextJob.reqSkillLevel } : "Maxed out - You are the boss!",
    },
    opportunities: {
        affordable_upgrades: affordableSkills.map(s => `${s.name} (${s.description}) - Cost: ${s.cost} XP`),
        can_pay_off_high_interest_debt: totalDebt > 0 && state.cash > 0 && highestAPR > 0.08
    }
  });
};

// 1. Financial Advisor Chat (Thinking Model)
export const getFinancialAdvice = async (
  query: string, 
  state: GameState,
  currency: Currency,
  lang: LanguageCode
) => {
  try {
    const gameStateContext = buildContext(state, currency);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        System: You are the "Wealth Quest Guide", a smart financial coach inside a game.
        Your goal is to help the player maximize their Net Worth and Financial IQ (XP).
        
        GAME MECHANICS KNOWLEDGE:
        - **XP (Financial IQ)**: Used to buy Skills and get promoted. Gained by saving >20% of income.
        - **Skills**: 
          - "Negotiation": Increases salary multiplier.
          - "Budget Master": Reduces lifestyle inflation.
          - "Market Wisdom": Stabilizes investment returns.
        - **Debts**: Interest compounds monthly. Paying off >8% APR debt is usually better than investing.
        - **Happiness**: Drops if cash < 0. Keeps high by avoiding debt stress.
        - **Currency**: The user is playing in ${currency.code} (${currency.symbol}). All values in JSON are already converted to this currency. Use this symbol in your response.

        LANGUAGE:
        Reply in this language: "${lang}". Adapt your tone to be culturally appropriate for this language while remaining an encouraging game coach.

        CURRENT PLAYER STATE JSON:
        ${gameStateContext}

        INSTRUCTIONS:
        1. Keep it conversational but concise (max 3-4 sentences).
        2. **Prioritize logic**: If they have high-interest debt (>10%), tell them to pay it before investing.
        3. **Specifics**: Mention exact skill names or job titles from the context.
        4. **Tone**: Encouraging, smart, using emojis. 
        5. Format: Use **bold** for key terms or numbers.
        
        User Query: "${query}"
      `,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Advisor Error:", error);
    return "I'm analyzing the market... try asking again in a moment! 📉";
  }
};

// 2. Receipt Scanner (Vision)
export const analyzeReceipt = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: "Analyze this receipt. Return a JSON object with 'total' (number) and 'category' (string: Food, Transport, Utilities, or Shopping). Only return the JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total: { type: Type.NUMBER },
            category: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Vision Error:", error);
    return null;
  }
};

// 3. Real World Search (Grounding)
export const searchFinancialNews = async (topic: string, lang: LanguageCode) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the latest 3 key headlines regarding: ${topic}. Summarize them in bullet points in language: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Error:", error);
    return { text: "Could not fetch news.", sources: [] };
  }
};