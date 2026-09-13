import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../Components/AuthLayout';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('idToken')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const payload = {
            email,
            password,
            returnSecureToken: true,
        };

        try {
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (response.ok) {
                await assignRole(data.localId, data.idToken);
                toast.success('Account created! Please log in.');
                navigate('/Login');
            } else {
                const reason =
                    data.error?.message === 'EMAIL_EXISTS'
                        ? 'An account with this email already exists.'
                        : 'Something went wrong. Please try again.';
                setError(reason);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const assignRole = async (localId, idToken) => {
        const userData = { role: 'user', email };

        const cleanDbUrl = dburl.endsWith('/') ? dburl.slice(0, -1) : dburl;

        try {
            const response = await fetch(
                `${cleanDbUrl}/account/${localId}.json?auth=${idToken}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error assigning role:', error);
        }
    };

    return (
        <AuthLayout
            title="Create your Coachmate account"
            subtitle="Join the community, browse experienced coaches, or publish a profile and start taking requests."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                )}

                <div>
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="field"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label" htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 6 characters"
                            className="field pr-11"
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-400 hover:text-accent"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.387 4.398A9.953 9.953 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.078-2.03" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-main mt-2 w-full" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Already have an account?{' '}
                <button onClick={() => navigate('/Login')} className="font-semibold text-accent hover:text-accent-dark">
                    Log in
                </button>
            </p>
        </AuthLayout>
    );
}