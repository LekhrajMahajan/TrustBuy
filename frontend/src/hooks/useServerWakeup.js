import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const PING_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ping`;
const SLOW_THRESHOLD_MS = 2000; // Show toast if backend takes > 2s

/**
 * Pings the backend immediately on app load.
 * If the backend is cold-starting (Render free tier), shows a user-friendly
 * "Server is waking up..." toast and dismisses it once ready.
 */
const useServerWakeup = () => {
    const toastId = useRef(null);

    useEffect(() => {
        let slowTimer = null;

        const ping = async () => {
            // Show "waking up" toast only if backend is slow
            slowTimer = setTimeout(() => {
                toastId.current = toast.loading('Server is starting up… please wait a moment ☕', {
                    duration: Infinity,
                });
            }, SLOW_THRESHOLD_MS);

            try {
                await axios.get(PING_URL, { timeout: 60000 });
                clearTimeout(slowTimer);
                if (toastId.current) {
                    toast.dismiss(toastId.current);
                    toast.success('Server is ready!', { duration: 2000 });
                    toastId.current = null;
                }
            } catch {
                clearTimeout(slowTimer);
                if (toastId.current) {
                    toast.dismiss(toastId.current);
                    toastId.current = null;
                }
                // Silently fail — don't annoy user if offline or backend is down
            }
        };

        ping();

        return () => {
            clearTimeout(slowTimer);
            if (toastId.current) toast.dismiss(toastId.current);
        };
    }, []);
};

export default useServerWakeup;
