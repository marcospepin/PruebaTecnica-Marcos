import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Faltan campos obligatorio" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Comprobar si el email ya está registrado
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 409 }
      );
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar en base de datos
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hash, role.toLowerCase()]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
