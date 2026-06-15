"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

export default function ContactsPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    async function fetchContacts() {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) {
                console.error(fetchError);
                setError("Failed to load contact messages");
                return;
            }

            setMessages(data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load contact messages");
        } finally {
            setLoading(false);
        }
    }

    async function deleteMessage(messageId: number) {
        try {
            setDeleting(true);
            setError(null);

            const { error: deleteError } = await supabase
                .from("contact_messages")
                .delete()
                .eq("id", messageId);

            if (deleteError) {
                console.error(deleteError);
                setError("Failed to delete message");
                return;
            }

            setMessages(messages.filter((msg) => msg.id !== messageId));
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
            setError("Failed to delete message");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border">
                Loading contact messages...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Contact Messages
                </h1>

                <p className="text-slate-500">
                    Messages received from website
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            )}

            {messages.length === 0 ? (
                <div className="bg-white rounded-xl border p-6 text-center text-slate-500">
                    No contact messages yet
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">

                    <div className="p-6 border-b">
                        <h2 className="font-semibold text-lg">
                            All Messages ({messages.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold">Name</th>
                                    <th className="p-4 text-left font-semibold">Email</th>
                                    <th className="p-4 text-left font-semibold">Subject</th>
                                    <th className="p-4 text-left font-semibold">Message</th>
                                    <th className="p-4 text-left font-semibold">Date</th>
                                    <th className="p-4 text-left font-semibold">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {messages.map((msg) => (
                                    <tr key={msg.id} className="border-t hover:bg-slate-50">
                                        <td className="p-4 font-medium">{msg.name}</td>
                                        <td className="p-4">
                                            <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                                                {msg.email}
                                            </a>
                                        </td>
                                        <td className="p-4 font-medium">{msg.subject}</td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-600 truncate max-w-md">
                                                {msg.message}
                                            </p>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {deleteConfirm === msg.id ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => deleteMessage(msg.id)}
                                                        disabled={deleting}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        disabled={deleting}
                                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(msg.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </div>
            )}

        </div>
    );
}