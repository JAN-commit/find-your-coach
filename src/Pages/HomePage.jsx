import React, { useEffect, useState } from 'react';
import CardContainer from '../Components/CardContainer';
import { useNavigate } from 'react-router-dom';

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

                if (currentTime >= storedExpiryTime) {
                    localStorage.clear();
                    clearInterval(interval);
                    Navigate('/');
                }
            }, 1000);

            return () => clearInterval(interval);
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
            if (fullstack && coach.expertise.includes('Full Stack')) return true;
            if (backend && coach.expertise.includes('Back End')) return true;
            if (frontend && coach.expertise.includes('Front End')) return true;
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
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-opacity-75"></div>
            </div>
        );
    }

    return (
        <div id='BODY' className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            {/* Filter Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-2xl font-semibold text-center mb-4"> Filter Coaches</h2>
                <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-6 gap-3">
                    {["frontend", "backend", "fullstack"].map((filter) => (
                        <label key={filter} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id={filter}
                                checked={filters[filter]}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 accent-indigo-600 rounded-md"
                            />
                            <span className="capitalize">{filter.replace("fullstack", "Full Stack").replace("frontend", "Front End").replace("backend", "Back End")}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                <button
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow transition-all"
                    onClick={fetchCoaches}
                >
                     Refresh List
                </button>
                {(role === 'user' || !role) && (
                    <button
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow transition-all"
                        onClick={navigateToRegistration}
                    >
                        {!islogin ? ' Login to Register as Coach' : 'Register as Coach'}
                    </button>
                )}
            </div>

            {/* Coaches List */}
            <div className="mt-10">
                {filteredCoaches.length > 0 ? (
                    <CardContainer coachList={filteredCoaches} />
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        No coaches found. Try adjusting your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
