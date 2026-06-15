"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    email: string;
    phone: string;
    total_amount: number;
    payment_status: string;
    order_status: string;
    created_at: string;
}

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["All", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            setAllOrders(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredOrders = useMemo(() => {
        return allOrders.filter((order) => {
            const matchesSearch =
                order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.phone.includes(searchQuery);

            const matchesStatus = selectedStatus === "All" || order.order_status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [allOrders, searchQuery, selectedStatus]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Orders
                </h1>

                <p className="text-slate-500 mt-1">
                    Manage all customer orders
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by order number, customer name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                selectedStatus === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {status === "All" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

                <div className="p-6 border-b">
                    <h2 className="font-semibold text-lg">
                        Orders ({filteredOrders.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50 border-b">

                            <tr>
                                <th className="text-left p-4 font-semibold">
                                    Order Number
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Customer
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Phone
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Amount
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Payment
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Status
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Date
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Action
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {paginatedOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="p-8 text-center text-slate-500"
                                    >
                                        {searchQuery || selectedStatus !== "All" ? "No orders match your filters" : "No orders found"}
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="p-4 font-medium">
                                            {order.order_number}
                                        </td>

                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">
                                                    {order.customer_name}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {order.email}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {order.phone}
                                        </td>

                                        <td className="p-4 font-semibold">
                                            ₹{order.total_amount?.toLocaleString()}
                                        </td>

                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.payment_status === "paid" 
                                                    ? "bg-green-100 text-green-700"
                                                    : order.payment_status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.order_status === "delivered" ? "bg-green-100 text-green-700"
                                                : order.order_status === "processing" ? "bg-blue-100 text-blue-700"
                                                : order.order_status === "shipped" ? "bg-purple-100 text-purple-700"
                                                : order.order_status === "cancelled" ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                            </span>
                                        </td>

                                        <td className="p-4 text-sm">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t">
                        <p className="text-sm text-slate-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}