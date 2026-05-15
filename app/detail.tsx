import { useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DetailScreen() {

  const {
    title,
    category,
    image,
    noteText,
  } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>
        {String(title)}
      </Text>

      <Text style={styles.category}>
        {String(category)}
      </Text>

      {image ? (
        <Image
          source={{ uri: String(image) }}
          style={styles.image}
        />
      ) : null}

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>
          Private Note
        </Text>

        <Text style={styles.noteText}>
          {noteText
            ? String(noteText)
            : "No note added"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },

  category: {
    color: "gray",
    marginBottom: 20,
    fontSize: 16,
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },

  noteBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },

  noteTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },

  noteText: {
    fontSize: 15,
    lineHeight: 22,
  },
});