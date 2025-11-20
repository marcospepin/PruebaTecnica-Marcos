import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { usuarioId, nombre, especie, nivelMagico, nivel_magico, habilidades, elemento } = await req.json();

    if (!usuarioId || !nombre || !especie) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const levelToUse = nivel_magico || nivelMagico || 1;

    const result = await db.query(
      "INSERT INTO criaturas (usuario_id, nombre, especie, nivel_magico, habilidades, elemento) VALUES (?, ?, ?, ?, ?, ?)",
      [usuarioId, nombre, especie, levelToUse, JSON.stringify(habilidades || []), elemento]
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: creatureId } = await params;

    const db = await getDb();

    // Obtener criatura específica por ID
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const creatureId = parseInt(idParam);
    const { usuarioId, nombre, especie, nivelMagico, nivel_magico, habilidades, elemento } = await req.json();

    // Usar nivel_magico si viene en snake_case, si no usar nivelMagico
    const levelToUse = nivel_magico || nivelMagico;
    const usuarioIdNum = parseInt(String(usuarioId));

    if (isNaN(creatureId) || isNaN(usuarioIdNum)) {
      return NextResponse.json(
        { error: "IDs inválidos" },
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

    if (parseInt(String(rows[0].usuario_id)) !== usuarioIdNum) {
      return NextResponse.json(
        { error: "No tienes permiso para editar esta criatura" },
        { status: 403 }
      );
    }

    // Actualizar criatura
    await db.query(
      "UPDATE criaturas SET nombre = ?, especie = ?, nivel_magico = ?, habilidades = ?, elemento = ? WHERE id = ?",
      [nombre, especie, levelToUse, JSON.stringify(habilidades || []), elemento, creatureId]
    );

    return NextResponse.json({
      ok: true,
      message: "Criatura actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error en PUT:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    
    // Si el id es "new", no se puede eliminar
    if (idParam === "new") {
      return NextResponse.json(
        { error: "ID de criatura inválido" },
        { status: 400 }
      );
    }

    const creatureId = parseInt(idParam);
    const url = new URL(req.url);
    const usuarioIdParam = url.searchParams.get("usuarioId");
    
    console.log("🔍 DELETE - ID:", idParam, "Parsed:", creatureId, "usuarioId:", usuarioIdParam);
    
    if (!usuarioIdParam) {
      return NextResponse.json(
        { error: "usuarioId es requerido" },
        { status: 400 }
      );
    }

    const usuarioId = parseInt(usuarioIdParam);

    if (isNaN(creatureId)) {
      console.error("❌ creatureId es NaN:", idParam);
      return NextResponse.json(
        { error: "ID de criatura inválido" },
        { status: 400 }
      );
    }

    if (isNaN(usuarioId)) {
      console.error("❌ usuarioId es NaN:", usuarioIdParam);
      return NextResponse.json(
        { error: "ID de usuario inválido" },
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

    const dbUsuarioId = parseInt(String(rows[0].usuario_id));
    
    if (dbUsuarioId !== usuarioId) {
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
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
