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

  const loadNotes = () => {
    try {
      const data = getNotes();
      setNotes(data || []);
    } catch (err) {
      console.log("LOAD ERROR:", err);
      setNotes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();

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
      "#34dbdb",
      "#f064aa",
      "#9b59b6",
      "#2ecc71",
      "#e74c3c",
      "#f1a258",
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

      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Choose Action</Text>

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
              <Text style={[styles.modalText, { color: "#ad349d" }]}>
                {selectedNote?.pinned ? "Unpin" : "Pin"}
              </Text>
            </TouchableOpacity>

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
              <Text style={[styles.modalText, { color: "#ad349d" }]}>Edit</Text>
            </TouchableOpacity>

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

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={closeMenu}
            >
              <Text style={[styles.modalText, { color: "#ad349d" }]}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

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
    backgroundColor: "#cc89dd",
  },

  title: {
    color: "#69145e",
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
    borderWidth: 1.5,
    borderColor: "#69145e",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#ff98c0",
  },

  filterActive: {
    backgroundColor: "#69145e",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#69145e",
    borderWidth: 1.5,
  },

  noteTitle: {
    fontWeight: "bold",
    color: "#fd69a2",
    fontSize: 18,
  },

  category: {
    color: "#a54298",
  },

  pinnedText: {
    marginTop: 5,
    color: "#46c0ba",
    fontWeight: "bold",
  },

  addBtn: {
    backgroundColor: "#ca49b9",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    marginBottom: 70,
    color:"#f0bacf",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fac2d8",
    borderRadius: 10,
    borderColor: "#69145e",
    borderWidth: 2,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    color: "#ff619e",
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