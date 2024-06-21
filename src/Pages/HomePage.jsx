import React, { useEffect, useState } from 'react';
import CardContainer from '../Components/CardContainer';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const Navigate = useNavigate();

    const [coachList, setCoachList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem('userRole');
    const idToken = localStorage.getItem('idToken');
    const islogin = !!idToken;

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await fetch(`${dburl}/account/.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                const coaches = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).filter(user => user.role === 'coach');
                setCoachList(coaches);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching coaches:', error);
                setError('An error occurred while fetching coaches. Please try again.');
                setLoading(false);
            }
        };

        fetchCoaches();
    }, [dburl]);

    const navigateToRegistration = () => {
        if (islogin) {
            Navigate('/CoachRegistration');
        } else {
            Navigate('/Login');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div id='BODY'>
            <div className="px-5">
                <div id="filter" className='border border-white px-5 py-1 '>
                    <div id="FILTER" className='text-2xl '>
                        <div className="font-semibold text-xl">Select Filter</div>
                        <div className="flex flex-col sm:flex-row sm:space-x-3">
                            <div className="flex items-center space-x-2 ">
                                <input type="checkbox" id="frontend" className="w-3 h-3" />
                                <label htmlFor="frontend" className='text-lg'>Front End</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="backend" className="w-3 h-3" />
                                <label htmlFor="backend" className='text-lg'>Back End</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="fullstack" className="w-3 h-3" />
                                <label htmlFor="fullstack" className='text-lg'>Full Stack</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div id='button' className="flex justify-between py-5">
                    <button className='btn btn-primary font-semibold text-white md:text-sm' 
                        onClick={() => { fetchCoaches() }}
                    >Refresh List</button>
                    {(role === 'user' || !role) && (
    <button className='btn btn-primary font-semibold text-white md:text-sm' onClick={navigateToRegistration}>
        {!islogin ? 'Login to Register as Coach' : 'Register as Coach'}
    </button>
)}

                </div>
            </div>

            <CardContainer coachList={coachList} />
        </div>
    );
}
