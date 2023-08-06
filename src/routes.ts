import { Router, Request, Response } from "express";
import pool from "./db";

const router = Router();

interface Todo {
  id: number;
  title: string;
  // completed: boolean;
}

// This route handles requests to the root path '/'
router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the To-Do List App!");
});

//This route gets all tasks
router.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching todos", error);
    res.status(500).json({ error: "Error fetching todos" });
  }
});
//this creates tasks
router.post("/todos", async (req: Request, res: Response) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (task) VALUES ($1) RETURNING *",
      [task]
    );
    const createdTodo = result.rows[0];
    res.status(201).json(createdTodo);
  } catch (error) {
    console.error("Error adding todo", error);
    res.status(500).json({ error: "Error adding todo" });
  }
});

//delete task
router.delete("/todos/:id", async (req: Request, res: Response) => {
  const todoID = parseInt(req.params.id, 10);
  try {
    await pool.query("DELETE FROM todos WHERE id = $1", [todoID]);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting todo", error);
    res.status(500).json({ error: "Error deleting todo" });
  }
});

//updates task
router.put("/todos/:id", async (req: Request, res: Response) => {
  const todoID = parseInt(req.params.id, 10);
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  try {
    await pool.query("UPDATE todos SET task = $1 WHERE id = $2", [
      task,
      todoID,
    ]);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating todo", error);
    res.sendStatus(500).json({ error: "Error updating todo" });
  }
});
export default router;
