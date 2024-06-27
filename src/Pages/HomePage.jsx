import React, { useEffect, useState } from 'react';
import CardContainer from '../Components/CardContainer';
import { useNavigate } from 'react-router-dom';
import Modal from '../Components/Modal';

export default function HomePage() {
    const Navigate = useNavigate();

    const [coachList, setCoachList] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        frontend: false,
        backend: false,
        fullstack: false,
    });


    useEffect(() => {
        const idToken = localStorage.getItem('idToken');

        if (idToken) {
            const interval = setInterval(() => {
                const currentTime = new Date();
                const storedExpiryTime = new Date(localStorage.getItem('expiresIn'));
                // const storedExpiryTime = new Date(500);

                if (currentTime >= storedExpiryTime) {
                    localStorage.clear();
                    clearInterval(interval);
                   // alert("Session Expired. Please Login Again");
                   Navigate('/');
                }
            }, 1000);

            // Clean up interval on component unmount or when dependency changes
            return () => clearInterval(interval);
        } else {
           // Navigate('/login');

            
        }
    }, []);

    const role = localStorage.getItem('userRole');
    const idToken = localStorage.getItem('idToken');
    const islogin = !!idToken;

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

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

    useEffect(() => {
        fetchCoaches();
    }, [dburl]);

    useEffect(() => {
        filterCoaches();
    }, [filters, coachList]);

    const filterCoaches = () => {
        const { frontend, backend, fullstack } = filters;
        if (!frontend && !backend && !fullstack) {
            setFilteredCoaches(coachList);
            return;
        }

        const filtered = coachList.filter(coach => {
            if (fullstack && coach.expertise.includes('Full Stack')) {
                return true;
            } else if (backend && coach.expertise.includes('Back End')) {
                return true;
            } else if (frontend && coach.expertise.includes('Front End')) {
                return true;
            }
            return false;
        });


        setFilteredCoaches(filtered);
    };

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;

        setFilters(prevFilters => ({
            ...prevFilters,
            [id]: checked
        }));
    };

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
                <div id="filter" className='border border-white rounded-2xl px-5 py-1 text-center'>
                    <div id="FILTER" className='text-2xl py-4'>
                        <div className="font-bold text-xl pb-2">Select Filter</div>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 justify-center">
                            <div className="flex items-center space-x-2 ">
                                <input type="checkbox" id="frontend" className="w-3 h-3" onChange={handleCheckboxChange} />
                                <label htmlFor="frontend" className='text-lg'>Front End</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="backend" className="w-3 h-3" onChange={handleCheckboxChange} />
                                <label htmlFor="backend" className='text-lg'>Back End</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="fullstack" className="w-3 h-3" onChange={handleCheckboxChange} />
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

            <CardContainer coachList={filteredCoaches} />
        </div>
    );
}
