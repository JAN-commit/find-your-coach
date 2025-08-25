import React, { useEffect, useState } from 'react';
import Message from '../Components/Message';

export default function MessageRequest() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

    const FetchMessages = async () => {
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
    };

    useEffect(() => {
        FetchMessages();
    }, [dburl]);

    return (
        <div id="body" className="min-h-screen bg-base-200 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                        Request Received
                    </h1>
                    <button
                        onClick={FetchMessages}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
                    >
                        Refresh
                    </button>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-gray-400 text-center py-10">Loading messages...</p>
                    ) : (
                        <Message messages={messages} />
                    )}
                </div>
            </div>
        </div>
    );
}
