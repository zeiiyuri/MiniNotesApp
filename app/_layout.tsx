import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../lib/database";

export default function Layout() {
  useEffect(() => {
    initDB(); // 🔥 THIS IS REQUIRED
  }, []);

  return <Stack />;
}