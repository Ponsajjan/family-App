"use client";

import { useEffect, useState } from "react";
// import { X } from "lucide-react";
import { CloseIcon } from "@/utils/Icons";

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes("android-app://");

        if (isStandalone) {
            return;
        }

        // Check for iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // For iOS, we might want to show it immediately or after a delay since it doesn't support beforeinstallprompt
        if (isIosDevice) {
            // Check if we've already shown it recently to avoid annoyance
            const lastDismissed = localStorage.getItem('pwaPromptDismissed');
            if (!lastDismissed || Date.now() - parseInt(lastDismissed) > 7 * 24 * 60 * 60 * 1000) { // 7 days
                setIsVisible(true);
            }
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            if (isIOS) {
                // iOS instructions
                alert("To install: tap the Share button (square with arrow) and select 'Add to Home Screen'");
            }
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwaPromptDismissed', Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Install App
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Install this application on your home screen for a better experience.
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label="Dismiss"
                >
                    {/* <X className="w-5 h-5" /> */}
                    <CloseIcon />
                </button>
            </div>
            <div className="flex gap-3 mt-1">
                <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    {isIOS ? "How to Install" : "Install"}
                </button>
                <button
                    onClick={handleDismiss}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Not Now
                </button>
            </div>
        </div>
    );
}
