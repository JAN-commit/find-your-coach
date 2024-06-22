import React, { useState } from 'react'

export default function Message({ messages }) {
    return (
        <div>

            {messages.length > 0 ? (
                messages.map((message, index) => (
                    <div key={index} className="py-3">
                        <div className="p-5 border border-white rounded-2xl text-sm md:text-base bg-base-200">
                            <h1 className='text-xl font-semibold'>{message.email}</h1>
                            <p className='text-justify py-5'>{message.message}</p>
                            <p className='text-right'>{message.date}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No messages found</p>
            )}




        </div>
    )
}
