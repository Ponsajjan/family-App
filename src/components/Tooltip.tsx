"use client"

import React, { useState, useId } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      <div
        id={tooltipId}
        role="tooltip"
        className={`tooltip ${isVisible ? 'visible' : 'invisible'} z-50`}
      >
        <div className="tooltip-text">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
