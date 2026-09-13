import { Navigate } from 'react-router-dom';
import CoachBrowser from '../Components/CoachBrowser';

export default function Coaches() {
    if (localStorage.getItem('userRole') === 'coach') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <main className="page pb-20 pt-10">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Explore</p>
                <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                    Available coaches
                </h1>
                <p className="mt-2 max-w-xl text-pretty text-base text-muted">
                    Browse qualified engineers and contact the right match for your build.
                </p>
            </div>

            <CoachBrowser />
        </main>
    );
}