import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContainer from './CardContainer';

const PAGE_SIZE = 6;

function getPageNumbers(current, total) {
    if (total <= 1) return [];
    const pages = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - current) <= 1) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '…') {
            pages.push('…');
        }
    }
    return pages;
}

const ChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const ArrowRight = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default function CoachBrowser({ variant = 'full', pageSize = PAGE_SIZE }) {
    const isHome = variant === 'home';
    const Navigate = useNavigate();

    const [coachList, setCoachList] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

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

    const expertiseCounts = useMemo(() => {
        const counts = {};
        coachList.forEach(coach =>
            (coach.expertise || []).forEach(exp => {
                const value = String(exp).trim();
                if (value) counts[value] = (counts[value] || 0) + 1;
            })
        );
        return counts;
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

    useEffect(() => {
        setPage(1);
    }, [activeFilters, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredCoaches.length / pageSize));

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const start = (page - 1) * pageSize;
    const pageItems = isHome
        ? filteredCoaches.slice(0, pageSize)
        : filteredCoaches.slice(start, start + pageSize);

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const clearAll = () => {
        setActiveFilters([]);
        setSearchTerm('');
    };

    const navigateToRegistration = () => {
        if (islogin) {
            Navigate('/CoachRegistration');
        } else {
            Navigate('/Login');
        }
    };

    const goToCoaches = () => {
        Navigate(islogin ? '/Coaches' : '/Login');
    };

    return (
        <section className="flex flex-col gap-5">
            {isHome ? (
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                            Available coaches
                        </p>
                        <h2 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                            Meet the engineers ready to mentor you.
                        </h2>
                        {!loading && (
                            <p className="mt-2 text-sm text-muted">
                                {filteredCoaches.length}{' '}
                                {filteredCoaches.length === 1 ? 'coach' : 'coaches'} ready to help.
                            </p>
                        )}
                    </div>
                    <button onClick={goToCoaches} className="btn-secondary shrink-0">
                        View all coaches
                        <ArrowRight />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                    {!loading && (
                        <p className="text-sm text-muted">
                            {filteredCoaches.length}{' '}
                            {filteredCoaches.length === 1 ? 'match' : 'matches'}
                        </p>
                    )}

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
            )}

            {!isHome && (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0 text-[13px] font-medium text-neutral-500">Filter:</span>
                        {expertiseFilters.length > 0 ? (
                            <div className="no-scrollbar -mb-1 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
                                {expertiseFilters.map(filter => {
                                    const active = activeFilters.includes(filter);
                                    const count = expertiseCounts[filter];
                                    return (
                                        <button
                                            key={filter}
                                            onClick={() => toggleFilter(filter)}
                                            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                                                active
                                                    ? 'border-ink bg-ink text-white'
                                                    : 'border-line bg-surface text-neutral-600 hover:border-neutral-300'
                                            }`}
                                        >
                                            {filter}
                                            <span
                                                className={`ml-1.5 ${
                                                    active ? 'text-white/60' : 'text-neutral-400'
                                                }`}
                                            >
                                                {count ?? 0}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="text-sm text-muted">No expertise tags yet.</span>
                        )}
                        {activeFilters.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="shrink-0 text-[13px] font-medium text-accent hover:text-accent-dark"
                            >
                                Clear ({activeFilters.length})
                            </button>
                        )}
                    </div>

                    <div className="relative w-full shrink-0 lg:w-64">
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
            )}

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
                ) : pageItems.length > 0 ? (
                    <>
                        <CardContainer coachList={pageItems} />

                        {!isHome && totalPages > 1 && (
                            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
                                <p className="text-[13px] text-muted">
                                    Showing{' '}
                                    <span className="font-medium text-ink">{start + 1}–{start + pageItems.length}</span>{' '}
                                    of{' '}
                                    <span className="font-medium text-ink">{filteredCoaches.length}</span> coaches
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="pagination-btn"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft />
                                        Prev
                                    </button>

                                    {getPageNumbers(page, totalPages).map((p, i) =>
                                        p === '…' ? (
                                            <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted">
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                aria-label={`Go to page ${p}`}
                                                className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors duration-150 ${
                                                    p === page
                                                        ? 'bg-ink text-white'
                                                        : 'border border-line bg-surface text-neutral-600 hover:border-neutral-300 hover:text-ink'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="pagination-btn"
                                        aria-label="Next page"
                                    >
                                        Next
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center">
                        <p className="text-sm text-muted">No coaches match your filters.</p>
                        <button onClick={clearAll} className="btn-main mt-4">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}