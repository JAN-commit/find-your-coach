import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactForm({ id, toggleModal }) {
    const currentTime = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    const datetime = currentTime.toLocaleString('en-US', options);

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

    const send_message = async (e) => {
        e.preventDefault();
        setSending(true);

        const User_Message = { email, message, date: datetime };

        try {
            const idToken = localStorage.getItem('idToken');
            const cleanDbUrl = dburl.endsWith('/') ? dburl.slice(0, -1) : dburl;

            const response = await fetch(`${cleanDbUrl}/message/${id}.json?auth=${idToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(User_Message),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            toast.success('Message sent successfully');
            toggleModal();
        } catch (error) {
            console.error(error);
            toast.error('Could not send your message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold tracking-tight">Contact coach</h2>
            <p className="mb-5 mt-1 text-sm text-muted">
                Send a message and the coach will get back to you.
            </p>

            <form onSubmit={send_message} className="flex flex-col gap-4">
                <div>
                    <label className="label" htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        className="field"
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="label" htmlFor="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        className="field min-h-28 resize-none"
                        placeholder="Hi! I'd love to book a session with you…"
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-main w-full" disabled={sending}>
                    {sending ? 'Sending…' : 'Send message'}
                </button>
            </form>
        </div>
    );
}