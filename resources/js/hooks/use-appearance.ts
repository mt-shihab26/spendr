import { useSyncExternalStore } from 'react';

type TResolvedAppearance = 'light' | 'dark';

export type TAppearance = TResolvedAppearance | 'system';

const listeners = new Set<() => void>();

let currentAppearance: TAppearance = 'system';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): TAppearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    return (localStorage.getItem('appearance') as TAppearance) || 'system';
};

const isDarkMode = (appearance: TAppearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance: TAppearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = () => {
    return listeners.forEach((listener) => listener());
};

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    return applyTheme(currentAppearance);
};

export const initializeTheme = () => {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('appearance')) {
        localStorage.setItem('appearance', 'system');
        setCookie('appearance', 'system');
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);

    // Set up system theme change listener
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
};

type TUseAppearanceReturn = {
    readonly appearance: TAppearance;
    readonly resolvedAppearance: TResolvedAppearance;
    readonly updateAppearance: (mode: TAppearance) => void;
};

export const useAppearance = (): TUseAppearanceReturn => {
    const appearance: TAppearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'system',
    );

    const resolvedAppearance: TResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: TAppearance): void => {
        currentAppearance = mode;

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
        notify();
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
};
