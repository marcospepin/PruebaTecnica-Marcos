"use client";

import Link from 'next/link';
import { useState } from "react";
import "@/app/globals.scss";
import "@/app/cuidador-creatures.scss";

export default function Creatures() {
  const [showForm, setShowForm] = useState(false);
  const [creatures, setCreatures] = useState<any[]>([]);

  return (
    <main className="creatures-container">
      {/* Sidebar con imagen */}
      <aside className="creatures-sidebar">
        <div className="creatures-image" />
      </aside>

      {/* Contenido principal */}
      <div className="creatures-content">
        {/* Header */}
        <header className="creatures-header">
          <h1 className="site-title">El Santuario</h1>
          <nav className="creatures-nav">
            <Link href="/cuidador/misCriaturas" className="active">Mis criaturas</Link>
            <Link href="/cuidador">Mi perfil</Link>
            <Link href="/auth/login">Cerrar sesión</Link>
          </nav>
        </header>

        {/* Sección de criaturas */}
        <section className="creatures-section">
          <h2 className="section-title">Mis criaturas</h2>
          <p className="section-subtitle">
            Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una
            tiene habilidades únicas y características especiales
          </p>

          {/* Formulario de creación o lista vacía */}
          {creatures.length === 0 && !showForm ? (
            <div className="empty-state">
              <p className="empty-message">
                Aún no has añadido ninguna criatura al santuario
                <br />
                ¡Empieza tu colección ahora!
              </p>
              <button 
                className="add-creature-btn"
                onClick={() => setShowForm(true)}
              >
                Añadir nueva criatura
              </button>
            </div>
          ) : (
            <>
              {showForm && (
                <div className="creature-form-wrapper">
                  <h3 className="form-heading">Creador de criaturas mágicas</h3>
                  
                  <form className="creature-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre mágico de la criatura</label>
                        <input 
                          type="text" 
                          placeholder="Introduce el nombre de la criatura"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tipo de criatura</label>
                        <select defaultValue="Fénix">
                          <option value="Fénix">Fénix</option>
                          <option value="Dragón">Dragón</option>
                          <option value="Unicornio">Unicornio</option>
                          <option value="Grifo">Grifo</option>
                          <option value="Hada">Hada</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Nivel de poder</label>
                        <input 
                          type="number" 
                          placeholder="1"
                          min="1"
                          max="100"
                        />
                      </div>

                      <div className="form-group checkbox-group">
                        <label>¿Entrenada?</label>
                        <div className="checkbox-options">
                          <label className="checkbox-label">
                            <input type="checkbox" name="trained" value="si" />
                            <span>Sí</span>
                          </label>
                          <label className="checkbox-label">
                            <input type="checkbox" name="trained" value="no" />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowForm(false);
                        // Aquí iría la lógica para guardar la criatura
                      }}
                    >
                      Registrar criatura
                    </button>
                  </form>
                </div>
              )}

              {/* Lista de criaturas (cuando haya) */}
              {creatures.length > 0 && (
                <div className="creatures-list">
                  {/* Aquí irían las criaturas */}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}