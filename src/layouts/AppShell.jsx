import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../Header';
import Footer from '../Footer';
import { LogoMark } from '../Logo';
import { getNavItems } from '../nav';

const AUTH_PAGES = ['/Login', '/Signup'];

// Icons — thin stroke to match site style
const ICONS = {
    dashboard: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    ),
    coaches: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    requests: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
    ),
    register: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
    ),
    members: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    shield: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    ),
    clipboard: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="m9 14 2 2 4-4" />
        </svg>
    ),
    audit: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    settings: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 9 15a1.65 1.65 0 0 0-1-1.51V13a1.65 1.65 0 0 0 1-1.51A1.65 1.65 0 0 0 7.18 9.67l-.06-.06A2 2 0 1 1 9.95 6.78l.06.06A1.65 1.65 0 0 0 11.83 7.18 1.65 1.65 0 0 0 12.83 6V6a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 22.54 9.95l-.06.06A1.65 1.65 0 0 0 19.4 12v3Z" />
        </svg>
    ),
    profile: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    logout: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
};

function getHeaderMeta(pathname) {
    if (pathname.startsWith('/dashboard')) return { title: 'Dashboard', subtitle: 'Find and connect with your next coach', icon: 'dashboard' };
    if (pathname.startsWith('/Coaches')) return { title: 'Coaches', subtitle: 'Browse and contact available coaches', icon: 'coaches' };
    if (pathname.startsWith('/MessageRequest')) return { title: 'Requests', subtitle: 'Manage incoming coaching requests', icon: 'requests' };
    if (pathname.startsWith('/CoachRegistration')) return { title: 'Profile', subtitle: 'Manage your coaching profile', icon: 'profile' };
    return { title: 'Dashboard', subtitle: 'Find and connect with your next coach', icon: 'dashboard' };
}

const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
        isActive
            ? 'bg-accent text-white shadow-[0_4px_18px_rgba(15,110,76,0.28)]'
            : 'text-neutral-500 hover:bg-accent-soft/60 hover:text-ink'
    }`;

function SidebarContent({ onNavigate, onLogout, email }) {
    const role = localStorage.getItem('userRole');
    const items = getNavItems(role);

    // Group items to mimic screenshot sections
    const overviewItems = items.filter((i) => i.to !== '/CoachRegistration');
    // ensure dashboard always first
    const accountItems = items.filter((i) => i.to === '/CoachRegistration');

    return (
        <>
            {/* Logo / Brand */}
            <div className="flex h-[64px] shrink-0 items-center gap-3 border-b border-line px-5">
                <LogoMark className="h-8 w-8" />
                <div className="leading-tight">
                    <p className="text-[13px] font-semibold tracking-tight text-ink">Coachmate</p>
                    <p className="text-[10px] font-medium tracking-[0.14em] text-muted">FIND YOUR COACH</p>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-3">
                <div className="flex flex-col gap-4">
                    {/* OVERVIEW */}
                    <div>
                        <p className="px-3 text-[10px] font-semibold tracking-[0.14em] text-muted">OVERVIEW</p>
                        <nav className="mt-3 flex flex-col gap-1">
                            {overviewItems.map((item) => (
                                <NavLink key={item.to} to={item.to} onClick={onNavigate} className={navLinkClass}>
                                    {ICONS[item.icon] || ICONS.dashboard}
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* ACCOUNT */}
                    <div>
                        <p className="px-3 text-[10px] font-semibold tracking-[0.14em] text-muted">ACCOUNT</p>
                        <nav className="mt-3 flex flex-col gap-1">
                            {accountItems.map((item) => (
                                <NavLink key={item.to} to={item.to} onClick={onNavigate} className={navLinkClass}>
                                    {ICONS[item.icon] || ICONS.profile}
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="mt-2 flex flex-col gap-3">
                    <div className="border-t border-line pt-2">
                        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                                {(email || '?').charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-neutral-600">{email || 'Your account'}</p>
                                <p className="text-[11px] text-muted capitalize">{role || 'user'}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                        {ICONS.logout}
                        Sign Out
                    </button>
                    <p className="px-3 text-[10px] font-medium text-neutral-400">v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '2.0.0'}</p>
                </div>
            </div>
        </>
    );
}

export default function AppShell({ children }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isAuthed = !!localStorage.getItem('idToken');
    const email = localStorage.getItem('email') || null;
    const isAuthPage = AUTH_PAGES.includes(pathname);
    const [mobileOpen, setMobileOpen] = useState(false);
    const meta = getHeaderMeta(pathname);

    const Logout = () => {
        localStorage.clear();
        toast.success('Logged out successfully');
        setMobileOpen(false);
        navigate('/');
    };

    // Unauthenticated or auth pages: keep original light header + footer
    if (!isAuthed || isAuthPage) {
        return (
            <div className="flex min-h-dvh flex-col">
                <Header />
                <div className="flex-1">{children}</div>
                {!isAuthed && !isAuthPage && <Footer />}
            </div>
        );
    }

    // Authenticated app layout — white & green theme matching the public pages
    return (
        <div className="min-h-dvh bg-paper">
            <div className="flex min-h-dvh">
                {/* Desktop Sidebar */}
                <aside className="sticky top-0 hidden h-dvh w-[260px] shrink-0 flex-col border-r border-line bg-white lg:flex">
                    <SidebarContent onNavigate={() => {}} onLogout={Logout} email={email} />
                </aside>

                {/* Mobile Sidebar Overlay */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 flex lg:hidden">
                        <button
                            aria-label="Close menu"
                            onClick={() => setMobileOpen(false)}
                            className="flex-1 bg-black/40 backdrop-blur-sm"
                        />
                        <aside className="flex w-[280px] flex-col border-l border-line bg-white">
                            <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={Logout} email={email} />
                        </aside>
                    </div>
                )}

                {/* Main Column */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Top Header Bar */}
                    <header className="sticky top-0 z-20 flex h-[64px] shrink-0 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur-md lg:px-6">
                        {/* Left: mobile menu + page title */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-neutral-500 lg:hidden"
                                aria-label="Open menu"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                </svg>
                            </button>

                            <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-[0_4px_16px_rgba(15,110,76,0.3)] lg:flex">
                                {meta.icon === 'requests' ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
                                    </svg>
                                ) : meta.icon === 'coaches' ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                ) : meta.icon === 'profile' ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                    </svg>
                                )}
                            </span>

                            <div className="leading-tight">
                                <h1 className="text-[15px] font-semibold tracking-tight text-ink">{meta.title}</h1>
                                <p className="hidden text-xs text-muted sm:block">{meta.subtitle}</p>
                            </div>
                        </div>

                        {/* Right: role pill + theme toggle + avatar */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-neutral-600 sm:inline-flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(15,110,76,0.6)]" />
                                {(localStorage.getItem('userRole') || 'user').replace(/^\w/, (c) => c.toUpperCase())}
                            </span>

                            <span className="hidden h-6 w-px bg-line sm:block" />

                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                                {(email || 'U').charAt(0).toUpperCase()}
                                {(email || 'U').charAt(1)?.toUpperCase() || ''}
                            </span>
                            <span className="hidden max-w-[140px] truncate text-xs font-medium text-neutral-600 sm:block">
                                {email || 'user'}
                            </span>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 bg-paper">{children}</div>
                </div>
            </div>
        </div>
    );
}