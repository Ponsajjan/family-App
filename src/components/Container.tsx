function Container({ className = '', children }: any) {
  return (
    <div className={`md:h-[calc(100vh-3rem)] md:overflow-y-auto w-full ${className}`}>

      {/* --------------- To fix padding issue in birthday list --------------- */}
      <div className="hidden md:block pt-3 sticky top-0 bg-main_background z-10"></div>
      {/* --------------------------------------------------------------------- */}
      {children}
    </div>
  );
}

export default Container;