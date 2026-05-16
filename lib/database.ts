import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("notes.db");

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT,
      image TEXT,
      noteText TEXT
    );
  `);

  try {
    db.execSync(`ALTER TABLE notes ADD COLUMN pinned INTEGER DEFAULT 0;`);
    console.log("✅ pinned column added");
  } catch (e) {
  }
};

export const addNote = (
  title: string,
  category: string,
  image: string,
  noteText: string
) => {
  db.runSync(
    `INSERT INTO notes (title, category, image, noteText, pinned)
     VALUES (?, ?, ?, ?, 0)`,
    [title, category, image, noteText]
  );
};

export const getNotes = () => {
  return db.getAllSync("SELECT * FROM notes");
};

export const updateNote = (
  id: number,
  title: string,
  category: string,
  image: string,
  noteText: string
) => {
  db.runSync(
    `UPDATE notes 
     SET title=?, category=?, image=?, noteText=? 
     WHERE id=?`,
    [title, category, image, noteText, id]
  );
};

export const togglePin = (id: number, pinned: number) => {
  db.runSync(
    `UPDATE notes SET pinned=? WHERE id=?`,
    [pinned, id]
  );
};

export const deleteNote = (id: number) => {
  db.runSync(
    `DELETE FROM notes WHERE id=?`,
    [id]
  );
};