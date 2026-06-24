import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Category = "hombre" | "mujer" | "unisex" | "importados" | "nicho";
export type Tag = "oferta" | "liquidacion" | "nuevo" | "destacado" | "mas-vendido";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  notes: string[];
  price: number;
  oldPrice?: number;
  ml: number;
  stock: number;
  category: Category;
  tags: Tag[];
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "noir-imperial",
    name: "Noir Imperial",
    brand: "Aura Black",
    description: "Una fragancia oscura y magnética. Notas de oud, cuero y vainilla negra que evocan la noche más elegante.",
    notes: ["Oud", "Cuero", "Vainilla negra", "Ámbar"],
    price: 389,
    oldPrice: 459,
    ml: 100,
    stock: 12,
    category: "hombre",
    tags: ["destacado", "oferta"],
    image: p3,
  },
  {
    id: "2",
    slug: "rose-eternelle",
    name: "Rose Éternelle",
    brand: "Aura Black",
    description: "Romance moderno. Rosa búlgara, pimienta rosa y pachulí en una composición femenina e inolvidable.",
    notes: ["Rosa búlgara", "Pimienta rosa", "Pachulí", "Almizcle"],
    price: 349,
    ml: 90,
    stock: 18,
    category: "mujer",
    tags: ["mas-vendido", "nuevo"],
    image: p4,
  },
  {
    id: "3",
    slug: "obsidian-nuit",
    name: "Obsidian Nuit",
    brand: "Aura Black",
    description: "Misterio puro. Sándalo ahumado, incienso y especias raras envuelven la piel en una estela hipnótica.",
    notes: ["Sándalo", "Incienso", "Cardamomo", "Mirra"],
    price: 520,
    ml: 100,
    stock: 7,
    category: "nicho",
    tags: ["destacado"],
    image: p5,
  },
  {
    id: "4",
    slug: "ambre-doree",
    name: "Ambre Dorée",
    brand: "Maison Aura",
    description: "Calidez dorada. Ámbar líquido, miel salvaje y benjuí para quienes buscan presencia silenciosa.",
    notes: ["Ámbar", "Miel", "Benjuí", "Tonka"],
    price: 410,
    oldPrice: 480,
    ml: 100,
    stock: 9,
    category: "unisex",
    tags: ["oferta", "mas-vendido"],
    image: p1,
  },
  {
    id: "5",
    slug: "cristal-blanc",
    name: "Cristal Blanc",
    brand: "Maison Aura",
    description: "Frescura cristalina. Bergamota italiana, jazmín blanco y almizcle puro. Limpio, luminoso y atemporal.",
    notes: ["Bergamota", "Jazmín", "Almizcle blanco", "Cedro"],
    price: 295,
    ml: 90,
    stock: 24,
    category: "unisex",
    tags: ["nuevo"],
    image: p2,
  },
  {
    id: "6",
    slug: "monolith",
    name: "Monolith",
    brand: "Aura Black",
    description: "Minimalismo poderoso. Vetiver de Haití, tabaco rubio y cuero suave en un acorde escultural.",
    notes: ["Vetiver", "Tabaco", "Cuero", "Bergamota"],
    price: 365,
    ml: 100,
    stock: 15,
    category: "importados",
    tags: ["destacado", "mas-vendido"],
    image: p6,
  },
];

export const categories: { id: Category; label: string; description: string }[] = [
  { id: "hombre", label: "Hombre", description: "Carácter y profundidad" },
  { id: "mujer", label: "Mujer", description: "Sensualidad y matiz" },
  { id: "unisex", label: "Unisex", description: "Sin fronteras" },
  { id: "importados", label: "Importados", description: "Selección internacional" },
  { id: "nicho", label: "Nicho / Premium", description: "Edición limitada" },
];

export const tagLabels: Record<Tag, string> = {
  oferta: "Oferta",
  liquidacion: "Liquidación",
  nuevo: "Nuevo ingreso",
  destacado: "Destacado",
  "mas-vendido": "Más vendido",
};

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
