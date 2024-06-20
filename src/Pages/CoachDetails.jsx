import React, { useState } from 'react';
import Modal from '../Components/Modal';
import ContactForm from '../Components/ContactForm';

export default function CoachDetails() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div id="parent" className="max-w-4xl mx-auto p-4 sm:border rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="avatar rounded-xl overflow-hidden w-full mb-4 md:mb-0 md:mr-4">
                    <img src="/Images/profilepic.jpg" alt="Profile" className="object-cover w-full h-full" />
                </div>

                <div id="TEXT" className="flex-grow">
                    <div className="capitalize flex justify-between items-center mb-2">
                        <h1 className="text-xl font-bold">John Lerry Taruc</h1>
                        <p className="text-lg">$ 35/hour</p>
                    </div>
                    <div className="flex space-x-2 mb-4">
                        <button className="border px-2 py-1 rounded-md">Front-end</button>
                        <button className="border px-2 py-1 rounded-md">Back-end</button>
                    </div>
                    <p className="text-justify mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                        onClick={toggleModal}
                    >
                        Contact Now
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <Modal isVisible={isModalOpen} handleClose={toggleModal}>
                    <ContactForm />
                </Modal>
            )}
        </div>
    );
}
