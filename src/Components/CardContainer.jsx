import React from 'react'
import Card from './Card'

export default function CardContainer() {
    return (
        <div className="grid gap-4 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 ">

            <Card />
            <Card />
            <Card />
            <Card />
        </div>
    )
}
