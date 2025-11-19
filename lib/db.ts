import mysql from "mysql2/promise";

let connection: mysql.Connection | null = null;

export async function getDb() {
  if (!connection) {
    connection = await mysql.createConnection(process.env.DATABASE_URL as string);
  }
  return connection;
}
