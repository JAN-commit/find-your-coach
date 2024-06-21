import React from 'react';
import Card from './Card';

export default function CardContainer({ coachList }) {
    return (
        <div className="grid gap-4 w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3">
            {coachList.map(coach => (
                <Card key={coach.id} coach={coach} />
            ))}
        </div>
    );
}
