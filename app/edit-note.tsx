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

  const [title, setTitle] = useState(params.title as string);
  const [category, setCategory] = useState(params.category as string);
  const [image, setImage] = useState(params.image as string);

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

  const saveUpdate = () => {
    try {
      updateNote(
        Number(params.id),
        title,
        category,
        image || ""
      );

      Alert.alert("Success", "Note updated!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
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

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={{ color: "white" }}>Change Image</Text>
      </TouchableOpacity>

      {image ? <Image source={{ uri: image }} style={styles.img} /> : null}

      <TouchableOpacity style={styles.saveBtn} onPress={saveUpdate}>
        <Text style={{ color: "white" }}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },

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