import Logo from './Logo';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-line">
            <div className="page flex flex-col items-center justify-between gap-3 py-8 sm:flex-row">
                <Logo to="/" markClassName="h-7 w-7" textClassName="text-sm" />

                <p className="text-[13px] text-muted">
                    Built for developers who want to level up.
                </p>

                <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                    v{__APP_VERSION__}
                </span>
            </div>
        </footer>
    );
}