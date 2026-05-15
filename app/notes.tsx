import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  deleteNote,
  getNotes,
  togglePin,
} from "../lib/database";

export default function NotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("All");

  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ LOAD NOTES
  const loadNotes = () => {
    try {
      const data = getNotes();
      setNotes(data || []);
    } catch (err) {
      console.log("LOAD ERROR:", err);
      setNotes([]);
    }
  };

  // ✅ FIXED REFRESH (ONLY ONE SAFE HOOK)
  useFocusEffect(
    useCallback(() => {
      loadNotes();

      // small delay ensures DB is updated after navigation back
      const timeout = setTimeout(() => {
        loadNotes();
      }, 200);

      return () => clearTimeout(timeout);
    }, [])
  );

  const folders = [
    "All",
    ...Array.from(new Set(notes.map(n => n.category)))
  ];

  const filteredNotes =
    selectedFolder === "All"
      ? notes
      : notes.filter(n => n.category === selectedFolder);

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => (b.pinned || 0) - (a.pinned || 0)
  );

  const openMenu = (item: any) => {
    setSelectedNote(item);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedNote(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      "#3498db",
      "#e67e22",
      "#9b59b6",
      "#2ecc71",
      "#e74c3c",
      "#f1c40f",
    ];

    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      {/* FILTER */}
      <View style={styles.filterBar}>
        {folders.map(folder => (
          <TouchableOpacity
            key={folder}
            onPress={() => setSelectedFolder(folder)}
            style={[
              styles.filterBtn,
              selectedFolder === folder && styles.filterActive,
            ]}
          >
            <Text style={{
              color: selectedFolder === folder ? "white" : "black",
              fontWeight: "bold"
            }}>
              {folder}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NOTES LIST */}
      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => String(item.id)}
        extraData={notes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                borderLeftWidth: 6,
                borderLeftColor: getCategoryColor(item.category),
              }
            ]}
            onPress={() =>
              router.push({
                pathname: "/detail",
                params: item,
              })
            }
            onLongPress={() => openMenu(item)}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.category}>{item.category}</Text>

            {item.pinned ? (
              <Text style={styles.pinnedText}>📌 Pinned</Text>
            ) : null}
          </TouchableOpacity>
        )}
      />

      {/* MODAL */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Choose Action</Text>

            {/* PIN */}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                if (!selectedNote) return;

                togglePin(
                  selectedNote.id,
                  selectedNote.pinned ? 0 : 1
                );

                loadNotes();
                closeMenu();
              }}
            >
              <Text style={styles.modalText}>
                {selectedNote?.pinned ? "Unpin" : "Pin"}
              </Text>
            </TouchableOpacity>

            {/* EDIT */}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                if (!selectedNote) return;

                closeMenu();

                router.push({
                  pathname: "/edit-note",
                  params: selectedNote,
                });
              }}
            >
              <Text style={styles.modalText}>Edit</Text>
            </TouchableOpacity>

            {/* DELETE */}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                if (!selectedNote) return;

                Alert.alert("Delete", "Are you sure?", [
                  { text: "Cancel" },
                  {
                    text: "Delete",
                    onPress: () => {
                      deleteNote(selectedNote.id);
                      loadNotes();
                    },
                  },
                ]);

                closeMenu();
              }}
            >
              <Text style={[styles.modalText, { color: "red" }]}>
                Delete
              </Text>
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={closeMenu}
            >
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add-note")}
      >
        <Text style={{ color: "white" }}>+ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  filterBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },

  filterActive: {
    backgroundColor: "green",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  noteTitle: {
    fontWeight: "bold",
  },

  category: {
    color: "gray",
  },

  pinnedText: {
    marginTop: 5,
    color: "#f39c12",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  modalBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});