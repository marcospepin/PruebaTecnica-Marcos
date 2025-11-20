"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "@/app/globals.scss";
import "@/app/maestro-profile.scss";

export default function MaestroProfile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="profile-container">
      {/* Sidebar con imagen */}
      <aside className="profile-sidebar">
        <div className="profile-image" />
      </aside>

      {/* Contenido principal */}
      <div className="profile-content">
        {/* Header */}
        <header className="profile-header">
          <h1 className="site-title">El Santuario</h1>
          <nav className="profile-nav">
            <Link href="/maestro/misCriaturas">Mis criaturas</Link>
            <Link href="/maestro" className="active">Mi perfil</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#777777', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>Cerrar sesión</button>
          </nav>
        </header>

        {/* Sección de perfil */}
        <section className="profile-section">
          <h2 className="section-title">Mi perfil</h2>
          <p className="section-subtitle">
            Este es el lugar donde podrás gestionar, actualizar y personalizar la información de tu perfil.
          </p>

          <form className="profile-form">
            {/* Nombre Mágico */}
            <div className="form-group">
              <label>Nombre Mágico</label>
              <input 
                type="text" 
                value={user.name} 
                readOnly 
              />
            </div>

            {/* Correo mágico */}
            <div className="form-group">
              <label>Correo mágico</label>
              <input 
                type="email" 
                value={user.email} 
                readOnly 
              />
            </div>

            {/* Rol */}
            <div className="form-group">
              <label>Rol</label>
              <input 
                type="text" 
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                readOnly 
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                rows={4}
                defaultValue="Cuéntanos sobre ti y tu pasión por las criaturas mágicas..."
                readOnly
              />
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}