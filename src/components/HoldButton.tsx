import React, { useState, useRef } from 'react';

interface HoldButtonProps {
  onClick: () => void; // Callback function when the button is held for 5 seconds
  buttonText: string; // Button text
  holdDuration?: number; // Duration in milliseconds (default: 5000ms)
  className?: string; // Custom CSS class for styling
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
      setHoldProgress((elapsedTime / holdDuration) * 100);

      if (elapsedTime >= holdDuration) {
        clearInterval(holdTimerRef.current!);
        onClick();
        resetHold();
      }
    }, 10); // Update progress every 10ms
  };

  const resetHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
    startTimeRef.current = null;
  };

  return (
    <button
      className={`relative min-w-[9.375rem] disabled:cursor-not-allowed disabled:opacity-45 ${type == 'solid' ? 'bg-accent_color md:hover:bg-accent_color_hover text-accent_contrast' : 'bg-field_color md:hover:bg-field_hover border-2 border-accent_color text-text_color'} h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg shadow-md rounded-md font-medium  overflow-hidden flex items-center justify-center ${className}`}
      onMouseDown={startHold}
      onMouseUp={resetHold}
      onMouseLeave={resetHold}
      onTouchStart={startHold}
      onTouchEnd={resetHold}
      onTouchCancel={resetHold}
      disabled={disabled}
    >
      {isHolding && (
        <div
          className="absolute inset-0 bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${holdProgress}%` }}
        />
      )}
      {isHolding ? (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {Math.round((holdProgress / 100) * (holdDuration / 1000))}s
        </div>
      ): <div>{buttonText}</div>}
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
      setHoldProgress((elapsedTime / holdDuration) * 100);

      if (elapsedTime >= holdDuration) {
        clearInterval(holdTimerRef.current!);
        onClick();
        resetHold();
      }
    }, 10); // Update progress every 10ms
  };

  const resetHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
    startTimeRef.current = null;
  };

  return (
    <button
      className={`relative min-w-[3.3125rem]  overflow-hidden flex items-center justify-center ${className}`}
      onMouseDown={startHold}
      onMouseUp={resetHold}
      onMouseLeave={resetHold}
      onTouchStart={startHold}
      onTouchEnd={resetHold}
      onTouchCancel={resetHold}
    >
      {isHolding && (
        <div
          className="absolute inset-0 bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${holdProgress}%` }}
        />
      )}
      {isHolding ? (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {Math.round((holdProgress / 100) * (holdDuration / 1000))}s
        </div>
      ): <div>{buttonText}</div>}
    </button>
  );
};
