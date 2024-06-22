import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CoachRegistration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [expertise, setExpertise] = useState([]);

    const navigate = useNavigate(); // Correct usage of useNavigate from react-router-dom

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            if (value === 'Full Stack') {
                // If Full Stack is checked, clear Front End and Back End selections
                setExpertise(['Full Stack']);
            } else if (value === 'Front End' && expertise.includes('Back End')) {
                // If Front End is checked and Back End is already selected, select Full Stack
                setExpertise(['Full Stack']);
            } else if (value === 'Back End' && expertise.includes('Front End')) {
                // If Back End is checked and Front End is already selected, select Full Stack
                setExpertise(['Full Stack']);
            } else {
                // Otherwise, add the expertise to the array
                setExpertise((prevExpertise) => [...prevExpertise, value]);
            }
        }
        else {
            // If checkbox is unchecked, remove it from expertise
            setExpertise((prevExpertise) => prevExpertise.filter(expertise => expertise !== value));
        }
    };



    const Register_as_Coach = async (e) => {
        e.preventDefault();
        if (expertise.length === 0) {
            alert('Please select at least one expertise.');
            return;
        }
        const localId = localStorage.getItem('localId');
        const coachData = {
            role: 'coach',
            firstName,
            lastName,
            description,
            hourlyRate,
            expertise,
        };

        try {
            const response = await fetch(`${dburl}/account/${localId}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coachData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            console.log("Coach profile successfully updated:", data);
            localStorage.setItem('userRole', 'coach');

            navigate('/');
        } catch (error) {
            console.error("Error updating coach profile:", error);
        }
    };

    return (
        <div id="parent" className='flex flex-col justify-center'>
            <div className="form-control w-full max-w-xs md:max-w-xl mx-auto">
                <form onSubmit={Register_as_Coach}>
                    <div className="label">
                        <span className="label-text">First Name </span>
                    </div>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input input-bordered w-full"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />

                    <div className="label">
                        <span className="label-text">Last Name</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input input-bordered w-full"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />

                    <div className="label">
                        <span className="label-text">Description</span>
                    </div>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className="label">
                        <span className="label-text">Hourly Rate</span>
                    </div>
                    <input
                        type="number"
                        placeholder="Hourly Rate"
                        className="input input-bordered w-full"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        required
                    />

                    <div className="py-3">
                        <h2>Area of Expertise</h2>
                        <div className="flex flex-row space-x-3 py-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="frontend"
                                    value="Front End"
                                    className="w-4 h-4"
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="frontend">Front End</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="backend"
                                    value="Back End"
                                    className="w-4 h-4"
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="backend">Back End</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="fullstack"
                                    value="Full Stack"
                                    className="w-4 h-4"
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="fullstack">Full Stack</label>
                            </div>
                        </div>
                    </div>

                    <button type='submit' className='btn btn-primary text-black font-semibold w-full'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
