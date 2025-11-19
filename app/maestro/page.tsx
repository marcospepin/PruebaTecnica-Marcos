"use client";

import Link from 'next/link';
import "@/app/globals.scss";
import "@/app/maestro-profile.scss";

export default function MaestroProfile() {
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
            <Link href="/auth/login">Cerrar sesión</Link>
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
                value="Jaime el valiente" 
                readOnly 
              />
            </div>

            {/* Correo mágico */}
            <div className="form-group">
              <label>Correo mágico</label>
              <input 
                type="email" 
                value="jaime_valiente@bestiario.com" 
                readOnly 
              />
            </div>

            {/* Rol */}
            <div className="form-group">
              <label>Rol</label>
              <input 
                type="text" 
                value="Maestro" 
                readOnly 
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                rows={4}
                defaultValue="Soy Jaime el Valiente, maestro en el arte de invocar y dominar criaturas. En mis partidas, cada criatura tiene una historia, un propósito, y un papel crucial en las épicas aventuras. Desde dragones imponentes hasta criaturas misteriosas de los bosques."
                readOnly
              />
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}