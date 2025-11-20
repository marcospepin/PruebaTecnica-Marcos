"use client";

import "@/app/globals.scss";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const locale = useLocale();
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
        
        // Redirigir según el rol usando window.location con locale
        if (session?.user?.role === "maestro") {
          window.location.href = `/${locale}/maestro/misCriaturas`;
        } else if (session?.user?.role === "cuidador") {
          window.location.href = `/${locale}/cuidador/misCriaturas`;
        } else {
          window.location.href = `/${locale}`;
        }
      }
    } catch (err) {
      setError(t('error'));
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      {/* Imagen lateral */}
      <div className="login-image" />

      {/* Formulario */}
      <div className="login-form">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <LanguageSwitcher />
        </div>
        
        <h1 className="title">{t('title')}</h1>
        <p className="subtitle">{t('subtitle')}</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>{t('email')}</label>
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

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

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>{error}</p>
        )}

        <p className="register">
          {t('noAccount')} <Link href="/auth/register">{t('registerLink')}</Link> {t('registerText')}
        </p>
      </div>
    </main>
  );
}
