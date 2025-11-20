"use client";

import "@/app/globals.scss";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Cuidador",
    password: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string |null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

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
      setMessage("Registro completado. ¡Bienvenido al Santuario!");
    }
  }

  return (
    <main className="register-container">
      {/* Imagen lateral */}
      <div className="register-image" />

      {/* Formulario */}
      <div className="register-form">
        <h1 className="title">ÚNETE AL SANTUARIO</h1>
        <p className="subtitle">
          Elige si serás un cuidador o maestro de criaturas.  
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

          <button type="submit">Regístrame en el santuario</button>
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
