function Container({ className = '', children }: any) {
  return (
    <div className={`md:h-[calc(100vh-3rem)] md:overflow-y-auto w-full ${className}`}>
      {children}
    </div>
  );
}

export default Container;