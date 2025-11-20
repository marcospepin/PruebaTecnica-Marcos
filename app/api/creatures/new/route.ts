import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { usuarioId, nombre, especie, nivel_magico, entrenada, habilidades } = await request.json();

    if (!usuarioId || !nombre || !especie) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Convertir habilidades a JSON si es un array
    const habilidadesJson = Array.isArray(habilidades) ? JSON.stringify(habilidades) : "[]";

    const [result] = await db.query(
      "INSERT INTO criaturas (usuario_id, nombre, especie, nivel_magico, entrenada, habilidades) VALUES (?, ?, ?, ?, ?, ?)",
      [usuarioId, nombre, especie, nivel_magico || 1, entrenada ? 1 : 0, habilidadesJson]
    );

    return NextResponse.json(
      { 
        ok: true, 
        message: "Criatura creada correctamente",
        creature: {
          id: (result as any).insertId,
          usuario_id: usuarioId,
          nombre,
          especie,
          nivel_magico: nivel_magico || 1,
          entrenada: entrenada || false,
          habilidades: habilidades || []
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear criatura:", error);
    return NextResponse.json(
      { error: "Error al crear la criatura: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
