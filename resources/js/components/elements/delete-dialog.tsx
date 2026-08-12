import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { ReactElement, ReactNode } from 'react';

import { Trash2 } from 'lucide-react';

export const DeleteDialog = ({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    onConfirm,
}: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactElement;
    title: ReactNode;
    description: ReactNode;
    onConfirm: () => void;
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger render={trigger} />}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>{description}</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        <Trash2 />
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
