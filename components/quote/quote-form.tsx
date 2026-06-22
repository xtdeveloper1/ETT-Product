"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/category-service";
import type { Category } from "@/types/category";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  productType: "",
  projectDetails: "",
};

export default function QuoteForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((rows) => setCategories(rows.filter((category) => category.parent_id == null)))
      .catch((loadError) => console.error("Failed to load quote categories:", loadError));
  }, []);

  const updateField = (
    field: keyof typeof initialFormData,
    value: string
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(result.message ?? "Something went wrong. Please try again.");
        return;
      }

      setMessage("Quote request sent successfully. We'll contact you soon.");
      setFormData(initialFormData);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Your name"
            required
            className="w-full h-14 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            required
            className="w-full h-14 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+91"
            required
            className="w-full h-14 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="City, State"
            required
            className="w-full h-14 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Product Type
          </label>
          <select
            value={formData.productType}
            onChange={(event) => updateField("productType", event.target.value)}
            required
            className="w-full h-14 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product type</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Project Details
          </label>
          <textarea
            rows={5}
            value={formData.projectDetails}
            onChange={(event) =>
              updateField("projectDetails", event.target.value)
            }
            placeholder="Tell us about your project, requirements, location and timeline..."
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="h-14 flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Request Quote"}
          </button>
          <Link
            href="/shop"
            className="h-14 flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-medium transition duration-200 inline-flex items-center justify-center"
          >
            Browse Products
          </Link>
        </div>

        {message && (
          <p className="text-sm font-medium text-green-600">{message}</p>
        )}
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-slate-600">
          <strong>Prefer to chat?</strong> Click the WhatsApp button to connect
          with our team instantly.
        </p>
      </div>
    </div>
  );
}
