import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export default function ContactWhatsapp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      className="
      inline-flex
      items-center
      gap-2
      mt-10
      bg-green-500
      hover:bg-green-600
      text-white
      px-6
      py-4
      rounded-full
      font-medium
      "
    >
      <MessageCircle size={18} />
      Chat on WhatsApp
    </a>
  );
}
