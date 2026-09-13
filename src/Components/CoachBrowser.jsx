import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContainer from './CardContainer';

export default function CoachBrowser() {
    const Navigate = useNavigate();

    const [coachList, setCoachList] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
    const islogin = !!localStorage.getItem('idToken');
    const role = localStorage.getItem('userRole');

    const fetchCoaches = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${dburl}/account/.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();

            const coaches = (data ? Object.keys(data) : [])
                .map(key => ({
                    id: key,
                    ...data[key]
                }))
                .filter(user => user.role === 'coach');

            setCoachList(coaches);
            setError(null);
        } catch (error) {
            console.error('Error fetching coaches:', error);
            setError('We could not load coaches right now. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [dburl]);

    useEffect(() => {
        fetchCoaches();
    }, [fetchCoaches]);

    const expertiseFilters = useMemo(() => {
        const seen = new Set();
        coachList.forEach(coach =>
            (coach.expertise || []).forEach(exp => {
                const value = String(exp).trim();
                if (value) seen.add(value);
            })
        );
        return Array.from(seen);
    }, [coachList]);

    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        let filtered = coachList;

        if (activeFilters.length > 0) {
            filtered = filtered.filter(coach =>
                activeFilters.some(filter =>
                    (coach.expertise || []).includes(filter)
                )
            );
        }

        if (term) {
            filtered = filtered.filter(coach => {
                const haystack = [
                    coach.firstName,
                    coach.lastName,
                    coach.headline,
                    coach.description,
                    coach.location,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return haystack.includes(term);
            });
        }

        setFilteredCoaches(filtered);
    }, [activeFilters, coachList, searchTerm]);

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const navigateToRegistration = () => {
        if (islogin) {
            Navigate('/CoachRegistration');
        } else {
            Navigate('/Login');
        }
    };

    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Available coaches</h2>
                    {!loading && (
                        <p className="mt-0.5 text-sm text-muted">
                            {filteredCoaches.length} {filteredCoaches.length === 1 ? 'match' : 'matches'}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={fetchCoaches}
                        className="btn-secondary !px-3.5 !py-2 !text-[13px]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                            <path d="M21 3v6h-6" />
                        </svg>
                        Refresh
                    </button>
                    {!islogin || role !== 'coach' ? (
                        <button
                            onClick={navigateToRegistration}
                            className="btn-main !px-3.5 !py-2 !text-[13px]"
                        >
                            + Join as coach
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {expertiseFilters.length > 0 && (
                        <>
                            <span className="mr-1 text-[13px] font-medium text-neutral-500">Filter:</span>
                            {expertiseFilters.map(filter => {
                                const active = activeFilters.includes(filter);
                                return (
                                    <button
                                        key={filter}
                                        onClick={() => toggleFilter(filter)}
                                        className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                                            active
                                                ? 'border-ink bg-ink text-white'
                                                : 'border-line bg-surface text-neutral-600 hover:border-neutral-300'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>

                <div className="relative w-full sm:w-64">
                    <svg
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search coaches…"
                        className="field !py-2 pl-9"
                    />
                </div>
            </div>

            <div>
                {loading ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex h-44 animate-pulse flex-col gap-3 rounded-xl border border-line bg-surface p-5">
                                <div className="h-3 w-3/4 rounded-full bg-neutral-200" />
                                <div className="h-3 w-1/2 rounded-full bg-neutral-200" />
                                <div className="mt-auto h-3 w-full rounded-full bg-neutral-100" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center">
                        <p className="text-sm text-muted">{error}</p>
                        <button onClick={fetchCoaches} className="btn-secondary mt-4">
                            Try again
                        </button>
                    </div>
                ) : filteredCoaches.length > 0 ? (
                    <CardContainer coachList={filteredCoaches} />
                ) : (
                    <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center">
                        <p className="text-sm text-muted">No coaches match your filters.</p>
                        <button
                            onClick={() => {
                                setActiveFilters([]);
                                setSearchTerm('');
                            }}
                            className="btn-main mt-4"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}