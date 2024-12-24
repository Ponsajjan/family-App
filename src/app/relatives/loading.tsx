import Loading from "@/components/Loading";

export default function loading() {
  return (
    <div className="w-full">
      <div className="h-12 border-b border-border_color sticky top-0 left-0 w-full bg-field_color flex gap-2 items-center justify-between text-text_color pl-10 pr-2 font-bold text-lg z-[98]">
      </div>
      <Loading />
    </div>
  )
}