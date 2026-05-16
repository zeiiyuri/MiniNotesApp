import { StyleSheet, Text, View } from "react-native";

type Props = {
count: number;
};

export default function CounterDisplay({ count }: Props) {
return ( <View style={styles.container}> <Text style={styles.text}>{count}</Text> </View>
);
}

const styles = StyleSheet.create({
container: {
backgroundColor: "#ffffff",
paddingVertical: 30,
paddingHorizontal: 60,
borderRadius: 20,
marginBottom: 30,
elevation: 5,
},

text: {
fontSize: 48,
fontWeight: "bold",
color: "#6a0dad",
textAlign: "center",
},
});
