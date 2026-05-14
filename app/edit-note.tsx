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

  const [category, setCategory] = useState(
    String(params.category ?? "")
  );

  const [image, setImage] = useState(
    String(params.image ?? "")
  );

  const [noteText, setNoteText] = useState(
    String(params.noteText ?? "")
  );

  const pickImage = async () => {
    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const saveUpdate = () => {
    try {
      updateNote(
        Number(params.id),
        title ?? "",
        category ?? "",
        image ?? "",
        noteText ?? ""
      );

      Alert.alert("Success", "Note updated!");
      router.back();
    } catch (err: any) {
      console.log("UPDATE ERROR:", err);
      Alert.alert("Error", "Failed to update note");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Note</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={styles.input}
      />

      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
        style={styles.input}
      />

      {/* NOTE TEXT */}
      <TextInput
        value={noteText}
        onChangeText={setNoteText}
        placeholder="Write note..."
        multiline
        style={[styles.input, { height: 120 }]}
      />

      {/* IMAGE BUTTON */}
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={{ color: "white" }}>Change Image</Text>
      </TouchableOpacity>

      {/* IMAGE PREVIEW */}
      {image ? (
        <Image source={{ uri: image }} style={styles.img} />
      ) : null}

      {/* SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveUpdate}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
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

  btn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
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
});