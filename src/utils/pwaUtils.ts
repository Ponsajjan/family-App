import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    // Fixed PWA detection
    const isPWA = (): boolean => {
        if (typeof window === 'undefined') return false;

        return window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches ||
            ((window.navigator as any).standalone === true);
    };

    // Fixed PWA install function
    const triggerPWAInstall = async () => {
        // For iOS, show instructions (iOS doesn't allow programmatic install)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            alert('📱 To install: Tap the share icon → "Add to Home Screen"');
            return;
        }

        // For Android/Desktop
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }

            setDeferredPrompt(null);
            setShowInstallButton(false);
        } else {
            // Fallback for browsers that don't support the prompt
            alert('Look for "Add to Home Screen" in your browser menu (usually the share icon 📱 or install icon 📥)');
        }
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    return {
        isPWA,
        triggerPWAInstall,
        showInstallButton,
        deferredPrompt
    };
};