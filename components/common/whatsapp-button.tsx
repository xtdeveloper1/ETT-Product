"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="
      fixed
      bottom-5
      right-5
      z-50
      flex
      items-center
      justify-center
      bg-green-500
      hover:bg-green-600
      text-white
      h-12
      w-12
      rounded-full
      shadow-[0_12px_28px_rgba(34,197,94,0.35)]
      transition-all
      duration-300
      hover:scale-105
      sm:h-auto
      sm:w-auto
      sm:gap-2
      sm:px-5
      sm:py-3
      "
    >
      <MessageCircle size={22} />
      <span className="hidden font-medium sm:inline">
        Chat on WhatsApp
      </span>
    </a>
  );
}
