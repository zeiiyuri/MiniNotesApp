import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../lib/database";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}