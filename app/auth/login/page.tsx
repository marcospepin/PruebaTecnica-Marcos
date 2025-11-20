"use client";

import "@/app/globals.scss";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Obtener la sesión primero para determinar la URL de redirección
      const testSession = await fetch("/api/auth/session");
      const currentSession = await testSession.json();
      
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.ok) {
        // Obtener la sesión actualizada para saber el rol del usuario
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        
        // Redirigir según el rol usando window.location
        if (session?.user?.role === "maestro") {
          window.location.href = "/maestro/misCriaturas";
        } else if (session?.user?.role === "cuidador") {
          window.location.href = "/cuidador/misCriaturas";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      {/* Imagen lateral */}
      <div className="login-image" />

      {/* Formulario */}
      <div className="login-form">
        <h1 className="title">INICIA SESIÓN</h1>
        <p className="subtitle">
          Para acceder a la colección de criaturas mágicas.  
          Sólo los maestros y los cuidadores reconocidos pueden entrar
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>Correo mágico</label>
          <input
            type="email"
            placeholder="tunombre@santuario.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Palabra mágica</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Accediendo..." : "Acceder al santuario"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>{error}</p>
        )}

        <p className="register">
          ¿No tienes cuenta? <Link href="/auth/register">Regístrate</Link> como maestro o cuidador
        </p>
      </div>
    </main>
  );
}
