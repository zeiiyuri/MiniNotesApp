import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("notes.db");

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT
    );
  `);
};

// READ
export const getNotes = () => {
  return db.getAllSync("SELECT * FROM notes");
};

// CREATE
export const addNote = (title: string, category: string) => {
  db.runSync(
    "INSERT INTO notes (title, category) VALUES (?, ?)",
    [title, category]
  );
};

// UPDATE
export const updateNote = (id: number, title: string, category: string) => {
  db.runSync(
    "UPDATE notes SET title = ?, category = ? WHERE id = ?",
    [title, category, id]
  );
};