export const getNavItems = (role) => {
    if (role === 'coach') {
        return [
            { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
            { to: '/MessageRequest', label: 'Requests', icon: 'requests' },
            { to: '/CoachRegistration', label: 'Edit profile', icon: 'register' },
        ];
    }
    return [
        { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/Coaches', label: 'Available coaches', icon: 'coaches' },
        { to: '/CoachRegistration', label: 'Become a coach', icon: 'register' },
    ];
};