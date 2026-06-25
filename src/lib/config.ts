export const SITE = {
  name: "Aura Black",
  tagline: "Perfumería de autor",
  whatsapp: "51913655352", // +51 913 655 352
  email: "contacto@aurablack.com",
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
  }).format(n);
