import { useCallback } from 'react';

type TCleanupFn = () => void;

export const useMobileNavigation = (): TCleanupFn => {
    return useCallback(() => {
        // Remove pointer-events style from body...
        document.body.style.removeProperty('pointer-events');
    }, []);
};
