import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    FileText,
    MessageSquare,
    Settings,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold">
                        Enviro Tech Admin
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">

                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <ShoppingCart size={18} />
                        Orders
                    </Link>

                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <Package size={18} />
                        Products
                    </Link>

                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <Users size={18} />
                        Customers
                    </Link>

                    <Link
                        href="/admin/quotes"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <FileText size={18} />
                        Quote Requests
                    </Link>

                    <Link
                        href="/admin/contacts"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <MessageSquare size={18} />
                        Contacts
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    >
                        <Settings size={18} />
                        Settings
                    </Link>

                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
                    Enviro Tech v1.0
                </div>

            </aside>

            {/* Main Content */}
            <div className="flex-1">

                {/* Top Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Admin Panel
                    </h2>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            A
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Admin
                            </p>
                            <p className="text-xs text-slate-500">
                                Enviro Tech
                            </p>
                        </div>
                    </div>

                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}