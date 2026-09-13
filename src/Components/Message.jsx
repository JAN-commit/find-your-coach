import { useState } from 'react';
import { toast } from 'react-toastify';

const STATUS_META = {
    accepted: { label: 'Accepted', className: 'bg-accent-soft text-accent-dark' },
    declined: { label: 'Declined', className: 'bg-red-50 text-red-600' },
    pending: { label: 'Pending', className: 'bg-neutral-100 text-neutral-600' },
};

export default function Message({ messages, onStatusChange }) {
    const [updatingId, setUpdatingId] = useState(null);

    if (messages.length === 0) {
        return (
            <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
                <svg className="mx-auto mb-4 text-neutral-300" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
                </svg>
                <p className="text-sm font-medium text-neutral-600">No messages yet</p>
                <p className="mt-1 text-[13px] text-muted">
                    When students reach out, their requests will appear here.
                </p>
            </div>
        );
    }

    const patchStatus = async (messageId, status) => {
        setUpdatingId(messageId);
        try {
            const idToken = localStorage.getItem('idToken');
            const localId = localStorage.getItem('localId');
            const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
            const cleanDbUrl = dburl.endsWith('/') ? dburl.slice(0, -1) : dburl;

            const response = await fetch(
                `${cleanDbUrl}/message/${localId}/${messageId}.json?auth=${idToken}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            onStatusChange?.(messageId, status);
            toast.success(status === 'accepted' ? 'Request accepted' : 'Request declined');
        } catch (error) {
            console.error('Error updating message status:', error);
            toast.error('Could not update this request. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-3">
            {messages.map(message => {
                const status = message.status || 'pending';
                const meta = STATUS_META[status] || STATUS_META.pending;

                return (
                    <div
                        key={message.id}
                        className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-neutral-300"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-500">
                                    {(message.email || '?').charAt(0).toUpperCase()}
                                </span>
                                <p className="text-sm font-semibold">{message.email || 'Unknown sender'}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                {message.date && (
                                    <span className="hidden text-xs text-muted sm:block">{message.date}</span>
                                )}
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
                                    {meta.label}
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">
                            {message.message || 'No message content'}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                            {status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => patchStatus(message.id, 'accepted')}
                                        disabled={updatingId === message.id}
                                        className="btn-main !px-3.5 !py-2 !text-[13px]"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => patchStatus(message.id, 'declined')}
                                        disabled={updatingId === message.id}
                                        className="btn-secondary !px-3.5 !py-2 !text-[13px] !text-red-600"
                                    >
                                        Decline
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => patchStatus(message.id, 'pending')}
                                    disabled={updatingId === message.id}
                                    className="btn-secondary !px-3.5 !py-2 !text-[13px]"
                                >
                                    Mark as pending
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}