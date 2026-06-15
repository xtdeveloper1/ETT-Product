"use client";

import { useEffect, useState } from "react";
import {
    ShoppingCart,
    IndianRupee,
    Package,
    FileText,
    Users,
    MessageSquare,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
    totalOrders: number;
    revenue: number;
    productsCount: number;
    customersCount: number;
    quoteRequestsCount: number;
    contactMessagesCount: number;
}

interface RecentOrder {
    id: number;
    order_number: string;
    customer_name: string;
    email: string;
    total_amount: number;
    order_status: string;
    created_at: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        revenue: 0,
        productsCount: 0,
        customersCount: 0,
        quoteRequestsCount: 0,
        contactMessagesCount: 0,
    });

    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            setLoading(true);
            setError(null);

            // Fetch Total Orders
            const { count: ordersCount } = await supabase
                .from("orders")
                .select("id", { count: "exact", head: true });

            // Fetch Revenue
            const { data: revenueData } = await supabase
                .from("orders")
                .select("total_amount");

            const revenue = revenueData?.reduce(
                (sum, order) => sum + (order.total_amount || 0),
                0
            ) || 0;

            // Fetch Products Count
            const { count: productsCount } = await supabase
                .from("products")
                .select("id", { count: "exact", head: true });

            // Fetch Unique Customers from Orders
            const { data: customersData } = await supabase
                .from("orders")
                .select("email");

            const uniqueCustomers = new Set(
                customersData?.map((order) => order.email)
            ).size;

            // Fetch Quote Requests Count
            const { count: quoteCount } = await supabase
                .from("quote_requests")
                .select("id", { count: "exact", head: true });

            // Fetch Contact Messages Count
            const { count: contactCount } = await supabase
                .from("contact_messages")
                .select("id", { count: "exact", head: true });

            setStats({
                totalOrders: ordersCount || 0,
                revenue,
                productsCount: productsCount || 0,
                customersCount: uniqueCustomers,
                quoteRequestsCount: quoteCount || 0,
                contactMessagesCount: contactCount || 0,
            });

            // Fetch Recent Orders
            const { data: orders } = await supabase
                .from("orders")
                .select("id, order_number, customer_name, email, total_amount, order_status, created_at")
                .order("created_at", { ascending: false })
                .limit(10);

            setRecentOrders(orders || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }

    const statCards = [
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
        },
        {
            title: "Revenue",
            value: `₹${stats.revenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
        },
        {
            title: "Products",
            value: stats.productsCount,
            icon: Package,
        },
        {
            title: "Customers",
            value: stats.customersCount,
            icon: Users,
        },
        {
            title: "Quote Requests",
            value: stats.quoteRequestsCount,
            icon: FileText,
        },
        {
            title: "Contact Messages",
            value: stats.contactMessagesCount,
            icon: MessageSquare,
        },
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome to Enviro Tech Admin Panel</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    Loading dashboard data...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome to Enviro Tech Admin Panel</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {statCards.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">{item.title}</p>
                                    <h2 className="text-3xl font-bold mt-2 text-slate-900">
                                        {item.value}
                                    </h2>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Icon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                        No orders yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="text-left p-4">Order</th>
                                    <th className="text-left p-4">Customer</th>
                                    <th className="text-left p-4">Amount</th>
                                    <th className="text-left p-4">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-slate-50">
                                        <td className="p-4 font-medium">{order.order_number}</td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">{order.customer_name}</p>
                                                <p className="text-sm text-slate-500">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">₹{order.total_amount.toLocaleString("en-IN")}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    order.order_status === "delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.order_status === "processing"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : order.order_status === "shipped"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : order.order_status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {order.order_status.charAt(0).toUpperCase() +
                                                    order.order_status.slice(1)}
                                            </span>
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