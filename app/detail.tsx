import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
  const { title, category, image, note } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.category}>{category}</Text>

      {image ? (
        <Image source={{ uri: String(image) }} style={styles.image} />
      ) : null}

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Private Note</Text>
        <Text>{note ? String(note) : "No note added"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingTop: 60,
  paddingHorizontal: 20,
  backgroundColor: "#f5f5f5",
},

  title: { fontSize: 28, fontWeight: "bold" },
  category: { color: "gray" },

  image: { width: "100%", height: 250, borderRadius: 10 },

  noteBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  noteTitle: { fontWeight: "bold", marginBottom: 5 },
});