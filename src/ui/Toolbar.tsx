import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppStore } from "@/state/useAppStore";

type ToolButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
};

function ToolButton({ icon, label, onPress, disabled, primary }: ToolButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary && styles.primary,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.icon, primary && styles.primaryIcon]}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

/** Barra inferior de la pantalla AR. Se oculta mientras el inventario está abierto. */
export function Toolbar() {
  const mode = useAppStore((s) => s.mode);
  const openInventory = useAppStore((s) => s.openInventory);
  const insets = useSafeAreaInsets();

  if (mode === "inventory") return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(150)}
      style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}
    >
      <View style={styles.row}>
        {/* Se habilitan en las fases 7 (foto) y 6 (eliminar). */}
        <ToolButton icon="📷" label="Foto" onPress={() => {}} disabled />
        <ToolButton icon="＋" label="Inventario" onPress={openInventory} primary />
        <ToolButton icon="🗑" label="Eliminar" onPress={() => {}} disabled={mode !== "editing"} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  primary: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#208AEF",
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  icon: {
    fontSize: 22,
    color: "#fff",
  },
  primaryIcon: {
    fontSize: 30,
  },
  label: {
    fontSize: 10,
    color: "#fff",
    marginTop: 2,
  },
});
