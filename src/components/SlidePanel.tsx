import React from 'react';

interface SlideUpPanelProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  children: React.ReactNode;
}

const SlidePanel: React.FC<SlideUpPanelProps> = ({
  showDetails,
  setShowDetails,
  children
}) => {
  return (
    <>
      <div
        onClick={() => setShowDetails(false)}
        className={`fixed md:hidden ${showDetails ? 'top-0 bg-gray-500/60' : 'bottom-full delay-[600ms] bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      />
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showDetails ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden slidpanel-hide'} transition-all duration-500 ease-in-out w-full max-h-[80vh] overflow-y-auto lg:max-w-[36.25rem] mx-auto md:max-h-[calc(100vh-3rem)]`}>
        <div className={`overflow-x-hidden ${showDetails ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>
          {children}
        </div>
      </div>
    </>
  )
}
export default SlidePanel;