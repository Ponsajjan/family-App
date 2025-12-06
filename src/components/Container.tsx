import { forwardRef } from 'react';

const Container = forwardRef<HTMLDivElement, any>(({ className = '', children }, ref) => {
  return (
    <div ref={ref} className={`md:h-[calc(100vh-3rem)] md:overflow-y-auto w-full ${className}`}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;