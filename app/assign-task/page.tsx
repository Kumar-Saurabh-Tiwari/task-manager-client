'use client';
import React, { useCallback, useState } from 'react';
import { searchUsers } from '../../services/userService'; // adjust the path
import { toast } from "react-hot-toast";
import Link from 'next/link';

export default function AssignTaskPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const users = await searchUsers(query);
            setResults(users);
        } catch (err) {
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Assign Task</h1>

            <div className="relative mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name or email"
                    className="w-full border rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                    {loading ? (
                        <span className="text-sm">...</span>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path d="M10 2a8 8 0 105.29 14.71l4 4a1 1 0 001.42-1.42l-4-4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
                        </svg>
                    )}
                </button>
            </div>

            {results.length > 0 && (
                <div className="bg-white shadow rounded p-4 space-y-3">
                    {results.map((user: any) => (
                        <div
                            key={user._id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <Link
                                href={`/create-task?assignId=${user._id}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            >
                                Assign
                            </Link>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
