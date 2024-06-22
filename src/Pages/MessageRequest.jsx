import React, { useEffect, useState } from 'react';
import Message from '../Components/Message';

export default function MessageRequest() {
    const [messages, setMessages] = useState([]);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
    const FetchMessages = async () => {
        const localId = localStorage.getItem('localId');
        try {
            const response = await fetch(`${dburl}/message/${localId}.json`);
            const data = await response.json();

            // Process the data to extract messages
            if (data) {
                const messagesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessages(messagesArray);
            } else {
                console.log('No messages found in the response data');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        FetchMessages();
    }, [dburl]); // Empty dependency array ensures this runs once

    return (
        <div id="body" className="">
            <div className="flex justify-start flex-col">
                <div className="w-full max-w-xs md:max-w-xl mx-auto">
                    <div className="text-3xl font-semibold py-5">
                        <h1>Request Received</h1>
                    </div>
                    
                    <Message messages={messages}/>
                </div>
            </div>
        </div>
    );
}
