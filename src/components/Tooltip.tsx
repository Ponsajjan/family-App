"use client"

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <div className={`tooltip ${isVisible ? 'visible' : 'invisible'} z-50`} >
        <div className="tooltip-text" >
          {content}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
