import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../types';
import { t } from '../services/i18n';

interface Props {
  onComplete: () => void;
  onClose: () => void;
  lang: LanguageCode;
}

interface Step {
  targetId?: string;
  titleKey: string;
  descKey: string;
}

export const Tutorial: React.FC<Props> = ({ onComplete, onClose, lang }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Full feature tour
  const steps: Step[] = [
    { titleKey: 'tutorial.welcome_title', descKey: 'tutorial.welcome_desc' },
    { targetId: 'tutorial-lang-btn', titleKey: 'tutorial.lang_title', descKey: 'tutorial.lang_desc' },
    { targetId: 'tutorial-currency-btn', titleKey: 'tutorial.currency_title', descKey: 'tutorial.currency_desc' },
    { targetId: 'tutorial-stats', titleKey: 'tutorial.stats_title', descKey: 'tutorial.stats_desc' },
    { targetId: 'tutorial-chart', titleKey: 'tutorial.chart_title', descKey: 'tutorial.chart_desc' },
    { targetId: 'tutorial-cashflow', titleKey: 'tutorial.cashflow_title', descKey: 'tutorial.cashflow_desc' },
    { targetId: 'tutorial-next-btn', titleKey: 'tutorial.advance_title', descKey: 'tutorial.advance_desc' },
    { targetId: 'tutorial-actions', titleKey: 'tutorial.actions_title', descKey: 'tutorial.actions_desc' },
    { targetId: 'tab-career', titleKey: 'tutorial.tab_career_title', descKey: 'tutorial.tab_career_desc' },
    { targetId: 'tab-debt', titleKey: 'tutorial.tab_debt_title', descKey: 'tutorial.tab_debt_desc' },
    { targetId: 'tab-invest', titleKey: 'tutorial.tab_invest_title', descKey: 'tutorial.tab_invest_desc' },
    { targetId: 'tab-skills', titleKey: 'tutorial.tab_skills_title', descKey: 'tutorial.tab_skills_desc' },
    { targetId: 'tutorial-advisor-btn', titleKey: 'tutorial.advisor_title', descKey: 'tutorial.advisor_desc' },
    { titleKey: 'tutorial.finish_title', descKey: 'tutorial.finish_desc' }
  ];

  const currentStep = steps[currentStepIndex];
  const isLast = currentStepIndex === steps.length - 1;

  // Use requestAnimationFrame for smooth, continuous updates of the highlight position
  useEffect(() => {
    let animationFrameId: number;

    const updateRect = () => {
      if (currentStep.targetId) {
        const el = document.getElementById(currentStep.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if element is actually visible in viewport or just has dimensions
          if (rect.width > 0 && rect.height > 0) {
            setTargetRect(rect);
          } else {
            setTargetRect(null); // Element exists but might be hidden
          }
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
      animationFrameId = requestAnimationFrame(updateRect);
    };

    // Initial trigger
    updateRect();

    // Cleanup
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentStepIndex, currentStep.targetId]);

  // Handle auto-scroll when step changes
  useEffect(() => {
    if (currentStep.targetId) {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        // Smooth scroll targeting center
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [currentStepIndex, currentStep.targetId]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // SPOTLIGHT EFFECT
  // A fixed overlay with a massive box-shadow creates the "hole"
  const spotlightStyle: React.CSSProperties = targetRect
    ? {
        position: 'fixed',
        top: targetRect.top - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.85)', // Darker overlay for focus
        borderRadius: '12px',
        zIndex: 100, // Very high Z-Index
        pointerEvents: 'none', // Allow clicks to pass through to underlying tracking loop but visual only
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)', // Smooth transition for rect changes
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 100,
        pointerEvents: 'none',
        transition: 'all 0.3s ease-in-out',
      };

  // TOOLTIP POSITIONING LOGIC
  const getTooltipStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 110,
      width: '320px',
      maxWidth: 'calc(100vw - 32px)',
      transition: 'all 0.3s ease-out'
    };

    if (!targetRect) {
      return {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const gap = 24;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Approx max height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prefer Bottom
    let top = targetRect.bottom + gap;
    let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);

    let position = 'bottom';

    // Check collision bottom
    if (top + tooltipHeight > viewportHeight) {
      // Try Top
      top = targetRect.top - tooltipHeight - gap;
      position = 'top';
      
      // Check collision top
      if (top < 0) {
        // Try Right
        left = targetRect.right + gap;
        top = targetRect.top;
        position = 'right';

        // Check collision right
        if (left + tooltipWidth > viewportWidth) {
           // Try Left
           left = targetRect.left - tooltipWidth - gap;
           position = 'left';
           
           // Fallback to center/bottom aligned if everything fails (mobile mostly)
           if (left < 0) {
             left = 16;
             top = Math.min(targetRect.bottom + gap, viewportHeight - tooltipHeight - 16);
             position = 'mobile-fallback';
           }
        }
      }
    }

    // Clamp horizontal
    if (left < 16) left = 16;
    if (left + tooltipWidth > viewportWidth - 16) left = viewportWidth - tooltipWidth - 16;

    return {
      ...baseStyle,
      top: top,
      left: left,
    };
  };

  return (
    <>
      {/* 1. Dark Overlay & Spotlight Hole */}
      <div style={spotlightStyle} />
      
      {/* 2. Interaction Blocker: Transparent div covering screen to prevent clicks on app while tutorial is running */}
      <div className="fixed inset-0 z-[105]" onClick={(e) => e.stopPropagation()}></div>

      {/* 3. Tooltip Card */}
      <div style={getTooltipStyle()} className="animate-scale-in">
        <div className="bg-slate-800 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="bg-slate-900/50 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20">
                    STEP {currentStepIndex + 1} OF {steps.length}
                </span>
                <button 
                  onClick={onClose} 
                  className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
                  title="Skip Tutorial"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2">{t(lang, currentStep.titleKey)}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{t(lang, currentStep.descKey)}</p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center relative z-10">
                 <button 
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="text-slate-400 hover:text-white text-sm font-semibold px-2 py-1 disabled:opacity-0 transition-opacity"
                 >
                    Back
                 </button>
                 
                 <button 
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                        isLast 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-900/30' 
                        : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                    }`}
                 >
                    {isLast ? (
                      <>
                        <span>{t(lang, 'tutorial.finish')}</span>
                        <span>🎁</span>
                      </>
                    ) : (
                      <>
                        <span>{t(lang, 'tutorial.next')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </>
                    )}
                 </button>
            </div>
        </div>
      </div>
      
      {/* 4. Target Indicator (Pulsing Border) */}
      {targetRect && (
        <div 
           className="fixed pointer-events-none z-[101] border-2 border-emerald-400 rounded-xl animate-pulse"
           style={{
             top: targetRect.top - 4,
             left: targetRect.left - 4,
             width: targetRect.width + 8,
             height: targetRect.height + 8,
           }}
        />
      )}
    </>
  );
};