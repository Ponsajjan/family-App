export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="text-center text-text_color pt-6 md:pt-20 pb-6 w-full loading-text"
    >
      Loading...
      <span className="sr-only">Please wait while content loads.</span>
    </div>
  )
}
