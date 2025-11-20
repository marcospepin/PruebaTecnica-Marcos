import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const db = await getDb();

    let creatures;
    
    if (userId) {
      // Si hay userId, obtener solo las criaturas del usuario
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return NextResponse.json(
          { error: "userId inválido" },
          { status: 400 }
        );
      }

      [creatures] = await db.query(
        "SELECT id, usuario_id, nombre, especie, nivel_magico, habilidades, entrenada, fecha_creacion FROM criaturas WHERE usuario_id = ? ORDER BY fecha_creacion DESC",
        [userIdNum]
      );

      const rows = creatures as any[];
      return NextResponse.json({
        ok: true,
        creatures: rows.map((c: any) => ({
          ...c,
          habilidades: typeof c.habilidades === "string" ? JSON.parse(c.habilidades) : c.habilidades,
        }))
      });
    } else {
      // Si no hay userId, obtener todas las criaturas (para dashboard)
      [creatures] = await db.query(
        "SELECT id, usuario_id, nombre, especie, nivel_magico, habilidades, entrenada, fecha_creacion FROM criaturas ORDER BY fecha_creacion DESC"
      );

      const rows = creatures as any[];
      return NextResponse.json(
        rows.map((c: any) => ({
          ...c,
          habilidades: typeof c.habilidades === "string" ? JSON.parse(c.habilidades) : c.habilidades,
        }))
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
