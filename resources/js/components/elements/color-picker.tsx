import { useRef } from 'react';
import { cn } from '@/lib/utils';

import { Plus } from 'lucide-react';

const COLORS = [
    '#6366f1',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#a855f7',
    '#ec4899',
    '#14b8a6',
];

export const ColorPicker = ({
    value,
    onChange,
    colors = COLORS,
}: {
    value: string;
    onChange: (color: string) => void;
    colors?: string[];
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isCustomColor = !colors.includes(value);

    return (
        <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className={cn(
                        'size-6 rounded-full border-2 transition-transform hover:scale-110',
                        value === color
                            ? 'scale-110 border-foreground'
                            : 'border-transparent',
                    )}
                    style={{ backgroundColor: color }}
                />
            ))}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'relative size-6 rounded-full border-2 transition-transform hover:scale-110',
                    isCustomColor
                        ? 'scale-110 border-foreground'
                        : 'border-transparent',
                )}
                style={{ backgroundColor: isCustomColor ? value : undefined }}
                title="Custom color"
            >
                {!isCustomColor && (
                    <Plus className="absolute inset-0 m-auto size-3.5 text-muted-foreground" />
                )}
                <input
                    ref={inputRef}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    tabIndex={-1}
                />
            </button>
        </div>
    );
};
