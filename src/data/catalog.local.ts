import type { CatalogItem } from "@/types";

/** Catálogo embebido. En la Fase 8 se reemplaza o complementa con Supabase. */
export const LOCAL_CATALOG: CatalogItem[] = [
  {
    id: "chair",
    name: "Silla",
    description: "Silla de comedor en madera",
    color: "#C8A27A",
    emoji: "🪑",
  },
  {
    id: "table",
    name: "Mesa",
    description: "Mesa redonda para cuatro personas",
    color: "#8D6E63",
    emoji: "🟫",
  },
  {
    id: "sofa",
    name: "Sofá",
    description: "Sofá de tres puestos",
    color: "#5C7AEA",
    emoji: "🛋️",
  },
  {
    id: "lamp",
    name: "Lámpara",
    description: "Lámpara de pie de 1,6 m",
    color: "#F2C14E",
    emoji: "💡",
  },
  {
    id: "plant",
    name: "Planta",
    description: "Planta decorativa en maceta",
    color: "#4CAF50",
    emoji: "🪴",
  },
  {
    id: "shelf",
    name: "Estante",
    description: "Estantería de cinco niveles",
    color: "#A1887F",
    emoji: "📚",
  },
];
