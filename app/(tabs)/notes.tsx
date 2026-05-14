import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getNotes } from "../../lib/database";

export default function NotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);

  const loadNotes = () => {
    setNotes(getNotes());
  };

  useEffect(() => {
    loadNotes();
    const interval = setInterval(loadNotes, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes List</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* VIEW DETAIL */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    title: item.title,
                    category: item.category,
                  },
                })
              }
            >
              <Text style={styles.titleText}>{item.title}</Text>
              <Text>{item.category}</Text>
            </TouchableOpacity>

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
                  },
                })
              }
            >
              <Text style={{ color: "white" }}>Edit</Text>
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
          Add Note
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },

  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  titleText: { fontSize: 18, fontWeight: "bold" },

  editBtn: {
    marginTop: 10,
    backgroundColor: "#FF9800",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  addBtn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
});