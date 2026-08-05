import { useState } from 'react';

type TCopiedValue = string | null;
type TCopyFn = (text: string) => Promise<boolean>;
type TUseClipboardReturn = [TCopiedValue, TCopyFn];

export const useClipboard = (): TUseClipboardReturn => {
    const [copiedText, setCopiedText] = useState<TCopiedValue>(null);

    const copy: TCopyFn = async (text) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');

            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);

            return true;
        } catch (error) {
            console.warn('Copy failed', error);
            setCopiedText(null);

            return false;
        }
    };

    return [copiedText, copy];
};
