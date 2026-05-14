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
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [noteText, setNoteText] = useState("");

  // PICK IMAGE
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow photo access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // SAVE NOTE (FIXED)
  const saveNote = () => {
    try {
      if (!title.trim() || !category.trim()) {
        Alert.alert("Error", "Please fill title and category");
        return;
      }

      // 🔥 FIX: MATCH DATABASE FUNCTION EXACTLY
      addNote(title, category, image, noteText);

      Alert.alert("Success", "Note saved!");

      router.back();
    } catch (err: any) {
      console.log("SAVE ERROR:", err);
      Alert.alert("Error", "Failed to save note");
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

      {/* OPTIONAL NOTE TEXT */}
      <TextInput
        placeholder="Write note..."
        value={noteText}
        onChangeText={setNoteText}
        multiline
        style={[styles.input, { height: 120 }]}
      />

      {/* PICK IMAGE */}
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Pick Image</Text>
      </TouchableOpacity>

      {/* IMAGE PREVIEW */}
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : null}

      {/* SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
        <Text style={styles.saveText}>Save Note</Text>
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

  btn: {
    backgroundColor: "#444",
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