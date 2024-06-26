import React, { useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';

export default function ContactForm({ id, toggleModal }) {

    const currentTime = new Date()
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    const datetime = currentTime.toLocaleString('en-US', options);

    const [email, setemail] = useState('')
    const [message, setmessage] = useState('')
    const [date, setdate] = useState(datetime)

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;


    const send_message = async (e) => {
        e.preventDefault();

        const User_Message = {
            email,
            message,
            date
        }

        try {
            const response = await fetch(`${dburl}/message/${id}.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(User_Message)

            });

            const data = await response.json();
            console.log("Coach profile successfully updated:", data);
            toast.success("Message successful send")
            toggleModal()
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <div>
            <div id="parent">
                <div id="header" className="font-semibold text-xl text-center py-3">Contact Form</div>
                <form onSubmit={send_message}>

                    <div id="EMAIL" >
                        <div className="form-control w-full max-w-">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input type="Email" className="grow" placeholder="Email"
                                    onChange={(e) => setemail(e.target.value)}
                                    required={true}


                                />
                            </label>
                        </div>
                    </div>

                    <div id="Message">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Your bio</span>
                            </div>
                            <textarea className="textarea textarea-bordered h-24" placeholder="Message"
                                onChange={(e) => setmessage(e.target.value)}
                                required={true}

                            ></textarea>
                        </label>
                    </div>

                    <div className="py-5">
                        <button className='btn btn-primary w-full' type='submit'>Send Message</button>
                    </div>
                </form>
            </div>

        </div>
    )
}
