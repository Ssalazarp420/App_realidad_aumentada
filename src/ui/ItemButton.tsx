import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CatalogItem } from "@/types";

type Props = {
  item: CatalogItem;
  onPress: (item: CatalogItem) => void;
};

/** Tarjeta de un mueble en el inventario (equivale a ItemButtonManager). */
export function ItemButton({ item, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Colocar ${item.name}`}
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.thumbnail, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    padding: 8,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  thumbnail: {
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 36,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  description: {
    fontSize: 12,
    color: "#555",
  },
});
