import Card from './Card';

export default function CardContainer({ coachList }) {
    return (
        <div className="grid gap-4 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {coachList.map(coach => (
                <Card key={coach.id} coach={coach} />
            ))}
        </div>
    );
}