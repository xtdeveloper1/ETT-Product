"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          phone,
          message,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess("Message sent successfully!");

    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 md:p-10">
      <h2 className="text-[18px] font-semibold text-slate-900">
        Send us a message
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">

        <div>
          <label className="mb-2 block text-xs text-slate-500">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              text-sm
              outline-none
              transition
              focus:border-blue-500
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-slate-500">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              text-sm
              outline-none
              transition
              focus:border-blue-500
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-slate-500">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              text-sm
              outline-none
              transition
              focus:border-blue-500
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-slate-500">
            How can we help?
          </label>

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your project, location and timeline..."
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              p-4
              text-sm
              outline-none
              resize-none
              transition
              focus:border-blue-500
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            h-12
            w-full
            rounded-full
            bg-[#3560D4]
            text-sm
            font-medium
            text-white
            transition
            hover:bg-[#2D55C5]
            disabled:opacity-50
          "
        >
          {loading ? "Sending..." : "Send message"}
        </button>

        {success && (
          <p className="text-green-600 text-sm font-medium">
            {success}
          </p>
        )}

      </form>
    </div>
  );
}