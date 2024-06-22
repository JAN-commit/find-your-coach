import React, { useState } from 'react';
import Modal from './Modal';
import ContactForm from './ContactForm';
import { useNavigate } from 'react-router-dom';

export default function Card({ coach }) {
    const Navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const navigateToDetails = (id) => {
        Navigate(`/CoachDetails/${id}`);
    };
    
    return (
        <div>
            <div className="card bg-base-300 shadow-xl dark:bg-base-900">
                <figure >
                    {/* <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /> */}
                    {/* <div className="skeleton h-32 w-full"></div> */}
                    <div className="avatar">
                        <div className="w-36 rounded">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>

                </figure>
                <div className="card-body pt-5">
                    <h2 className="card-title text-sm md:text-xl">{coach.firstName} {coach.lastName}</h2>
                    <p>{coach.hourlyRate}/hr</p>
                    <div className="flex space-x- mb-4 justify-center md:justify-start flex-col md:flex-row">
                        {coach.expertise.map((exp, index) => (
                            <button key={index} className="border px-1 py-1 rounded-md sm:px-2 sm:text-sm">{exp}</button>
                        ))}
                    </div>
                    <div className="card-actions flex justify-center md:justify-end">
                        <div className="flex space-x-2 mb justify-center">
                            <button className="bg-primary px-2 py-1 rounded-md text-base-300 font-semibold" onClick={toggleModal}>
                                Contact
                            </button>
                            <button className="bg-primary px-2 py-1 rounded-md text-base-300 font-semibold" onClick={() => navigateToDetails(coach.id)}>
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal isVisible={isModalOpen} handleClose={toggleModal}>
                    <ContactForm 
                        toggleModal={toggleModal}
                    id={coach.id}
                    />
                </Modal>
            )}
        </div>
    );
}
