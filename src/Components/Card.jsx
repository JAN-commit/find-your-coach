import { useState } from 'react';
import Modal from './Modal';
import ContactForm from './ContactForm';
import { useNavigate } from 'react-router-dom';

const initialsOf = (first, last) =>
    `${(first || '?').charAt(0)}${(last || '') ? last.charAt(0) : ''}`.toUpperCase();

export default function Card({ coach }) {
    const Navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const navigateToDetails = () => {
        Navigate(`/CoachDetails/${coach.id}`);
    };

    const expertise = coach.expertise || [];
    const hasLocation = !!coach.location;

    return (
        <>
            <article className="coach-card">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                            {initialsOf(coach.firstName, coach.lastName)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-[15px] font-semibold leading-tight">
                                {coach.firstName} {coach.lastName}
                            </h3>
                            <p className="mt-0.5 truncate text-xs text-muted">
                                {coach.headline || expertise.join(' · ') || 'Software Engineer'}
                            </p>
                        </div>
                    </div>
                    {coach.hourlyRate && (
                        <span className="shrink-0 text-sm font-semibold">
                            ${coach.hourlyRate}
                            <span className="text-xs font-normal text-muted">/hr</span>
                        </span>
                    )}
                </div>

                {coach.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                        {coach.description}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                    {expertise.map((exp, index) => (
                        <span key={index} className="tag">{exp}</span>
                    ))}
                    {hasLocation && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {coach.location}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex gap-2 pt-1">
                    <button className="btn-main flex-1 !px-3 !py-2 !text-[13px]" onClick={toggleModal}>
                        Contact
                    </button>
                    <button className="btn-secondary flex-1 !px-3 !py-2 !text-[13px]" onClick={navigateToDetails}>
                        Profile
                    </button>
                </div>
            </article>

            {isModalOpen && (
                <Modal isVisible={isModalOpen} handleClose={toggleModal}>
                    <ContactForm toggleModal={toggleModal} id={coach.id} />
                </Modal>
            )}
        </>
    );
}