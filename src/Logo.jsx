import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-8 w-8' }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-[10px] bg-accent text-white ${className}`}
        >
            <svg className="h-[58%] w-[58%]" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M12 2.8C6.5 2.8 2 6.6 2 11.3c0 2.4 1.2 4.6 3.2 5.9L3.7 21l4.9-2.2c1 .3 2.1.4 3.4.4 5.5 0 10-3.8 10-8.5S17.5 2.8 12 2.8z"
                />
                <path
                    fill="none"
                    stroke="#0B5A3E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.3 11.9l2.5 2.5 4.9-4.9"
                />
            </svg>
        </span>
    );
}

export default function Logo({ to = '/', markClassName = 'h-8 w-8', textClassName = 'text-[15px]' }) {
    return (
        <Link to={to} className="flex items-center gap-2.5">
            <LogoMark className={markClassName} />
            <span className={`font-semibold tracking-tight ${textClassName}`}>Coachmate</span>
        </Link>
    );
}