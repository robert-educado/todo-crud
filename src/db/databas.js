import Database from "better-sqlite3";

// Öppnar databasen eller skapar den om den inte finns.
const db = new Database("todo.db");

// Skapa nödvändiga tabeller. IF NOT EXISTS säkerställer att vi 
// vi enbart försöker skapa tabell om den inte redan finns.
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    -- SQLite har ingen BOOLEAN, därför lagrar vi som heltal.
    -- 0 = false, 1 = true
    completed INTEGER NOT NULL DEFAULT 0
  );

  -- Lägg till exempeldata endast om tabellen är tom
  INSERT INTO tasks (name, completed)
  SELECT 'Handla mat', 1
  WHERE NOT EXISTS (SELECT 1 FROM tasks);

  INSERT INTO tasks (name, completed)
  SELECT 'Städa lägenheten', 0
  WHERE NOT EXISTS (
    SELECT 1 FROM tasks WHERE name = 'Städa lägenheten'
  );

  INSERT INTO tasks (name, completed)
  SELECT 'Göra klart JavaScript-övningen', 0
  WHERE NOT EXISTS (
    SELECT 1 FROM tasks WHERE name = 'Göra klart JavaScript-övningen'
  );
`);

// Exportera db-objekt så det kan importeras och användas på de
// ställen i applikationen där vi behöver kommunicera med databasen.
export default db;
