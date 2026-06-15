"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    total_amount: number;
    payment_status: string;
    order_status: string;
    created_at: string;
}

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
}

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id;

    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    async function fetchOrderDetails() {
        try {
            setError(null);
            // Order Fetch
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (orderError) {
                console.error(orderError);
                setError("Failed to load order");
                return;
            }

            setOrder(orderData);

            // Order Items Fetch
            const { data: itemData, error: itemError } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", orderId);

            if (itemError) {
                console.error(itemError);
                return;
            }

            setItems(itemData || []);
        } catch (error) {
            console.error(error);
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(newStatus: string) {
        if (!order) return;

        try {
            setUpdating(true);
            setError(null);
            setSuccess(false);

            const { error: updateError } = await supabase
                .from("orders")
                .update({ order_status: newStatus })
                .eq("id", orderId);

            if (updateError) {
                console.error(updateError);
                setError("Failed to update order status");
                return;
            }

            setOrder({ ...order, order_status: newStatus });
            setSuccess(true);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError("An error occurred while updating the status");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border">
                Loading order...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white p-6 rounded-xl border text-red-600">
                Order not found
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    {order.order_number}
                </h1>

                <p className="text-slate-500 mt-1">
                    Order Details
                </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                    Order status updated successfully!
                </div>
            )}

            {/* Customer Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <h2 className="text-lg font-semibold mb-4">
                    Customer Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <p className="text-sm text-slate-500">Customer Name</p>
                        <p className="font-medium">{order.customer_name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium">{order.email}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="font-medium">{order.phone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Order Date</p>
                        <p className="font-medium">
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>

                </div>

            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <h2 className="text-lg font-semibold mb-4">
                    Shipping Address
                </h2>

                <p>{order.address}</p>
                <p>
                    {order.city}, {order.state}
                </p>
                <p>{order.pincode}</p>

            </div>

            {/* Products */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <h2 className="text-lg font-semibold mb-4">
                    Ordered Products
                </h2>

                <div className="space-y-4">

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border rounded-lg p-4"
                        >
                            <div>
                                <h3 className="font-medium">
                                    {item.product_name}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <div className="font-semibold">
                                ₹{item.price.toLocaleString()}
                            </div>
                        </div>
                    ))}

                </div>

            </div>

            {/* Status Section with Update */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <h2 className="text-lg font-semibold mb-4">
                    Order Status
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-slate-500 mb-2">
                            Payment Status
                        </p>

                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${
                            order.payment_status === "paid" 
                                ? "bg-green-100 text-green-700"
                                : order.payment_status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500 mb-2">
                            Order Status
                        </p>

                        <div className="flex gap-2 flex-wrap">
                            <select
                                value={order.order_status}
                                onChange={(e) => updateOrderStatus(e.target.value)}
                                disabled={updating}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {updating && <span className="text-sm text-slate-500">Updating...</span>}
                        </div>
                    </div>

                </div>

            </div>

            {/* Total */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">

                <div className="flex justify-between items-center">

                    <h2 className="text-xl font-bold">
                        Total Amount
                    </h2>

                    <h2 className="text-2xl font-bold text-blue-600">
                        ₹{order.total_amount.toLocaleString()}
                    </h2>

                </div>

            </div>

        </div>
    );
}