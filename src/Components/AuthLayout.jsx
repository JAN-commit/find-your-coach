import { LogoMark } from '../Logo';

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <main className="bg-paper">
            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
                <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
                    <div className="grid lg:grid-cols-[1fr_1.15fr]">
                        {/* Green brand panel — mirrors the public pages' green identity */}
                        <div className="relative flex flex-col justify-between gap-10 overflow-hidden bg-gradient-to-br from-accent via-accent to-accent-dark p-8 text-white sm:p-10">
                            <div
                                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/10"
                                aria-hidden="true"
                            />

                            <div className="relative flex items-center gap-3">
                                <LogoMark className="h-9 w-9 ring-1 ring-white/30" />
                                <div className="leading-tight">
                                    <p className="text-[15px] font-semibold tracking-tight">Coachmate</p>
                                    <p className="text-[10px] font-medium tracking-[0.16em] text-emerald-200/90">
                                        FIND YOUR COACH
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {title}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">{subtitle}</p>
                            </div>

                            <div className="relative flex items-center gap-2 text-xs font-medium text-emerald-100/90">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Browse and contact available coaches
                            </div>
                        </div>

                        {/* White form panel */}
                        <div className="flex items-center justify-center p-6 sm:p-10">
                            <div className="w-full max-w-sm">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}