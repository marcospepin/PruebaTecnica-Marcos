"use client";

import "@/app/globals.scss";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUserInfo(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al iniciar sesión");
    } else {
      setUserInfo(data.user);
      // Aquí puedes redirigir según rol:
      // if (data.user.role === "maestro") router.push("/maestro");
      // if (data.user.role === "cuidador") router.push("/cuidador");
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

          <button type="submit">Acceder al santuario</button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>{error}</p>
        )}

        {userInfo && (
          <p style={{ color: "lightgreen", marginTop: 10 }}>
            Bienvenido, {userInfo.name} — {userInfo.role}
          </p>
        )}

        <p className="register">
          ¿No tienes cuenta? Regístrate como maestro o cuidador
        </p>
      </div>
    </main>
  );
}
