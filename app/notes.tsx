import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { deleteNote, getNotes } from "../lib/database";

export default function NotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);

  // ✅ ALWAYS FRESH LOAD WHEN SCREEN IS OPENED
  const loadNotes = () => {
    try {
      const data = getNotes();
      setNotes(data || []);
    } catch (error) {
      console.log("LOAD ERROR:", error);
      setNotes([]);
    }
  };

  // ✅ FIX 1: LOAD WHEN SCREEN IS FOCUSED (IMPORTANT FIX)
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        extraData={notes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/detail",
                params: {
                  id: item.id,
                  title: item.title,
                  category: item.category,
                  image: item.image,
                  noteText: item.noteText,
                },
              })
            }
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.category}>{item.category}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.edit}
                onPress={() =>
                  router.push({
                    pathname: "/detail",
                    params: item,
                  })
                }
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delete}
                onPress={() =>
                  Alert.alert("Delete", "Are you sure?", [
                    { text: "Cancel" },
                    {
                      text: "Delete",
                      onPress: () => {
                        deleteNote(item.id);
                        loadNotes(); // ✅ refresh instantly
                      },
                    },
                  ])
                }
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

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
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  category: {
    color: "gray",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  edit: {
    backgroundColor: "orange",
    flex: 1,
    marginRight: 5,
    padding: 8,
    alignItems: "center",
    borderRadius: 6,
  },

  delete: {
    backgroundColor: "red",
    flex: 1,
    marginLeft: 5,
    padding: 8,
    alignItems: "center",
    borderRadius: 6,
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
    marginBottom: 70,
  },
});