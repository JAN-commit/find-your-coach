import React, { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import ContactForm from '../Components/ContactForm';
import { useParams } from 'react-router-dom';

export default function CoachDetails() {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coach, setCoach] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchCoachData = async () => {
            const database = import.meta.env.VITE_FIREBASE_DB_URL
            try {
                const response = await fetch(`${database}account/${id}.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const userData = await response.json();
                setCoach(userData);
                // console.log(userData); 
            } catch (error) {
                console.error('Error fetching coach data:', error);
                setError('An error occurred while fetching coach data. Please try again.');
            }
        };

        if (id) {
            fetchCoachData();
        }
    }, [id]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div id="parent" className="max-w-4xl mx-auto p-4 sm:border rounded-lg shadow-md">
            {coach ? (
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="avatar rounded-xl overflow-hidden w-45 mb-4 md:mb-0 md:mr-4">
                        <img src="/Images/profilepic.jpg" alt="Profile" className="object-cover w-45 h-45" />
                    </div>

                    <div id="TEXT" className="flex-grow">
                        <div className="capitalize flex flex-col justify-between items-center mb-2 md:flex-row">
                            <h1 className="text-xl font-bold">{`${coach.firstName} ${coach.lastName}`}</h1>
                            <h1 className="text-xl font-bold">{}</h1>
                            <p className="text-lg">{coach.hourlyRate}/hour</p>
                        </div>
                        <div className="flex space-x-2 mb-4">
                            {coach.expertise.map((exp, index) => (
                                <button key={index} className="border px-1 py-1 rounded-md sm:px-2 sm:text-sm">{exp}</button>
                            ))}
                        </div>
                        <p className="text-justify mb-4">
                            {coach.description}
                        </p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                            onClick={toggleModal}
                        >
                            Contact Now
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {isModalOpen && (
                <Modal isVisible={isModalOpen} handleClose={toggleModal}>
                    <ContactForm />
                </Modal>
            )}
        </div>
    );
}
