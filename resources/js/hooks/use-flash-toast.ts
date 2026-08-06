import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useFlashToast = () => {
    const lastFlash = useRef<typeof flash | null>(null);

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash === lastFlash.current) return;

        lastFlash.current = flash;

        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.info) toast.info(flash.info);
        if (flash.warning) toast.warning(flash.warning);
    }, [flash]);
};
