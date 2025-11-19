"use client";

import Link from 'next/link';
import { useState } from "react";
import "@/app/globals.scss";
import "@/app/maestro-creatures.scss";

interface Creature {
  id: number;
  name: string;
  type: string;
  level: string;
  trained: string;
}

export default function MaestroCreatures() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Datos de ejemplo
  const [creatures, setCreatures] = useState<Creature[]>([
    { id: 1, name: "Abyssaloth", type: "Fénix", level: "IV", trained: "Sí" },
    { id: 2, name: "Luminara", type: "Dragón", level: "I", trained: "Sí" },
    { id: 3, name: "Veloktron", type: "Golem", level: "II", trained: "No" },
    { id: 4, name: "Zyphra", type: "Vampiro", level: "V", trained: "Sí" },
    { id: 5, name: "Thornclaw", type: "Grifo", level: "III", trained: "No" },
  ]);

  const types = ["Dragón", "Fénix", "Golem", "Grifo", "Vampiro"];

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredCreatures = creatures.filter(creature => {
    const matchesSearch = creature.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(creature.type);
    return matchesSearch && matchesType;
  });

  return (
    <main className="maestro-creatures-container">
      {/* Sidebar con imagen */}
      <aside className="maestro-sidebar">
        <div className="maestro-image" />
      </aside>

      {/* Contenido principal */}
      <div className="maestro-content">
        {/* Header */}
        <header className="maestro-header">
          <h1 className="site-title">El Santuario</h1>
          <nav className="maestro-nav">
            <Link href="/maestro/misCriaturas" className="active">Mis criaturas</Link>
            <Link href="/maestro">Mi perfil</Link>
            <Link href="/auth/login">Cerrar sesión</Link>
          </nav>
        </header>

        {/* Sección de criaturas */}
        <section className="maestro-section">
          <h2 className="section-title">Mis criaturas</h2>
          <p className="section-subtitle">
            Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una
            tiene habilidades únicas y características especiales
          </p>

          {showForm ? (
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
                  }}
                >
                  Registrar criatura
                </button>
              </form>
            </div>
          ) : (
            <div className="creatures-list-view">
              <button 
                className="add-new-btn"
                onClick={() => setShowForm(true)}
              >
                Añadir nueva criatura
              </button>

              <div className="list-container">
                {/* Sidebar de filtros */}
                <aside className="filters-sidebar">
                  <h3 className="filters-title">Filtrar</h3>
                  
                  <div className="filter-section">
                    <h4 className="filter-label">Buscar por tipo</h4>
                    {types.map(type => (
                      <label key={type} className="filter-checkbox">
                        <input 
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>

                  <button className="confirm-btn">Confirmar</button>
                </aside>

                {/* Lista de criaturas */}
                <div className="creatures-table-wrapper">
                  <div className="search-box">
                    <label>Palabra mágica</label>
                    <input 
                      type="text"
                      placeholder="Nombre"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <table className="creatures-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Nivel</th>
                        <th>Entrenado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCreatures.map(creature => (
                        <tr key={creature.id}>
                          <td>{creature.name}</td>
                          <td>{creature.type}</td>
                          <td>{creature.level}</td>
                          <td>{creature.trained}</td>
                          <td>
                            <button className="action-btn" title="Editar">
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}