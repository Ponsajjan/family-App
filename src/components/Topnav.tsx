export default function Topnav({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <header className={`h-12 border-b border-border_color sticky top-0 left-0 w-full bg-field_color flex gap-2 items-center justify-between text-text_color pl-10 pr-2 z-[98] ${className ?? ""}`}>
      {children}
    </header>
  )
}
