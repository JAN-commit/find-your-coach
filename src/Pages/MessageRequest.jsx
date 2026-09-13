import { useCallback, useEffect, useState } from 'react';
import Message from '../Components/Message';

export default function MessageRequest() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

    const FetchMessages = useCallback(async () => {
        setLoading(true);
        const localId = localStorage.getItem('localId');
        try {
            const response = await fetch(`${dburl}/message/${localId}.json`);
            const data = await response.json();

            if (data) {
                const messagesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessages(messagesArray.reverse());
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [dburl]);

    useEffect(() => {
        FetchMessages();
    }, [FetchMessages]);

    const updateMessageStatus = (id, status) => {
        setMessages(prev =>
            prev.map(message => (message.id === id ? { ...message, status } : message))
        );
    };

    return (
        <main className="page py-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Request received</h1>
                        <p className="mt-1 text-sm text-muted">
                            Messages from students who want to work with you.
                        </p>
                    </div>
                    <button onClick={FetchMessages} className="btn-secondary shrink-0 !px-3.5 !py-2 !text-[13px]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                            <path d="M21 3v6h-6" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-28 animate-pulse rounded-xl border border-line bg-surface p-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-full bg-neutral-200" />
                                    <div className="h-3 w-1/3 rounded-full bg-neutral-200" />
                                </div>
                                <div className="mt-4 h-3 w-full rounded-full bg-neutral-100" />
                                <div className="mt-2 h-3 w-2/3 rounded-full bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Message messages={messages} onStatusChange={updateMessageStatus} />
                )}
            </div>
        </main>
    );
}