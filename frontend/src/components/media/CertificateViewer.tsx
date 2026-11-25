import type { FileAsset } from '@portfolio/shared';
import { Modal } from '../ui/Modal';

interface CertificateViewerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  file: FileAsset | null;
}

export function CertificateViewer({ open, onClose, title, file }: CertificateViewerProps) {
  if (!file) return null;

  const isPdf = file.mimeType === 'application/pdf';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {isPdf ? (
        <div className="space-y-4">
          <p className="text-sm text-textMuted">
            This certificate is a PDF document. Open it in a new tab to inspect or download.
          </p>
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
          >
            Open PDF certificate
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-media border border-border bg-surfaceAlt p-2">
          <img
            src={file.url}
            alt={file.alt || title}
            width={file.width ?? 1200}
            height={file.height ?? 800}
            className="max-h-[70vh] w-full rounded-media object-contain"
          />
        </div>
      )}
    </Modal>
  );
}
