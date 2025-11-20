import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creatureId = Number(params.id);

    // Validar ID
    if (!creatureId || isNaN(creatureId)) {
      return NextResponse.json(
        { error: "ID de criatura inválido" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1. Comprobar que existe
    const [rows] = await db.query(
      "SELECT id FROM criaturas WHERE id = ?",
      [creatureId]
    );

    const creatures = rows as any[];

    if (creatures.length === 0) {
      return NextResponse.json(
        { error: "La criatura no existe" },
        { status: 404 }
      );
    }

    // 2. Eliminar
    await db.query("DELETE FROM criaturas WHERE id = ?", [creatureId]);

    return NextResponse.json({
      ok: true,
      message: "Criatura eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
