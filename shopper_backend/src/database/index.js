require("dotenv").config();
import { createConnection } from "mysql2/promise";
export async function getConnection() {
  try {
    const connection = await createConnection({
      host: process.env.HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}
