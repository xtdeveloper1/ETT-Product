"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CustomerData {
    email: string;
    name: string;
    phone: string;
    totalOrders: number;
    totalSpend: number;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("orders")
                .select("email, customer_name, phone, total_amount")
                .order("email");

            if (fetchError) {
                console.error(fetchError);
                setError("Failed to load customers");
                return;
            }

            // Group orders by email
            const groupedCustomers: { [key: string]: CustomerData } = {};

            data?.forEach((order: any) => {
                if (!groupedCustomers[order.email]) {
                    groupedCustomers[order.email] = {
                        email: order.email,
                        name: order.customer_name,
                        phone: order.phone,
                        totalOrders: 0,
                        totalSpend: 0,
                    };
                }

                groupedCustomers[order.email].totalOrders += 1;
                groupedCustomers[order.email].totalSpend += order.total_amount || 0;
            });

            const customersList = Object.values(groupedCustomers).sort(
                (a, b) => b.totalSpend - a.totalSpend
            );

            setCustomers(customersList);
        } catch (err) {
            console.error(err);
            setError("Failed to load customers");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border">
                Loading customers...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Customers
                </h1>

                <p className="text-slate-500">
                    Manage customer database
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border overflow-hidden">

                <div className="p-6 border-b">
                    <h2 className="font-semibold text-lg">
                        All Customers ({customers.length})
                    </h2>
                </div>

                {customers.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                        No customers found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold">Customer Name</th>
                                    <th className="p-4 text-left font-semibold">Email</th>
                                    <th className="p-4 text-left font-semibold">Phone</th>
                                    <th className="p-4 text-left font-semibold">Total Orders</th>
                                    <th className="p-4 text-left font-semibold">Total Spend</th>
                                </tr>
                            </thead>

                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.email} className="border-t hover:bg-slate-50">
                                        <td className="p-4 font-medium">{customer.name}</td>
                                        <td className="p-4">
                                            <div>
                                                <p className="text-sm">{customer.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">{customer.phone}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                                {customer.totalOrders}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold">
                                            ₹{customer.totalSpend.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>

        </div>
    );
}