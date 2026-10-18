import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LOCAL_CATALOG } from "@/data/catalog.local";
import { useAppStore } from "@/state/useAppStore";

/** Aviso superior en modo `placing`: muestra el item elegido y permite cancelar. */
export function PlacingBanner() {
  const mode = useAppStore((s) => s.mode);
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const backToMenu = useAppStore((s) => s.backToMenu);
  const insets = useSafeAreaInsets();

  const item = LOCAL_CATALOG.find((it) => it.id === selectedItemId);
  if (mode !== "placing" || !item) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(150)}
      style={[styles.banner, { top: insets.top + 64 }]}
    >
      <View style={[styles.dot, { backgroundColor: item.color }]}>
        <Text>{item.emoji}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.hint}>Apunta al piso para colocarlo</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        onPress={backToMenu}
        style={styles.cancel}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  hint: {
    color: "#ddd",
    fontSize: 12,
  },
  cancel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  cancelText: {
    color: "#fff",
    fontSize: 13,
  },
});
