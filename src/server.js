import express from "express";
import db from "./db/databas.js";

const port = process.env.PORT || 8000;

const app = express();

// Vi behöver denna när vi behöver ta emot POST, PUT, PATCH
app.use(express.json());

// TODO (ONSDAG)
// # Server-sidan
// - vi vill använda en service (taskService)
// - vill flytta routes till ./routes/taskRoutes.js
// - implementera PATCH
// # Klient-sidan
// - bygga ett gränssnitt som låter oss
//    - lista alla uppgifter
//    - lägga till en uppgift
//    - radera en uppgift
//    - uppdatera en uppgift

// GET /api/tasks
app.get("/api/tasks", (req, res) => {

    const tasks = db.prepare("SELECT * FROM tasks").all();

    res.json(tasks);
});

// POST /api/tasks
app.post("/api/tasks", (req, res) => {

    // {
    //   name: "Vattna blommorna"
    // }

    // req.body är just nu undefined - vad behöver vi göra för att det här ska fungera?
    const name = req.body.name;
    //const { name } = req.body;

    // Validering – Kontrollerar att name är en sträng och inte är tom
    // trim() – Tar bort inledande och avslutande blanksteg
    // "     "    trim()  => "" == false
    if (typeof name !== "string" || !name.trim() || !name.trim().length >= 50) {
        // 400 Bad Request
        return res.sendStatus(400);
    }

    // skapa uppgift
    const result = db
        .prepare("INSERT INTO tasks (name) VALUES (?)")
        .run(name);

    const createdTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(result.lastInsertRowid);

    res.status(201).json(createdTask);
});

// :id = route parameter
app.delete("/api/tasks/:id", (req, res) => {

    // Vi kommer åt route-parameterar vid req.params
    const id = Number(req.params.id);

    const result = db
        .prepare("DELETE FROM tasks WHERE id = ?")
        .run(id);

    // true eller false
    const deleted = result.changes > 0;

    if (!deleted) {
        res.sendStatus(404); // 404 Not Found
    }
    
    res.sendStatus(204);
});

// PUT
app.put("/api/tasks/:id", (req, res) => {

    // Vi kommer åt route-parameterar vid req.params
    const id = Number(req.params.id);

    // TODO: Leta upp produkten
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

    if (!task) {
        return res.sendStatus(404);
    }

    const {
        name,
        completed
    } = req.body;

    db.prepare(`
        UPDATE tasks 
           SET name = ?, 
               completed = ?
         WHERE id = ?`)
    .run(name, completed, id);

    // 204 No Content (utan body)
    res.sendStatus(204);
});

// PATCH
app.patch("/api/tasks/:id", (req, res) => {

    // Vi kommer åt route-parameterar vid req.params
    const id = Number(req.params.id);

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

    if (!task) {
        return res.sendStatus(404);
    }

    const {
        name,
        completed
    } = req.body;

    // TODO: Implementera PATCH

    // 204 No Content (utan body)
    res.sendStatus(204);
});


app.listen(port, () => {
    console.log(`Listening on localhost: ${port}`);
});