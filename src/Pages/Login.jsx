import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../Components/AuthLayout';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('idToken')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
        const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
        const payload = {
            email,
            password,
            returnSecureToken: true,
        };

        try {
            const response = await fetch(url + apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('expiresIn', data.expiresIn);
                localStorage.setItem('idToken', data.idToken);
                localStorage.setItem('localId', data.localId);
                localStorage.setItem('email', data.email);
                localStorage.setItem(
                    'userRole',
                    await fetchUserRole(data.localId)
                );

                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                setError('Invalid email or password.');
                toast.error('Please check your email and password.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRole = async (localId) => {
        const database = import.meta.env.VITE_FIREBASE_DB_URL;

        try {
            const response = await fetch(`${database}account/${localId}.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const userData = await response.json();
            return userData?.role || 'user';
        } catch (error) {
            console.error('Error fetching user role:', error);
            return 'user';
        }
    };

    return (
        <AuthLayout
            title="Log in to your Coachmate account"
            subtitle="Manage requests, browse coaches, and keep your profile fresh — all in one place."
        >
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                            placeholder="••••••••"
                            className="field pr-11"
                            required
                            autoComplete="current-password"
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

                <div className="mt-2 flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-neutral-600">
                        <input type="checkbox" className="h-4 w-4 rounded border-line text-accent focus:ring-accent/30" />
                        Remember me
                    </label>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] font-medium text-accent hover:text-accent-dark">
                        Forgot password?
                    </a>
                </div>

                <button type="submit" className="btn-main mt-2 w-full" disabled={loading}>
                    {loading ? 'Logging in…' : 'Log in'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Don&apos;t have an account?{' '}
                <button onClick={() => navigate('/Signup')} className="font-semibold text-accent hover:text-accent-dark">
                    Sign up
                </button>
            </p>
        </AuthLayout>
    );
}