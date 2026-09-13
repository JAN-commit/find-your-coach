import { useEffect } from 'react';

export default function Modal({ children, isVisible, handleClose }) {
    useEffect(() => {
        const modal = document.getElementById('fyc-modal');
        if (isVisible) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [isVisible]);

    return (
        <dialog
            id="fyc-modal"
            className="m-auto rounded-2xl border border-line bg-surface p-0 text-ink shadow-lift backdrop:bg-ink/40"
        >
            <div className="relative w-[calc(100vw-2rem)] max-w-md p-6">
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-neutral-100 hover:text-ink"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
                {children}
            </div>
        </dialog>
    );
}