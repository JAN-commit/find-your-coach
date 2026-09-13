import { useNavigate } from 'react-router-dom';
import CoachBrowser from '../Components/CoachBrowser';

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
            <section className="page pb-12 pt-16 text-center sm:pt-20">
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

            <section id="coaches" className="page scroll-mt-24 pb-20">
                <CoachBrowser />
            </section>
        </main>
    );
}