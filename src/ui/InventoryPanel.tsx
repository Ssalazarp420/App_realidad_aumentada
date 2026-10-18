import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LOCAL_CATALOG } from "@/data/catalog.local";
import { useAppStore } from "@/state/useAppStore";
import { ItemButton } from "@/ui/ItemButton";

const PANEL_HEIGHT = 240;

/** Panel inferior con el inventario; entra y sale deslizándose (reemplaza DOTween). */
export function InventoryPanel() {
  const isOpen = useAppStore((s) => s.mode === "inventory");
  const closeInventory = useAppStore((s) => s.closeInventory);
  const selectItem = useAppStore((s) => s.selectItem);
  const insets = useSafeAreaInsets();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [isOpen, progress]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * (PANEL_HEIGHT + insets.bottom) }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.35,
  }));

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeInventory} />
      </Animated.View>

      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[
          styles.panel,
          { height: PANEL_HEIGHT + insets.bottom, paddingBottom: insets.bottom },
          panelStyle,
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Inventario</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar inventario"
            onPress={closeInventory}
            hitSlop={12}
          >
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>
        <FlatList
          data={LOCAL_CATALOG}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ItemButton item={item} onPress={(it) => selectItem(it.id)} />
          )}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "#000",
  },
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20,20,24,0.92)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  close: {
    color: "#fff",
    fontSize: 20,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
