"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface QuoteRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
}

const STATUS_OPTIONS = ["new", "contacted", "closed"];

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    async function fetchQuotes() {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("quote_requests")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) {
                console.error(fetchError);
                setError("Failed to load quote requests");
                return;
            }

            setQuotes(data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load quote requests");
        } finally {
            setLoading(false);
        }
    }

    async function updateQuoteStatus(quoteId: number, newStatus: string) {
        try {
            setUpdatingId(quoteId);
            setError(null);

            const { error: updateError } = await supabase
                .from("quote_requests")
                .update({ status: newStatus })
                .eq("id", quoteId);

            if (updateError) {
                console.error(updateError);
                setError("Failed to update quote status");
                return;
            }

            // Update local state
            setQuotes(
                quotes.map((quote) =>
                    quote.id === quoteId ? { ...quote, status: newStatus } : quote
                )
            );
        } catch (err) {
            console.error(err);
            setError("Failed to update quote status");
        } finally {
            setUpdatingId(null);
        }
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border">
                Loading quote requests...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Quote Requests
                </h1>

                <p className="text-slate-500">
                    Manage quote enquiries
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            )}

            {quotes.length === 0 ? (
                <div className="bg-white rounded-xl border p-6 text-center text-slate-500">
                    No quote requests yet
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">

                    <div className="p-6 border-b">
                        <h2 className="font-semibold text-lg">
                            All Quote Requests ({quotes.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold">Name</th>
                                    <th className="p-4 text-left font-semibold">Email</th>
                                    <th className="p-4 text-left font-semibold">Phone</th>
                                    <th className="p-4 text-left font-semibold">Message</th>
                                    <th className="p-4 text-left font-semibold">Status</th>
                                    <th className="p-4 text-left font-semibold">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {quotes.map((quote) => (
                                    <tr key={quote.id} className="border-t hover:bg-slate-50">
                                        <td className="p-4 font-medium">{quote.name}</td>
                                        <td className="p-4">
                                            <a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">
                                                {quote.email}
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            <a href={`tel:${quote.phone}`} className="text-blue-600 hover:underline">
                                                {quote.phone}
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-600 truncate max-w-xs">
                                                {quote.message}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={quote.status}
                                                onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                                                disabled={updatingId === quote.id}
                                                className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    quote.status === "new"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : quote.status === "contacted"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {new Date(quote.created_at).toLocaleDateString()}
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