import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type TFlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as TFlashToast | undefined;

            if (!data) {
                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}
