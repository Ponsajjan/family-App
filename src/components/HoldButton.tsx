import React, { useState, useRef } from 'react';

interface HoldButtonProps {
  onClick: () => void;
  buttonText: string;
  holdDuration?: number;
  className?: string;
  type?: 'solid' | 'outline';
  disabled?: boolean;
}

export const HoldButton: React.FC<HoldButtonProps> = ({
  onClick,
  buttonText,
  holdDuration = 5000,
  className = '',
  type = 'solid',
  disabled = false
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startHold = () => {
    if (disabled) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();
    holdTimerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - (startTimeRef.current || 0);
      setHoldProgress(Math.min((elapsedTime / holdDuration) * 100, 100));

      if (elapsedTime >= holdDuration) {
        if (holdTimerRef.current) {
          clearInterval(holdTimerRef.current);
        }
        onClick();
        resetHold();
      }
    }, 16);
  };

  const resetHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
    startTimeRef.current = null;
  };

  const remainingSeconds = ((holdDuration - (holdProgress / 100 * holdDuration)) / 1000).toFixed(1);

  return (
    <button
      className={`relative min-w-[9.375rem] disabled:cursor-not-allowed disabled:opacity-45 ${type === 'solid'
        ? 'bg-accent_color md:hover:bg-accent_color_hover text-accent_contrast'
        : 'bg-field_color md:hover:bg-field_hover border-2 border-accent_color text-text_color'
        } h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg shadow-md active:shadow-none rounded-md font-medium overflow-hidden flex items-center justify-center ${className}`}
      onMouseDown={startHold}
      onMouseUp={resetHold}
      onMouseLeave={resetHold}
      onTouchStart={startHold}
      onTouchEnd={resetHold}
      onTouchCancel={resetHold}
      disabled={disabled}
      aria-busy={isHolding}
      aria-label={isHolding ? `${buttonText} - hold for ${remainingSeconds} more seconds` : buttonText}
    >
      {/* Progress Overlay */}
      {isHolding && (
        <div
          className='absolute top-0 left-0 bottom-0 bg-blue-600 z-10'
          style={{ width: `${holdProgress}%` }}
          aria-hidden="true"
        />
      )}

      {/* Button Content */}
      <div className="relative z-20 flex items-center justify-center w-full h-full pointer-events-none" aria-live="polite" aria-atomic="true">
        {isHolding ? (
          <span className="font-mono" aria-label={`${remainingSeconds} seconds remaining`}>
            {remainingSeconds}s
          </span>
        ) : (
          buttonText
        )}
      </div>
    </button>
  );
};

export const HoldTextButton: React.FC<HoldButtonProps> = ({
  onClick,
  buttonText,
  holdDuration = 5000,
  className = '',
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startHold = () => {
    setIsHolding(true);
    startTimeRef.current = Date.now();
    holdTimerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - (startTimeRef.current || 0);
      setHoldProgress(Math.min((elapsedTime / holdDuration) * 100, 100));

      if (elapsedTime >= holdDuration) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        onClick();
        resetHold();
      }
    }, 16);
  };

  const resetHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
    startTimeRef.current = null;
  };

  const remainingSeconds = ((holdDuration - (holdProgress / 100 * holdDuration)) / 1000).toFixed(1);

  return (
    <button
      className={`relative min-w-[3.3125rem] overflow-hidden flex items-center justify-center ${className}`}
      onMouseDown={startHold}
      onMouseUp={resetHold}
      onMouseLeave={resetHold}
      onTouchStart={startHold}
      onTouchEnd={resetHold}
      onTouchCancel={resetHold}
      aria-busy={isHolding}
      aria-label={isHolding ? `${buttonText} - hold for ${remainingSeconds} more seconds` : buttonText}
    >
      {isHolding && (
        <div
          className="absolute top-0 left-0 bottom-0 bg-blue-500 z-10"
          style={{ width: `${holdProgress}%` }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-20 flex items-center justify-center w-full h-full text-sm pointer-events-none" aria-live="polite" aria-atomic="true">
        {isHolding ? (
          <span className="font-mono" aria-label={`${remainingSeconds} seconds remaining`}>
            {remainingSeconds}s
          </span>
        ) : (
          buttonText
        )}
      </div>
    </button>
  );
};
