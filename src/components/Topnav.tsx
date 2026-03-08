export default function Topnav({ children }: { children?: React.ReactNode }) {
  return (
    <div className="h-16 glass border-b border-border_color/20 sticky top-0 left-0 w-full flex items-center justify-between px-6 text-text_color z-[98] shadow-sm">
      <div className="flex-1 flex items-center justify-end gap-4">
        {children}
      </div>
    </div>
  )
}
