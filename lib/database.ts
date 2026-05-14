import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("notes.db");

// MUST RUN ON APP START
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
};

// CREATE NOTE (SAFE + LOGGING)
export const addNote = (
  title: string,
  category: string,
  image: string,
  noteText: string
) => {
  try {
    console.log("ADDING NOTE:", { title, category, image, noteText });

    db.runSync(
      `INSERT INTO notes (title, category, image, noteText)
       VALUES (?, ?, ?, ?)`,
      [
        title ?? "",
        category ?? "",
        image ?? "",
        noteText ?? "",
      ]
    );
  } catch (err) {
    console.log("❌ ADD NOTE ERROR:", err);
    throw err;
  }
};

// GET NOTES
export const getNotes = () => {
  try {
    return db.getAllSync("SELECT * FROM notes") ?? [];
  } catch (err) {
    console.log("❌ GET ERROR:", err);
    return [];
  }
};

// UPDATE NOTE
export const updateNote = (
  id: number,
  title: string,
  category: string,
  image: string,
  noteText: string
) => {
  try {
    db.runSync(
      `UPDATE notes 
       SET title=?, category=?, image=?, noteText=? 
       WHERE id=?`,
      [title ?? "", category ?? "", image ?? "", noteText ?? "", id]
    );
  } catch (err) {
    console.log("❌ UPDATE ERROR:", err);
    throw err;
  }
};

// DELETE NOTE
export const deleteNote = (id: number) => {
  db.runSync(`DELETE FROM notes WHERE id=?`, [id]);
};