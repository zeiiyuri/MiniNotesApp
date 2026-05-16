import { useEffect, useState } from "react";
import {
SafeAreaView,
StyleSheet,
Text,
TouchableOpacity,
View,
} from "react-native";

import CounterDisplay from "../components/CounterDisplay";

export default function HomeScreen() {
const [count, setCount] = useState(0);
const [isRunning, setIsRunning] = useState(false);

useEffect(() => {
let interval: any;

```
if (isRunning) {
  interval = setInterval(() => {
    setCount((prev) => prev + 1);
  }, 1000);
}

return () => {
  clearInterval(interval);
};
```

}, [isRunning]);

const increase = () => {
setCount(count + 1);
};

const decrease = () => {
setCount(count - 1);
};

const toggleTimer = () => {
setIsRunning(!isRunning);
};

return ( <SafeAreaView style={styles.container}> <Text style={styles.title}>
Counter + Timer App </Text>

```
  <CounterDisplay count={count} />

  <View style={styles.row}>
    <TouchableOpacity
      style={styles.button}
      onPress={decrease}
    >
      <Text style={styles.buttonText}>-</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={increase}
    >
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  </View>

  <TouchableOpacity
    style={[
      styles.startStopBtn,
      {
        backgroundColor: isRunning
          ? "#e74c3c"
          : "#2ecc71",
      },
    ]}
    onPress={toggleTimer}
  >
    <Text style={styles.startStopText}>
      {isRunning ? "Stop" : "Start"}
    </Text>
  </TouchableOpacity>
</SafeAreaView>
```

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#f3e8ff",
justifyContent: "center",
alignItems: "center",
padding: 20,
},

title: {
fontSize: 32,
fontWeight: "bold",
marginBottom: 40,
color: "#4b0082",
},

row: {
flexDirection: "row",
marginBottom: 30,
},

button: {
backgroundColor: "#6a0dad",
width: 80,
height: 80,
borderRadius: 40,
justifyContent: "center",
alignItems: "center",
marginHorizontal: 15,
elevation: 5,
},

buttonText: {
color: "white",
fontSize: 36,
fontWeight: "bold",
},

startStopBtn: {
paddingVertical: 15,
paddingHorizontal: 50,
borderRadius: 30,
elevation: 5,
},

startStopText: {
color: "white",
fontSize: 20,
fontWeight: "bold",
},
});
