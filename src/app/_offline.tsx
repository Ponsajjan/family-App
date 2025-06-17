export default function Index() {
  return (
    <div className="w-full">
      <div className="h-12 border-b border-border_color sticky top-0 left-0 w-full bg-field_color flex gap-2 items-center justify-between text-text_color pl-10 pr-2 font-bold text-lg z-[98]">
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="z z-1 text-text_color">Z</div>
        <div className="z z-2 text-text_color">Z</div>
        <div className="z z-3 text-text_color">Z</div>
        <div className="z z-4 text-text_color">Z</div>
      </div>
      <p className="text-center text-lg text-text_color">Offline</p>
    </div>
  );
}