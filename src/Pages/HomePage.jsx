import { useNavigate } from 'react-router-dom';
import CoachBrowser from '../Components/CoachBrowser';

const FEATURES = [
    {
        title: 'One-on-one sessions',
        description:
            'Work directly with a senior engineer focused entirely on your goals, your codebase, and your pace.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        title: 'Verified engineers',
        description:
            'Every coach publishes a real profile — experience, rates, and expertise you can review before you reach out.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        title: 'Progress you can measure',
        description:
            'Practical, project-based coaching that fits around your schedule and takes your craft to the next level.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
            </svg>
        ),
    },
];

const STEPS = [
    {
        number: '01',
        title: 'Browse & filter',
        description:
            'Search available coaches by expertise and read their profile, rates, and approach before you decide.',
    },
    {
        number: '02',
        title: 'Send a request',
        description:
            'Message the coach directly, share what you want to work on, and get a personal reply in your dashboard.',
    },
    {
        number: '03',
        title: 'Book your session',
        description:
            'Meet one-on-one to level up — sessions that fit your schedule and your specific goals.',
    },
];

export default function HomePage() {
    const Navigate = useNavigate();

    const navigateToRegistration = () => {
        const idToken = localStorage.getItem('idToken');
        Navigate(idToken ? '/CoachRegistration' : '/Login');
    };

    const scrollToCoaches = () => {
        document.getElementById('coaches')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main>
            <section className="page pb-16 pt-16 text-center sm:pt-20">
                <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Curated engineers, one-on-one sessions
                </p>
                <h1 className="mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                    Find the right coach for your next build.
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted">
                    Browse experienced engineers offering focused, private coaching — and take your
                    craft to the next level.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button onClick={scrollToCoaches} className="btn-main">
                        Browse coaches
                    </button>
                    <button onClick={navigateToRegistration} className="btn-secondary">
                        Become a coach
                    </button>
                </div>
            </section>

            <section className="page pb-20">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">Why Coachmate</p>
                    <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        Coaching designed around real builds.
                    </h2>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {FEATURES.map(feature => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-line bg-surface p-6"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                                {feature.icon}
                            </span>
                            <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y border-line bg-surface py-20">
                <div className="page">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">How it works</p>
                        <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                            From hello to leveled up in three steps.
                        </h2>
                    </div>

                    <ol className="mt-10 grid gap-4 sm:grid-cols-3">
                        {STEPS.map(step => (
                            <li
                                key={step.number}
                                className="relative rounded-2xl border border-line bg-paper p-6"
                            >
                                <span className="text-sm font-semibold text-accent">{step.number}</span>
                                <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="coaches" className="page scroll-mt-24 pb-20 pt-16">
                <CoachBrowser variant="home" />
            </section>

            <section className="page pb-24">
                <div className="rounded-3xl bg-ink px-6 py-12 text-center sm:px-12">
                    <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Ready to find your coach?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-neutral-300 sm:text-base">
                        Join Coachmate, browse qualified engineers, and start your first one-on-one
                        session this week.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <button onClick={scrollToCoaches} className="btn-main">
                            Browse coaches
                        </button>
                        <button
                            onClick={navigateToRegistration}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-800"
                        >
                            Become a coach
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}