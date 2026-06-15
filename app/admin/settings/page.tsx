"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Settings {
    id: number;
    company_name: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    support_email: string;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [settingsId, setSettingsId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        company_name: "",
        company_email: "",
        company_phone: "",
        company_address: "",
        support_email: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            setLoading(true);
            setError(null);

            // Try to fetch existing settings
            const { data, error: fetchError } = await supabase
                .from("settings")
                .select("*")
                .limit(1);

            // If table doesn't exist or no data, just continue with empty form
            if (fetchError) {
                // Table doesn't exist yet, that's OK - user can create it by saving
                return;
            }

            if (data && data.length > 0) {
                const settings = data[0];
                setSettingsId(settings.id);
                setFormData({
                    company_name: settings.company_name || "",
                    company_email: settings.company_email || "",
                    company_phone: settings.company_phone || "",
                    company_address: settings.company_address || "",
                    support_email: settings.support_email || "",
                });
            }
        } catch (err) {
            // Silently fail on load - user can still save settings
            console.debug("Settings not yet initialized:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            if (settingsId) {
                // Update existing settings
                const { error: updateError } = await supabase
                    .from("settings")
                    .update(formData)
                    .eq("id", settingsId);

                if (updateError) {
                    console.error(updateError);
                    setError("Failed to save settings");
                    return;
                }
            } else {
                // Create new settings
                const { data, error: insertError } = await supabase
                    .from("settings")
                    .insert([formData])
                    .select();

                if (insertError) {
                    console.error(insertError);
                    setError("Failed to save settings");
                    return;
                }

                if (data && data.length > 0) {
                    setSettingsId(data[0].id);
                }
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError("An error occurred while saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl border">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Settings
                </h1>

                <p className="text-slate-500">
                    Manage website configuration
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                    Settings saved successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Company Email
                    </label>
                    <input
                        type="email"
                        name="company_email"
                        value={formData.company_email}
                        onChange={handleChange}
                        placeholder="Enter company email"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Company Phone
                    </label>
                    <input
                        type="tel"
                        name="company_phone"
                        value={formData.company_phone}
                        onChange={handleChange}
                        placeholder="Enter company phone number"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Company Address
                    </label>
                    <textarea
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleChange}
                        placeholder="Enter company address"
                        rows={3}
                        className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Support Email
                    </label>
                    <input
                        type="email"
                        name="support_email"
                        value={formData.support_email}
                        onChange={handleChange}
                        placeholder="Enter support email"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>

            </form>

        </div>
    );
}