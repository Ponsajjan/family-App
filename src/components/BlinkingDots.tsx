'use client'

export default function BlinkingDots() {
    return (
        <span className="inline-flex gap-0.5">
            <span className="blinking-dot">.</span>
            <span className="blinking-dot">.</span>
            <span className="blinking-dot">.</span>
        </span>
    );
}
