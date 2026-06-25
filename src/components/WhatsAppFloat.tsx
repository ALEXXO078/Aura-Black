import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hola Aura Black, me interesa consultar sobre un perfume.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-gold transition hover:scale-105"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
