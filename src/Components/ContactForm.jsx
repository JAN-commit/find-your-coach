import React from 'react'
import Modal from './Modal'

export default function ContactForm() {
    return (
        <div>
                <div id="parent">
                    <div id="header" className="font-semibold text-xl text-center py-3">Contact Form</div>
                    <div id="EMAIL" >
                        <div className="form-control w-full max-w-">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input type="Email" className="grow" placeholder="Email" />
                            </label>
                        </div>
                    </div>

                    <div id="Message">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Your bio</span>
                            </div>
                            <textarea className="textarea textarea-bordered h-24" placeholder="Message"></textarea>
                        </label>
                    </div>

                    <div className="py-5">
                        <button className='btn btn-primary w-full'>Send Message</button>
                    </div>
                </div>

        </div>
    )
}
