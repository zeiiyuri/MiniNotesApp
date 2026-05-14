import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { updateNote } from "../lib/database";

export default function EditNoteScreen() {
  const { id, title, category } = useLocalSearchParams();

  const [newTitle, setNewTitle] = useState(title as string);
  const [newCategory, setNewCategory] = useState(category as string);

  const saveUpdate = () => {
    try {
      if (!newTitle || !newCategory) {
        throw new Error("Fields cannot be empty");
      }

      updateNote(Number(id), newTitle, newCategory);

      Alert.alert("Success", "Note updated!");

      router.push("/notes");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Note</Text>

      <TextInput
        value={newTitle}
        onChangeText={setNewTitle}
        style={styles.input}
      />

      <TextInput
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={saveUpdate}>
        <Text style={{ color: "white" }}>Save Changes</Text>
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
    backgroundColor: "#673AB7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});