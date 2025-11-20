"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import "@/app/globals.scss";
import "@/app/cuidador-creatures.scss";

interface Creature {
  id: number;
  nombre: string;
  especie: string;
  nivel_magico: number;
  elemento: string;
  habilidades: string[];
}

export default function CuidadorCreatures() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "Dragón",
    nivel_magico: 1,
    elemento: "Fuego",
    habilidades: [] as string[]
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  const tipos = ["Dragón", "Fénix", "Unicornio", "Grifo", "Hada"];
  const elementos = ["Fuego", "Agua", "Tierra", "Aire", "Luz", "Oscuridad"];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadCreatures(parsedUser.id);
  }, [router]);

  const loadCreatures = async (userId: number) => {
    try {
      const res = await fetch(`/api/creatures?userId=${userId}`);
      const data = await res.json();
      if (data.ok) {
        setCreatures(data.creatures);
      }
    } catch (error) {
      console.error("Error al cargar criaturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      if (editingId) {
        // Actualizar
        const res = await fetch(`/api/creatures/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: user.id,
            ...formData
          })
        });
        if (res.ok) {
          setEditingId(null);
          resetForm();
          loadCreatures(user.id);
          setShowForm(false);
        }
      } else {
        // Crear - ahora va a [id]/route.ts con POST
        const res = await fetch("/api/creatures/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: user.id,
            ...formData
          })
        });
        if (res.ok) {
          resetForm();
          loadCreatures(user.id);
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (creature: Creature) => {
    setFormData({
      nombre: creature.nombre,
      especie: creature.especie,
      nivel_magico: creature.nivel_magico,
      elemento: creature.elemento,
      habilidades: typeof creature.habilidades === 'string' 
        ? JSON.parse(creature.habilidades) 
        : creature.habilidades || []
    });
    setEditingId(creature.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      especie: "Dragón",
      nivel_magico: 1,
      elemento: "Fuego",
      habilidades: []
    });
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const filteredCreatures = creatures.filter(creature => {
    const matchesSearch = creature.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(creature.especie);
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Acceso denegado</div>;
  }

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
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#777777', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>Cerrar sesión</button>
          </nav>
        </header>

        {/* Sección de criaturas */}
        <section className="creatures-section">
          <h2 className="section-title">Mis criaturas</h2>
          <p className="section-subtitle">
            Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una
            tiene habilidades únicas y características especiales
          </p>

          {creatures.length === 0 && !showForm ? (
            <div className="empty-state">
              <p className="empty-message">
                Aún no has añadido ninguna criatura al santuario
                <br />
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-purple)',
                    fontSize: '1rem',
                    fontFamily: '"Sedan", serif',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    transition: 'color 0.3s',
                    marginTop: '0.5rem',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = 'var(--accent-light)'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'var(--accent-purple)'}
                >
                  ¡Empieza tu colección ahora!
                </button>
              </p>
            </div>
          ) : (
            <>
              {showForm && (
                <div className="creature-form-wrapper">
                  <h3 className="form-heading">{editingId ? "Editar criatura mágica" : "Creador de criaturas mágicas"}</h3>
                  
                  <form className="creature-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre mágico de la criatura</label>
                        <input 
                          type="text" 
                          placeholder="Introduce el nombre de la criatura"
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Tipo de criatura</label>
                        <select 
                          value={formData.especie}
                          onChange={(e) => setFormData({...formData, especie: e.target.value})}
                        >
                          {tipos.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
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
                          value={formData.nivel_magico || 1}
                          onChange={(e) => setFormData({...formData, nivel_magico: parseInt(e.target.value) || 1})}
                        />
                      </div>

                      <div className="form-group">
                        <label>Elemento</label>
                        <select 
                          value={formData.elemento}
                          onChange={(e) => setFormData({...formData, elemento: e.target.value})}
                        >
                          {elementos.map(elem => (
                            <option key={elem} value={elem}>{elem}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
                      <button 
                        type="submit" 
                        className="submit-btn"
                      >
                        {editingId ? "Actualizar criatura" : "Registrar criatura"}
                      </button>
                      <button 
                        type="button" 
                        className="submit-btn"
                        style={{background: '#999'}}
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de criaturas */}
              {creatures.length > 0 && (
                <div className="creatures-list-view">
                  {!showForm && (
                    <button 
                      className="add-new-btn"
                      onClick={() => setShowForm(true)}
                    >
                      Añadir nueva criatura
                    </button>
                  )}

                  <div className="list-container">
                    {/* Sidebar de filtros */}
                    <aside className="filters-sidebar">
                      <h3 className="filters-title">Filtrar</h3>
                      
                      <div className="filter-section">
                        <h4 className="filter-label">Buscar por tipo</h4>
                        {tipos.map(tipo => (
                          <label key={tipo} className="filter-checkbox">
                            <input 
                              type="checkbox"
                              checked={selectedTypes.includes(tipo)}
                              onChange={() => handleTypeToggle(tipo)}
                            />
                            <span>{tipo}</span>
                          </label>
                        ))}
                      </div>
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
                            <th>Elemento</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCreatures.map(creature => (
                            <tr key={creature.id}>
                              <td>{creature.nombre}</td>
                              <td>{creature.especie}</td>
                              <td>{creature.nivel_magico}</td>
                              <td>{creature.elemento}</td>
                              <td>
                                <button 
                                  className="action-btn" 
                                  title="Editar"
                                  onClick={() => handleEdit(creature)}
                                >
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
            </>
          )}
        </section>
      </div>
    </main>
  );
}