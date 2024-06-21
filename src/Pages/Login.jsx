import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
        const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
        const payload = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        try {
            const response = await fetch(url + apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('expiresIn', data.expiresIn);
                localStorage.setItem('idToken', data.idToken);
                localStorage.setItem('localId', data.localId);

                // Fetch user role after successful login
                fetchUserRole(data.localId);
            } else {
                setError(data.error.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const fetchUserRole = async (localId) => {
        try {
            const response = await fetch(`https://find-your-coach-1be26-default-rtdb.firebaseio.com/account/${localId}.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const userData = await response.json();
            localStorage.setItem('userRole', userData.role); // Store user role in localStorage
            navigate('/');
        } catch (error) {
            console.error('Error fetching user role:', error);
            setError('An error occurred while fetching user role. Please try again.');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:w-[32rem]">
                <h1 className="text-3xl font-bold">Login now!</h1>
                <div className="text-center lg:text-left"></div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleLogin}>
                        <div className="form-control">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                required
                                autoComplete='off'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                required
                                autoComplete='off'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
                        </div>
                        <div className="text-right py-3 hover:text-blue-300 cursor-pointer" onClick={() => { navigate('/signup') }}>
                            Create an Account
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
