import React from 'react'

export default function Message({ messages }) {
    return (
        <div className="space-y-4">
            {messages.length > 0 ? (
                messages.map((message, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-lg font-semibold text-gray-800">
                                {message.email || "Unknown Sender"}
                            </h1>
                            <span className="text-xs text-gray-400">
                                {message.date || "Just now"}
                            </span>
                        </div>

                        {/* Message Content */}
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.message || "No message content"}
                        </p>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-400">
                    📭 No messages found
                </div>
            )}
        </div>
    )
}
