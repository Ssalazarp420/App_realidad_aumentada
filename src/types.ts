/** Un mueble del inventario. Los modelos 3D se agregan en la Fase 4. */
export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  /** Color de la miniatura provisional, hasta tener imágenes reales. */
  color: string;
  /** Emoji provisional para la miniatura. */
  emoji: string;
};

/**
 * Estados de la pantalla AR (equivalen a los eventos del GameManager del curso):
 * - `menu`: vista AR con la toolbar.
 * - `inventory`: panel de inventario abierto.
 * - `placing`: se eligió un item y se está buscando dónde colocarlo.
 * - `editing`: hay un objeto colocado seleccionado (mover/rotar/eliminar).
 */
export type AppMode = "menu" | "inventory" | "placing" | "editing";
