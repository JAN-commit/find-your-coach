import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EXPERTISE_OPTIONS = [
    { key: 'frontend', value: 'Front End', label: 'Front End' },
    { key: 'backend', value: 'Back End', label: 'Back End' },
    { key: 'fullstack', value: 'Full Stack', label: 'Full Stack' },
];

const EXPERTISE_SUGGESTIONS = [
    'React', 'Vue', 'Node.js', 'TypeScript', 'Python', 'Machine Learning',
    'DevOps', 'Cloud (AWS)', 'Mobile (React Native)', 'UI/UX', 'Testing',
    'Security', 'Databases', 'Systems Design',
];

const STEPS = [
    { label: 'Basics' },
    { label: 'Details' },
    { label: 'About' },
    { label: 'Expertise' },
];

function Stepper({ current }) {
    return (
        <ol className="flex items-center gap-2 sm:gap-3">
            {STEPS.map((step, index) => {
                const done = index < current;
                const active = index === current;
                return (
                    <li key={step.label} className="flex flex-1 items-center gap-2 sm:gap-3">
                        <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150 ${
                                done
                                    ? 'bg-accent text-white'
                                    : active
                                        ? 'bg-accent-soft text-accent ring-2 ring-accent/30'
                                        : 'bg-neutral-100 text-neutral-400'
                            }`}
                        >
                            {done ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </span>
                        <span className={`text-[13px] font-medium ${active ? 'text-ink' : 'text-muted'}`}>
                            {step.label}
                        </span>
                        {index < STEPS.length - 1 && <span className={`hidden h-px flex-1 sm:block ${done ? 'bg-accent' : 'bg-line'}`} />}
                    </li>
                );
            })}
        </ol>
    );
}

export default function CoachRegistration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [headline, setHeadline] = useState('');
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [yearsExperience, setYearsExperience] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [expertise, setExpertise] = useState([]);
    const [expertiseDraft, setExpertiseDraft] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isCoach, setIsCoach] = useState(false);
    const [step, setStep] = useState(0);

    const navigate = useNavigate();
    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
    const localId = localStorage.getItem('localId');

    useEffect(() => {
        const idToken = localStorage.getItem('idToken');
        if (!idToken) {
            navigate('/Login');
            return;
        }

        if (localStorage.getItem('userRole') !== 'coach') {
            return;
        }

        setIsCoach(true);
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${dburl}/account/${localId}.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                if (data) {
                    setFirstName(data.firstName || '');
                    setLastName(data.lastName || '');
                    setHeadline(data.headline || '');
                    setDescription(data.description || '');
                    setHourlyRate(data.hourlyRate || '');
                    setYearsExperience(data.yearsExperience || '');
                    setLocation(data.location || '');
                    setWebsite(data.website || '');
                    setExpertise(data.expertise || []);
                }
            } catch (error) {
                console.error('Error fetching coach profile:', error);
            }
        };
        fetchProfile();
    }, [dburl, localId, navigate]);

    const toggleExpertise = (value) => {
        setExpertise(prev => {
            if (value === 'Full Stack') {
                return prev.includes('Full Stack') ? [] : ['Full Stack'];
            }
            const next = prev.filter(exp => exp !== value);
            if (next.length === prev.length) {
                return [...prev, value];
            }
            return next;
        });
    };

    const addCustomExpertise = () => {
        const value = expertiseDraft.trim();
        if (!value) return;
        if (expertise.some(exp => exp.toLowerCase() === value.toLowerCase())) {
            setExpertiseDraft('');
            return;
        }
        setExpertise(prev => [...prev, value]);
        setExpertiseDraft('');
    };

    const validateStep = (index) => {
        if (index === 0) {
            if (!firstName.trim() || !lastName.trim()) {
                toast.error('Please fill in your first and last name.');
                return false;
            }
        }
        if (index === 1) {
            if (!headline.trim()) {
                toast.error('Please add a headline.');
                return false;
            }
            if (hourlyRate === '' || +hourlyRate < 0) {
                toast.error('Please set your hourly rate.');
                return false;
            }
            if (yearsExperience === '' || +yearsExperience < 0) {
                toast.error('Please add your years of experience.');
                return false;
            }
            if (!location.trim()) {
                toast.error('Please add where you are based.');
                return false;
            }
        }
        if (index === 2) {
            if (!description.trim()) {
                toast.error('Please write a short description about yourself.');
                return false;
            }
        }
        if (index === 3) {
            if (expertise.length === 0) {
                toast.error('Please select at least one area of expertise.');
                return false;
            }
        }
        return true;
    };

    const goNext = () => {
        if (!validateStep(step)) return;
        setStep(s => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => setStep(s => Math.max(s - 1, 0));

    const Register_as_Coach = async (e) => {
        e?.preventDefault?.();
        // Only publish from the final step — never submit early (e.g. Enter key on earlier sections)
        if (step !== STEPS.length - 1) return;
        if (!validateStep(step)) return;

        setSubmitting(true);
        const idToken = localStorage.getItem('idToken');
        const coachData = {
            role: 'coach',
            firstName,
            lastName,
            headline,
            description,
            hourlyRate,
            yearsExperience,
            location,
            website,
            expertise,
        };

        const cleanDbUrl = dburl.endsWith('/') ? dburl.slice(0, -1) : dburl;

        try {
            const response = await fetch(`${cleanDbUrl}/account/${localId}.json?auth=${idToken}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(coachData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            toast.success(isCoach ? 'Profile updated successfully!' : 'Coach profile published successfully!');
            localStorage.setItem('userRole', 'coach');
            navigate(`/CoachDetails/${localId}`);
        } catch (error) {
            console.error('Error updating coach profile:', error);
            toast.error('Could not save your profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="page py-10 pb-20">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {isCoach ? 'Edit your profile' : 'Become a coach'}
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        {isCoach
                            ? 'Keep your profile up to date so students can find you.'
                            : 'A complete profile helps the right students find you. Fill it in step by step.'}
                    </p>
                </div>

                <div className="mb-8 rounded-2xl border border-line bg-surface p-5">
                    <Stepper current={step} />
                </div>

                <form
                    onSubmit={Register_as_Coach}
                    onKeyDown={(e) => {
                        // Prevent Enter from submitting the form early outside the final step
                        if (e.key === 'Enter' && step < STEPS.length - 1) {
                            e.preventDefault();
                        }
                    }}
                    className="rounded-2xl border border-line bg-surface p-6"
                >
                    {step === 0 && (
                        <section className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">About you</h2>
                                <p className="mt-1 text-sm text-muted">
                                    Start with your name — this is how students will recognize you.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="label" htmlFor="firstName">First name <span className="text-red-500">*</span></label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="Jane"
                                        className="field"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label" htmlFor="lastName">Last name <span className="text-red-500">*</span></label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        className="field"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {step === 1 && (
                        <section className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">Professional details</h2>
                                <p className="mt-1 text-sm text-muted">
                                    Tell students what you do, where, and at what rate.
                                </p>
                            </div>

                            <div>
                                <label className="label" htmlFor="headline">Headline <span className="text-red-500">*</span></label>
                                <input
                                    id="headline"
                                    type="text"
                                    placeholder="Senior Front End Engineer"
                                    className="field"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="label" htmlFor="rate">Hourly rate (USD) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
                                        <input
                                            id="rate"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className="field pl-8"
                                            value={hourlyRate}
                                            onChange={(e) => setHourlyRate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label" htmlFor="yearsExperience">Years of exp. <span className="text-red-500">*</span></label>
                                    <input
                                        id="yearsExperience"
                                        type="number"
                                        min="0"
                                        placeholder="5"
                                        className="field"
                                        value={yearsExperience}
                                        onChange={(e) => setYearsExperience(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label" htmlFor="location">Based in <span className="text-red-500">*</span></label>
                                    <input
                                        id="location"
                                        type="text"
                                        placeholder="Manila, PH"
                                        className="field"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label" htmlFor="website">Website / social link</label>
                                <input
                                    id="website"
                                    type="url"
                                    placeholder="https://github.com/janedoe"
                                    className="field"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>
                        </section>
                    )}

                    {step === 2 && (
                        <section className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">About you</h2>
                                <p className="mt-1 text-sm text-muted">
                                    Share your experience, specialties, and how you like to coach.
                                </p>
                            </div>
                            <div>
                                <label className="label" htmlFor="description">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    id="description"
                                    className="field min-h-40 resize-none"
                                    placeholder="Share your experience, specialties, and how you like to coach…"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </section>
                    )}

                    {step === 3 && (
                        <section className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">Areas of expertise</h2>
                                <p className="mt-1 text-sm text-muted">
                                    Pick what you can coach on — this is the last step before publishing.
                                </p>
                            </div>

                            <div>
                                <span className="label">Main category</span>
                                <div className="flex flex-wrap gap-2">
                                    {EXPERTISE_OPTIONS.map(option => {
                                        const active = expertise.includes(option.value);
                                        return (
                                            <button
                                                key={option.key}
                                                type="button"
                                                onClick={() => toggleExpertise(option.value)}
                                                className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                                                    active
                                                        ? 'border-ink bg-ink text-white'
                                                        : 'border-line bg-white text-neutral-600 hover:border-neutral-300'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <span className="label">Custom skills</span>
                                <div className="flex flex-wrap gap-2">
                                    {expertise
                                        .filter(exp => !EXPERTISE_OPTIONS.some(o => o.value === exp))
                                        .map(exp => (
                                            <button
                                                key={exp}
                                                type="button"
                                                onClick={() => toggleExpertise(exp)}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent-soft px-4 py-1.5 text-[13px] font-medium text-accent-dark"
                                            >
                                                {exp}
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                    <path d="M6 6l12 12M18 6L6 18" />
                                                </svg>
                                            </button>
                                        ))}
                                    {expertise.filter(exp => !EXPERTISE_OPTIONS.some(o => o.value === exp)).length === 0 && (
                                        <span className="text-sm text-muted">No custom skills added yet.</span>
                                    )}
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <input
                                        type="text"
                                        value={expertiseDraft}
                                        onChange={(e) => setExpertiseDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomExpertise();
                                            }
                                        }}
                                        placeholder="Add your own, e.g. React Native"
                                        className="field !py-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomExpertise}
                                        className="btn-secondary shrink-0 !px-4 !py-2 !text-[13px]"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted">Suggestions</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {EXPERTISE_SUGGESTIONS.map(suggestion => {
                                        const active = expertise.some(
                                            exp => exp.toLowerCase() === suggestion.toLowerCase()
                                        );
                                        if (active) return null;
                                        return (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => toggleExpertise(suggestion)}
                                                className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
                                            >
                                                + {suggestion}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
                        {step > 0 ? (
                            <button type="button" onClick={goBack} className="btn-secondary">
                                Back
                            </button>
                        ) : (
                            <span />
                        )}

                        {step < STEPS.length - 1 ? (
                            <button type="button" onClick={goNext} className="btn-main min-w-[140px]">
                                Continue
                            </button>
                        ) : (
                            <button type="button" onClick={() => Register_as_Coach()} className="btn-main min-w-[160px]" disabled={submitting}>
                                {submitting ? 'Saving…' : (isCoach ? 'Update profile' : 'Publish profile')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}