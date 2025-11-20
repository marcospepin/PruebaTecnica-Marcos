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
    const result = await db.query(
      "UPDATE usuarios SET name = ?, email = ?, description = ? WHERE id = ?",
      [name, email, description, userId]
    );

    console.log("Resultado de actualización:", result);

    return NextResponse.json(
      { ok: true, message: "Perfil actualizado correctamente" },
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
