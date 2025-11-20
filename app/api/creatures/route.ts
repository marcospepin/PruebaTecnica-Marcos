import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Obtener todas las criaturas del usuario
    const [creatures] = await db.query(
      "SELECT id, nombre, especie, nivel_magico, habilidades, elemento, fecha_creacion FROM criaturas WHERE usuario_id = ? ORDER BY fecha_creacion DESC",
      [userId]
    );

    return NextResponse.json({
      ok: true,
      creatures: creatures,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { usuarioId, nombre, especie, nivelMagico, habilidades, elemento } = await req.json();

    if (!usuarioId || !nombre || !especie) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.query(
      "INSERT INTO criaturas (usuario_id, nombre, especie, nivel_magico, habilidades, elemento) VALUES (?, ?, ?, ?, ?, ?)",
      [usuarioId, nombre, especie, nivelMagico || 1, JSON.stringify(habilidades || []), elemento]
    );

    const rows = result as any[];

    return NextResponse.json({
      ok: true,
      message: "Criatura creada exitosamente",
      creatureId: rows[0].insertId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
