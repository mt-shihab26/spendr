import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export const AttachmentUploader = ({
    onFile,
    processing,
    error,
}: {
    onFile: (file: File) => void;
    processing: boolean;
    error?: string;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    return (
        <>
            <div
                className={`flex cursor-pointer flex-col items-center gap-2 rounded border-2 border-dashed p-6 transition-colors ${
                    dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                        onFile(file);
                    }
                }}
            >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    {processing
                        ? 'Uploading...'
                        : 'Click or drag a file to attach'}
                </p>
                <p className="text-xs text-muted-foreground">
                    JPG, PNG, PDF, WEBP up to 10 MB
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.webp"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            onFile(file);
                            e.target.value = '';
                        }
                    }}
                />
            </div>

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </>
    );
};
