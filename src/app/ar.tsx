import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HelloCubeScene } from "@/ar/HelloCubeScene";

export default function ARScreen() {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{ scene: HelloCubeScene }}
        style={styles.container}
      />
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: "absolute",
    top: 48,
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
