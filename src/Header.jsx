import { NavLink } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
    // Authenticated layout is handled by AppShell (dark sidebar + header).
    // This Header is only for public / unauthenticated pages (landing, login, signup).
    const isAuthed = !!localStorage.getItem('idToken');
    if (isAuthed) return null;

    return (
        <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
            <div className="page flex h-16 items-center justify-between gap-4">
                <Logo to="/" />
                <nav className="flex items-center gap-3">
                    <NavLink to="/Login" className="nav-link">
                        Log in
                    </NavLink>
                    <NavLink to="/Signup" className="btn-main !px-4 !py-2">
                        Get started
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}