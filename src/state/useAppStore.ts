import { create } from "zustand";

import type { AppMode } from "@/types";

type AppState = {
  mode: AppMode;
  /** Item del inventario elegido para colocar (modo `placing`). */
  selectedItemId: string | null;

  openInventory: () => void;
  closeInventory: () => void;
  /** Elegir un item del inventario pasa a modo `placing`. */
  selectItem: (itemId: string) => void;
  /** Vuelve a `menu` desde cualquier modo y limpia la selección. */
  backToMenu: () => void;
};

/** Estado global de la pantalla AR; reemplaza al GameManager del curso. */
export const useAppStore = create<AppState>()((set) => ({
  mode: "menu",
  selectedItemId: null,

  openInventory: () => set({ mode: "inventory" }),
  closeInventory: () => set({ mode: "menu" }),
  selectItem: (itemId) => set({ mode: "placing", selectedItemId: itemId }),
  backToMenu: () => set({ mode: "menu", selectedItemId: null }),
}));
