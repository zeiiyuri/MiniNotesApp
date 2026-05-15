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
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { updateNote } from "../lib/database";

export default function EditNoteScreen() {
  const params = useLocalSearchParams();

  const [title, setTitle] = useState(
    String(params.title ?? "")
  );

  // ✅ KEEP ORIGINAL CATEGORY AS DEFAULT
  const [category, setCategory] = useState(
    String(params.category ?? "")
  );

  const [customCategory, setCustomCategory] =
    useState("");

  const [image, setImage] = useState(
    String(params.image ?? "")
  );

  const [noteText, setNoteText] = useState(
    String(params.noteText ?? "")
  );

  const folders = ["Personal", "School", "Work"];

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveUpdate = () => {
    try {
      const id = Number(params.id);

      if (!id) {
        Alert.alert("Error", "Invalid note ID");
        return;
      }

      const finalCategory =
        customCategory.trim() !== ""
          ? customCategory
          : category; // ✅ KEEP ORIGINAL IF NOT CHANGED

      updateNote(
        id,
        title,
        finalCategory,
        image,
        noteText
      );

      Alert.alert("Success", "Note updated!");

      router.back();
    } catch (err: any) {
      console.log("UPDATE ERROR:", err);
      Alert.alert(
        "Error",
        "Failed to update note"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit Note
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={styles.input}
      />

      {/* SHOW CURRENT CATEGORY FIRST */}
      <Text style={styles.label}>
        Current Folder: {category}
      </Text>

      {/* FOLDER OPTIONS */}
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
                    ? "white"
                    : "black",
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CUSTOM CATEGORY INPUT */}
      <TextInput
        placeholder="Or type new folder (optional)"
        value={customCategory}
        onChangeText={setCustomCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="Write note..."
        value={noteText}
        onChangeText={setNoteText}
        multiline
        style={[styles.input, { height: 120 }]}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={pickImage}
      >
        <Text style={styles.btnText}>
          Change Image
        </Text>
      </TouchableOpacity>

      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.img}
        />
      ) : null}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveUpdate}
      >
        <Text style={styles.saveText}>
          Save Changes
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
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 5,
  },

  folderActive: {
    backgroundColor: "green",
    borderColor: "green",
  },

  btn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  img: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});