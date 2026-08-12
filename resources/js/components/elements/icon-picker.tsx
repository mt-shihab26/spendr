import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getIcon, iconOptions } from '@/lib/icons';

export const IconPicker = ({
    value,
    onChange,
}: {
    value: string | null;
    onChange: (value: string | null) => void;
}) => {
    const [open, setOpen] = useState(false);
    const SelectedIcon = getIcon(value);

    const handleSelect = (name: string) => {
        onChange(name);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex h-8 w-full items-center gap-2 rounded-none border border-input px-2.5 text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground">
                {SelectedIcon ? (
                    <>
                        <SelectedIcon className="size-3.5 shrink-0" />
                        <span className="flex-1 text-left">{value}</span>
                    </>
                ) : (
                    <span className="flex-1 text-left">Select an icon…</span>
                )}
                {value && (
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                onChange('');
                            }
                        }}
                        className="ml-auto text-[10px] text-muted-foreground hover:text-destructive"
                        title="Clear icon"
                    >
                        ✕
                    </span>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Select Icon</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-8 gap-1">
                    {iconOptions.map(({ value: name, icon: Icon }) => (
                        <button
                            key={name}
                            type="button"
                            title={name}
                            onClick={() => handleSelect(name)}
                            className={cn(
                                'flex size-8 items-center justify-center rounded border transition-colors',
                                value === name
                                    ? 'border-foreground bg-foreground text-background'
                                    : 'border-transparent text-foreground hover:border-input hover:bg-muted',
                            )}
                        >
                            <Icon className="size-4" />
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
