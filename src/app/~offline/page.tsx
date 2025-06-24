import { Offline } from "@/utils/Icons";

export default function Index() {
  return (
    <div className="w-full flex flex-col justify-center h-[calc(100vh-3rem)] items-center bg-main_background">
      <div className="max-w-4xl mx-auto">
        <div className="z z-1 text-text_color text-4xl">Z</div>
        <div className="z z-2 text-text_color text-2xl">z</div>
        <div className="z z-3 text-text_color text-xl">z</div>
        <div className="z z-4 text-text_color text-base">z</div>
      </div>
      <Offline />
      <p className="text-center text-lg text-text_color mt-3">-- Offline --</p>
    </div>
  );
}