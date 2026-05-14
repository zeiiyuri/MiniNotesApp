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

  const save = () => {
    if (!title || !category) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    addNote(title, category, image);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={{ color: "white" }}>Pick Image</Text>
      </TouchableOpacity>

      {image ? <Image source={{ uri: image }} style={styles.img} /> : null}

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={{ color: "white" }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold" },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  btn: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  img: { width: "100%", height: 200, borderRadius: 10 },

  saveBtn: {
    backgroundColor: "blue",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
});