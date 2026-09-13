import { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import ContactForm from '../Components/ContactForm';
import { useParams } from 'react-router-dom';

const initialsOf = (first, last) =>
    `${(first || '?').charAt(0)}${(last || '') ? last.charAt(0) : ''}`.toUpperCase();

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
            {icon}
        </span>
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
        </div>
    </div>
);

export default function CoachDetails() {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coach, setCoach] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoachData = async () => {
            const database = import.meta.env.VITE_FIREBASE_DB_URL;
            try {
                const response = await fetch(`${database}account/${id}.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const userData = await response.json();
                setCoach(userData);
            } catch (error) {
                console.error('Error fetching coach data:', error);
                setError('We could not load this coach. Please try again.');
            }
        };

        if (id) {
            fetchCoachData();
        }
    }, [id]);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    if (error) {
        return (
            <main className="page py-20 text-center">
                <p className="text-sm text-muted">{error}</p>
            </main>
        );
    }

    if (!coach) {
        return (
            <main className="page py-20">
                <div className="mx-auto animate-pulse">
                    <div className="h-40 rounded-2xl bg-neutral-200" />
                    <div className="mx-auto -mt-12 h-24 w-24 rounded-full bg-neutral-200 ring-4 ring-paper" />
                    <div className="mx-auto mt-5 h-5 w-1/3 rounded-full bg-neutral-200" />
                    <div className="mx-auto mt-2 h-3 w-1/4 rounded-full bg-neutral-100" />
                </div>
            </main>
        );
    }

    const expertise = coach.expertise || [];
    const rate = coach.hourlyRate;
    const experience = coach.yearsExperience;
    const location = coach.location;
    const website = coach.website;
    const fullName = `${coach.firstName} ${coach.lastName}`.trim() || 'Coach';

    return (
        <main className="pb-20">
            <div className="h-44 bg-gradient-to-br from-accent via-accent to-accent-dark sm:h-52" />

            <div className="page -mt-16 sm:-mt-20">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-accent-soft text-3xl font-semibold text-accent ring-4 ring-paper">
                            {initialsOf(coach.firstName, coach.lastName)}
                        </div>
                        <div className="pb-1">
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{fullName}</h1>
                            {coach.headline && (
                                <p className="mt-1 text-[15px] text-muted">{coach.headline}</p>
                            )}
                        </div>
                    </div>

                    <button onClick={toggleModal} className="btn-main w-full shrink-0 sm:w-auto !px-7">
                        Contact coach
                    </button>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                            <h2 className="text-lg font-semibold tracking-tight">About</h2>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {expertise.length > 0 ? (
                                    expertise.map((exp, index) => (
                                        <span key={index} className="tag">{exp}</span>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted">No areas added yet.</span>
                                )}
                            </div>
                            {coach.description ? (
                                <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-muted">
                                    {coach.description}
                                </p>
                            ) : (
                                <p className="mt-5 text-sm italic text-muted">
                                    This coach has not added a description yet.
                                </p>
                            )}
                        </section>
                    </div>

                    <aside>
                        <section className="space-y-4 rounded-2xl border border-line bg-surface p-6">
                            {rate && (
                                <InfoRow
                                    label="Rate"
                                    value={`$${rate} / hour`}
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 1v22" />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    }
                                />
                            )}
                            {experience != null && experience !== '' && (
                                <InfoRow
                                    label="Experience"
                                    value={`${experience} ${+experience === 1 ? 'year' : 'years'}`}
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="14" rx="2" />
                                            <path d="M8 21h8M12 18v3M2 10h20" />
                                        </svg>
                                    }
                                />
                            )}
                            {location && (
                                <InfoRow
                                    label="Based in"
                                    value={location}
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    }
                                />
                            )}
                            {website && (
                                <InfoRow
                                    label="Website"
                                    value={website.replace(/^https?:\/\//, '')}
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <path d="M15 3h6v6" />
                                            <path d="M10 14L21 3" />
                                        </svg>
                                    }
                                />
                            )}

                            <div className="border-t border-line pt-4">
                                <button onClick={toggleModal} className="btn-main w-full">
                                    Contact coach
                                </button>
                                {website && (
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 block rounded-lg border border-line bg-surface px-4 py-2 text-center text-sm font-semibold text-ink transition-colors hover:bg-neutral-50"
                                    >
                                        Visit website
                                    </a>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>

            {isModalOpen && (
                <Modal isVisible={isModalOpen} handleClose={toggleModal}>
                    <ContactForm toggleModal={toggleModal} id={id} />
                </Modal>
            )}
        </main>
    );
}