import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import { deleteNote, getNotes } from "../lib/database";

export default function NotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);

  // ✅ LOAD NOTES (SYNC VERSION)
  const loadNotes = () => {
    const data = getNotes();
    setNotes(data);
  };

  useEffect(() => {
    loadNotes();

    // auto refresh so UI updates after add/edit/delete
    const interval = setInterval(() => {
      loadNotes();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* TITLE */}
            <Text style={styles.noteTitle}>{item.title}</Text>

            {/* CATEGORY */}
            <Text style={styles.category}>{item.category}</Text>

            {/* IMAGE */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}

            {/* EDIT BUTTON */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                router.push({
                  pathname: "/edit-note",
                  params: {
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    image: item.image,
                  },
                })
              }
            >
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>

            {/* DELETE BUTTON */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                Alert.alert("Delete Note", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteNote(item.id),
                  },
                ])
              }
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add-note")}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          + Add Note
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  category: {
    color: "gray",
    marginBottom: 5,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },

  editBtn: {
    backgroundColor: "#ffa500",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  addBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
});