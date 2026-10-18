import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HelloCubeScene } from "@/ar/HelloCubeScene";
import { useAppStore } from "@/state/useAppStore";
import { InventoryPanel } from "@/ui/InventoryPanel";
import { PlacingBanner } from "@/ui/PlacingBanner";
import { Toolbar } from "@/ui/Toolbar";

export default function ARScreen() {
  const insets = useSafeAreaInsets();
  const backToMenu = useAppStore((s) => s.backToMenu);

  // Cada vez que se entra a la pantalla AR se empieza desde el menú.
  useEffect(() => backToMenu, [backToMenu]);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{ scene: HelloCubeScene }}
        style={styles.container}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver"
        style={[styles.back, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Volver</Text>
      </Pressable>

      <PlacingBanner />
      <Toolbar />
      <InventoryPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: "absolute",
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
});
