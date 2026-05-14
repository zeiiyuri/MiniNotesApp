import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";
import { addNote } from "../lib/database";

export default function AddNoteScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const saveNote = () => {
    try {
      if (!title || !category) {
        throw new Error("All fields required");
      }

      addNote(title, category);

      Alert.alert("Success", "Note added!");

      router.push("/notes");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={saveNote}>
        <Text style={{ color: "white" }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },

  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },

  input: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  btn: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});