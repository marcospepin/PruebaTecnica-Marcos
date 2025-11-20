"use client";

import "@/app/globals.scss";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function Register() {
  const t = useTranslations('auth.register');
  const tRoles = useTranslations('roles');
  const locale = useLocale();
  
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
        setError(data.error || t('error'));
      } else {
        setMessage(t('success'));
        
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
            window.location.href = `/maestro/misCriaturas`;
          } else {
            window.location.href = `/cuidador/misCriaturas`;
          }
        } else {
          setError(t('loginError'));
        }
      }
    } catch (err) {
      setError(t('error'));
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <LanguageSwitcher />
        </div>
        
        <h1 className="title">{t('title')}</h1>
        <p className="subtitle">{t('subtitle')}</p>

        <form className="form" onSubmit={handleSubmit}>
          
          <label>{t('name')}</label>
          <input
            type="text"
            placeholder={t('namePlaceholder')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>{t('email')}</label>
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>{t('role')}</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>{tRoles('cuidador')}</option>
            <option>{tRoles('maestro')}</option>
          </select>

          <label>{t('password')}</label>
          <input
            type="password"
            placeholder={t('passwordPlaceholder')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" disabled={loading}>
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>

        {message && <p style={{ color: "lightgreen", marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <p className="register">
          {t('hasAccount')} <Link href="/auth/login">{t('loginLink')}</Link> {t('loginText')}
        </p>
      </div>
    </main>
  );
}
