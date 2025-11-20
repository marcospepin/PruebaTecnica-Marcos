import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creatureId = params.id;

    const db = await getDb();

    // Obtener criatura específica
    const [creatures] = await db.query(
      "SELECT id, usuario_id, nombre, especie, nivel_magico, habilidades, elemento, fecha_creacion FROM criaturas WHERE id = ?",
      [creatureId]
    );

    const rows = creatures as any[];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Criatura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      creature: rows[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creatureId = params.id;
    const { usuarioId, nombre, especie, nivelMagico, habilidades, elemento } = await req.json();

    const db = await getDb();

    // Verificar que la criatura pertenece al usuario
    const [creatures] = await db.query(
      "SELECT usuario_id FROM criaturas WHERE id = ?",
      [creatureId]
    );

    const rows = creatures as any[];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Criatura no encontrada" },
        { status: 404 }
      );
    }

    if (rows[0].usuario_id !== usuarioId) {
      return NextResponse.json(
        { error: "No tienes permiso para editar esta criatura" },
        { status: 403 }
      );
    }

    // Actualizar criatura
    await db.query(
      "UPDATE criaturas SET nombre = ?, especie = ?, nivel_magico = ?, habilidades = ?, elemento = ? WHERE id = ?",
      [nombre, especie, nivelMagico, JSON.stringify(habilidades || []), elemento, creatureId]
    );

    return NextResponse.json({
      ok: true,
      message: "Criatura actualizada exitosamente",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creatureId = params.id;
    const url = new URL(req.url);
    const usuarioId = url.searchParams.get("usuarioId");

    if (!usuarioId) {
      return NextResponse.json(
        { error: "usuarioId es requerido" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Verificar que la criatura pertenece al usuario
    const [creatures] = await db.query(
      "SELECT usuario_id FROM criaturas WHERE id = ?",
      [creatureId]
    );

    const rows = creatures as any[];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Criatura no encontrada" },
        { status: 404 }
      );
    }

    if (rows[0].usuario_id !== parseInt(usuarioId)) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta criatura" },
        { status: 403 }
      );
    }

    // Eliminar criatura
    await db.query(
      "DELETE FROM criaturas WHERE id = ?",
      [creatureId]
    );

    return NextResponse.json({
      ok: true,
      message: "Criatura eliminada exitosamente",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
