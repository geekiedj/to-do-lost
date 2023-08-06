"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "yoga22lifestyle$$",
    port: 5432, // or the port you are using for PostgreSQL
});
exports.default = pool;
