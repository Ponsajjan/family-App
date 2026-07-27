import Container from "@/components/Container";
import { Offline } from "@/utils/Icons";

export default function Index() {
  return (
    <main className="h-screen">
      <Container className="flex flex-col justify-center items-center h-full">
        <div className="max-w-4xl mx-auto" aria-hidden="true">
          <div className="z z-1 text-text_color text-4xl">Z</div>
          <div className="z z-2 text-text_color text-2xl">z</div>
          <div className="z z-3 text-text_color text-xl">z</div>
          <div className="z z-4 text-text_color text-base">z</div>
        </div>
        <span className="sleep-animation" aria-hidden="true"><Offline /></span>
        <p className="text-center text-lg text-text_color/60 mt-3" role="status" aria-live="polite">-- Offline --</p>
        <p className="sr-only">You are currently offline. Please check your internet connection.</p>
      </Container>
    </main>
  );
}
