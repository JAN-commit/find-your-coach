import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_META = {
    accepted: { label: 'Accepted', className: 'bg-accent-soft text-accent-dark' },
    declined: { label: 'Declined', className: 'bg-red-50 text-red-600' },
    pending: { label: 'Pending', className: 'bg-neutral-100 text-neutral-600' },
};

function StatCard({ label, value, to }) {
    const inner = (
        <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
    );
    return to ? (
        <Link to={to} className="block transition-colors hover:border-neutral-300 hover:shadow-lift">
            {inner}
        </Link>
    ) : (
        inner
    );
}

function CoachDashboard() {
    const [messages, setMessages] = useState([]);
    const [coach, setCoach] = useState(null);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
    const localId = localStorage.getItem('localId');
    const email = localStorage.getItem('email') || '';

    useEffect(() => {
        if (!localId) return;

        const fetchData = async () => {
            try {
                const [accountRes, messageRes] = await Promise.all([
                    fetch(`${dburl}/account/${localId}.json`),
                    fetch(`${dburl}/message/${localId}.json`),
                ]);

                if (accountRes.ok) {
                    setCoach(await accountRes.json());
                }

                if (messageRes.ok) {
                    const data = await messageRes.json();
                    setMessages(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
                }
            } catch (error) {
                console.error('Error fetching coach dashboard:', error);
            }
        };
        fetchData();
    }, [dburl, localId]);

    const firstName = coach?.firstName || email.split('@')[0] || 'coach';
    const pending = messages.filter(m => (m.status || 'pending') === 'pending').length;
    const accepted = messages.filter(m => m.status === 'accepted').length;
    const recent = messages.slice().reverse().slice(0, 3);

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">Coach dashboard</p>
                    <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        Welcome back, {firstName}
                    </h1>
                    <p className="mt-2 max-w-xl text-pretty text-base text-muted">
                        Manage your requests and keep your profile fresh so students can find you.
                    </p>
                </div>
                <Link to="/MessageRequest" className="btn-main shrink-0">
                    View requests
                </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard label="Pending requests" value={pending} to="/MessageRequest" />
                <StatCard label="Accepted" value={accepted} to="/MessageRequest" />
                <StatCard label="Active students" value={accepted} />
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <section className="rounded-2xl border border-line bg-surface p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight">Recent requests</h2>
                        <Link to="/MessageRequest" className="text-sm font-medium text-accent hover:text-accent-dark">
                            View all
                        </Link>
                    </div>

                    {recent.length === 0 ? (
                        <p className="mt-4 text-sm text-muted">
                            No requests yet. When students reach out, they will show up here.
                        </p>
                    ) : (
                        <div className="mt-3 divide-y divide-line">
                            {recent.map(message => {
                                const status = message.status || 'pending';
                                const meta = STATUS_META[status] || STATUS_META.pending;
                                return (
                                    <div key={message.id} className="flex items-center justify-between gap-3 py-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-500">
                                                {(message.email || '?').charAt(0).toUpperCase()}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{message.email || 'Unknown sender'}</p>
                                                <p className="truncate text-xs text-muted">{message.message || 'No message content'}</p>
                                            </div>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
                                            {meta.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
                    <h2 className="text-lg font-semibold tracking-tight">Your profile</h2>
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                            {(coach?.firstName || email || 'C').charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{email}</p>
                            <p className="text-xs text-muted">
                                {coach?.headline || 'No headline yet'}
                            </p>
                        </div>
                    </div>
                    {(coach?.expertise || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {coach.expertise.map((exp, i) => (
                                <span key={i} className="tag">{exp}</span>
                            ))}
                        </div>
                    )}
                    <p className="text-[13px] leading-relaxed text-muted">
                        {coach?.description ? coach.description.slice(0, 120) + (coach.description.length > 120 ? '…' : '') : 'Add a description so students know how you coach.'}
                    </p>
                    <Link to="/CoachRegistration" className="btn-secondary mt-auto w-full">
                        Edit profile
                    </Link>
                </section>
            </div>
        </>
    );
}

function UserDashboard() {
    const [coach, setCoach] = useState(null);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
    const localId = localStorage.getItem('localId');
    const email = localStorage.getItem('email') || '';

    useEffect(() => {
        if (!localId) return;

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${dburl}/account/${localId}.json`);
                if (response.ok) {
                    setCoach(await response.json());
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [dburl, localId]);

    const firstName = coach?.firstName || email.split('@')[0] || 'there';

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">Student dashboard</p>
                    <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        Welcome back, {firstName}
                    </h1>
                    <p className="mt-2 max-w-xl text-pretty text-base text-muted">
                        Ready to level up? Browse available coaches and book your first one-on-one session.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                    to="/Coaches"
                    className="flex flex-col gap-3 rounded-2xl border border-accent/30 bg-accent-soft/50 p-6 text-left transition-colors hover:border-accent/50"
                >
                    <h2 className="text-[15px] font-semibold">Browse coaches</h2>
                    <p className="text-[13px] leading-relaxed text-muted">
                        Explore qualified engineers and reach out to the right match for your build.
                    </p>
                    <span className="btn-main mt-auto w-full !py-2 !text-[13px]">Browse coaches</span>
                </Link>

                <Link
                    to="/CoachRegistration"
                    className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6 text-left transition-colors hover:border-neutral-300"
                >
                    <h2 className="text-[15px] font-semibold">Become a coach</h2>
                    <p className="text-[13px] leading-relaxed text-muted">
                        Share your experience, publish your profile, and start taking requests.
                    </p>
                    <span className="btn-secondary mt-auto w-full !py-2 !text-[13px]">Get started</span>
                </Link>
            </div>
        </>
    );
}

export default function Dashboard() {
    const role = localStorage.getItem('userRole');

    return (
        <main className="page pb-20 pt-10">
            {role === 'coach' ? <CoachDashboard /> : <UserDashboard />}
        </main>
    );
}