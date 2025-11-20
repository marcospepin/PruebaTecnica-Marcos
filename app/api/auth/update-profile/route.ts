import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, description } = await request.json();

    if (!userId || !name || !email) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Actualizar en la base de datos
    await db.query(
      "UPDATE usuarios SET name = ?, email = ?, description = ? WHERE id = ?",
      [name, email, description, userId]
    );

    // Obtener los datos actualizados para confirmar
    const [updatedUsers] = await db.query(
      "SELECT id, name, email, role, description FROM usuarios WHERE id = ?",
      [userId]
    );

    const updatedUser = (updatedUsers as any[])[0];

    return NextResponse.json(
      { 
        ok: true, 
        message: "Perfil actualizado correctamente",
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
