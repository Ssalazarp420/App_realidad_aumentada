import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR Furniture</Text>
      <Text style={styles.subtitle}>Coloca muebles 3D en tu espacio</Text>
      <Link href="/ar" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Iniciar AR</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#208AEF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
