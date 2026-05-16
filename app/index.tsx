import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState<any>(null);

  const fetchPokemon = async () => {
    try {
      setLoading(true);

      const randomId = Math.floor(Math.random() * 150) + 1;

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );

      const data = await response.json();

      setPokemon(data);
    } catch (error) {
      console.log("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ZEIK'S JOURNAL 🎮</Text>

      <Text style={styles.subtitle}>Pick Your Pokémon</Text>

      {loading ? (
        <ActivityIndicator size="large" color="npx expo start" />
      ) : (
        pokemon && (
          <View style={styles.card}>
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.image}
            />

            <Text style={styles.name}>
              {pokemon.name.toUpperCase()}
            </Text>
          </View>
        )
      )}

      <Text
        style={styles.button}
        onPress={fetchPokemon}
      >
        🔄 Generate New Pokémon
      </Text>

      <Text
        style={styles.notesBtn}
        onPress={() => router.push("/notes")}
      >
        ➜ Go to Notes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cc89dd",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#69145e",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#69145e",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ff98c0",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  image: {
    width: 120,
    height: 120,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#69145e",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#ca49b9",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    fontWeight: "bold",
    color:"#f0bacf"
  },

  notesBtn: {
    marginTop: 15,
    color: "#fcccde",
    fontSize: 16,
  },
});