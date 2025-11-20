"use client";

import "@/app/globals.scss";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Cuidador",
    password: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string |null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role.toLowerCase(), // maestro / cuidador
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ha ocurrido un error al registrarte");
      } else {
        setMessage("¡Registro exitoso! Iniciando sesión...");
        
        // Iniciar sesión automáticamente con NextAuth
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.ok) {
          // Redirigir según el rol
          const role = form.role.toLowerCase();
          if (role === "maestro") {
            window.location.href = "/maestro/misCriaturas";
          } else {
            window.location.href = "/cuidador/misCriaturas";
          }
        } else {
          setError("Registro exitoso, pero hubo un error al iniciar sesión. Por favor, inicia sesión manualmente.");
        }
      }
    } catch (err) {
      setError("Ha ocurrido un error al registrarte");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-container">
      {/* Imagen lateral */}
      <div className="register-image" style={{ transform: "scaleX(-1)" }} />

      {/* Formulario */}
      <div className="register-form">
        <h1 className="title">ÚNETE AL SANTUARIO</h1>
        <p className="subtitle">
          Elige si serás un cuidador o maestro de criaturas. <br/>
          Completa los detalles para comenzar
        </p>

        <form className="form" onSubmit={handleSubmit}>
          
          <label>Nombre mágico</label>
          <input
            type="text"
            placeholder="Introduce tu nombre mágico"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Correo mágico</label>
          <input
            type="email"
            placeholder="tunombre@bestiario.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Rol</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Cuidador</option>
            <option>Maestro</option>
          </select>

          <label>Palabra mágica</label>
          <input
            type="password"
            placeholder="Introduce tu palabra mágica"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Regístrame en el santuario"}
          </button>
        </form>

        {message && <p style={{ color: "lightgreen", marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <p className="register">
          ¿Tienes cuenta? <Link href="/auth/login">Inicia sesión</Link> en el refugio
        </p>
      </div>
    </main>
  );
}
