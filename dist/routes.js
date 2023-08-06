"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("./db"));
const router = (0, express_1.Router)();
// This route handles requests to the root path '/'
router.get("/", (req, res) => {
    res.send("Welcome to the To-Do List App!");
});
//This route gets all tasks
router.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM todos");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching todos", error);
        res.status(500).json({ error: "Error fetching todos" });
    }
}));
//this creates tasks
router.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: "Task is required" });
    }
    try {
        const result = yield db_1.default.query("INSERT INTO todos (task) VALUES ($1) RETURNING *", [task]);
        const createdTodo = result.rows[0];
        res.status(201).json(createdTodo);
    }
    catch (error) {
        console.error("Error adding todo", error);
        res.status(500).json({ error: "Error adding todo" });
    }
}));
//delete task
router.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoID = parseInt(req.params.id, 10);
    try {
        yield db_1.default.query("DELETE FROM todos WHERE id = $1", [todoID]);
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error deleting todo", error);
        res.status(500).json({ error: "Error deleting todo" });
    }
}));
//updates task
router.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoID = parseInt(req.params.id, 10);
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: "Task is required" });
    }
    try {
        yield db_1.default.query("UPDATE todos SET task = $1 WHERE id = $2", [
            task,
            todoID,
        ]);
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error updating todo", error);
        res.sendStatus(500).json({ error: "Error updating todo" });
    }
}));
exports.default = router;
