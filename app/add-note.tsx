import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { addNote } from "../lib/database";

export default function AddNoteScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [customCategory, setCustomCategory] = useState("");
  const [image, setImage] = useState("");
  const [noteText, setNoteText] = useState("");

  const folders = ["Personal", "School", "Work"];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveNote = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    const finalCategory =
      customCategory.trim() !== ""
        ? customCategory
        : category;

    addNote(title, finalCategory, image, noteText);

    Alert.alert("Success", "Note saved!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { color: "#ad349d", fontWeight: "bold", fontSize: 16 }]}
      />

      <Text style={[styles.label, { color: "#69145e" }]}>
        Select Folder:
      </Text>

      <View style={styles.folderRow}>
        {folders.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => {
              setCategory(f);
              setCustomCategory("");
            }}
            style={[
              styles.folderBtn,
              category === f &&
                customCategory === "" &&
                styles.folderActive,
            ]}
          >
            <Text
              style={{
                color:
                  category === f &&
                  customCategory === ""
                    ? "#69145e"
                    : "white",
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Or type custom folder..."
        value={customCategory}
        onChangeText={setCustomCategory}
        style={[styles.input, { color: "#ad349d", fontWeight: "bold", fontSize: 16 }]}
      />

      <TextInput
        placeholder="Write note..."
        value={noteText}
        onChangeText={setNoteText}
        multiline
        style={[styles.input, { height: 120, color: "#ad349d", fontWeight: "bold", fontSize: 16 }]}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={pickImage}
      >
        <Text style={[styles.btnText, { color: "#ad349d"}]}>
          Pick Image
        </Text>
      </TouchableOpacity>

      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      ) : null}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveNote}
      >
        <Text style={styles.saveText}>
          Save Note
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#cc89dd",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#69145e",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#69145e",
    borderWidth: 1.5,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  folderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  folderBtn: {
    padding: 8,
    borderWidth: 1.5,
    borderColor: "#ff0062",
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 5,
  },

  folderActive: {
    backgroundColor: "#ffa7c9",
    borderColor: "#ff0062",
  },

  btn: {
    backgroundColor: "#fdc7dc",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderColor: "#ffabcb",
    borderWidth: 1.5,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#ca49b9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});