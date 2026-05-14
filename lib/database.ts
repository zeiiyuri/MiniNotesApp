import * as SQLite from "expo-sqlite";

// ✅ NEW SAFE API (NO openDatabase, NO tx errors)
const db = SQLite.openDatabaseSync("notes.db");

// INIT DATABASE
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT,
      image TEXT
    );
  `);
};

// CREATE
export const addNote = (
  title: string,
  category: string,
  image: string
) => {
  db.runSync(
    "INSERT INTO notes (title, category, image) VALUES (?, ?, ?)",
    [title, category, image]
  );
};

// READ
export const getNotes = () => {
  return db.getAllSync("SELECT * FROM notes");
};

// UPDATE
export const updateNote = (
  id: number,
  title: string,
  category: string,
  image: string
) => {
  db.runSync(
    "UPDATE notes SET title=?, category=?, image=? WHERE id=?",
    [title, category, image, id]
  );
};

// DELETE
export const deleteNote = (id: number) => {
  db.runSync("DELETE FROM notes WHERE id=?", [id]);
};