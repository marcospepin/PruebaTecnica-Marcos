"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import "@/app/globals.scss";
import "@/app/maestro-creatures.scss";

interface Creature {
  id: number;
  nombre: string;
  especie: string;
  nivel_magico: number;
  elemento: string;
  habilidades: string[];
}

export default function MaestroCreatures() {
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
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
    if (status === "loading") return;
    
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    loadCreatures(parseInt(session.user.id));
  }, [session, status, router]);

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
    
    if (!session?.user?.id) {
      alert("Error: Usuario no identificado");
      return;
    }

    if (!formData.nombre.trim()) {
      alert("Por favor, introduce el nombre de la criatura");
      return;
    }

    try {
      if (editingId) {
        // Actualizar
        const res = await fetch(`/api/creatures/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: session.user.id,
            ...formData
          })
        });
        if (res.ok) {
          setEditingId(null);
          resetForm();
          loadCreatures(parseInt(session.user.id));
          setShowForm(false);
        } else {
          const error = await res.json();
          alert("Error: " + (error.error || "No se pudo actualizar la criatura"));
        }
      } else {
        // Crear
        const res = await fetch("/api/creatures/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: session.user.id,
            ...formData
          })
        });
        if (res.ok) {
          resetForm();
          loadCreatures(parseInt(session.user.id));
          setShowForm(false);
        } else {
          const error = await res.json();
          alert("Error: " + (error.error || "No se pudo crear la criatura"));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la criatura: " + (error instanceof Error ? error.message : String(error)));
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

  const handleDelete = async (id: number) => {
    console.log("🔍 ID recibido en handleDelete:", id);

    if (!session?.user) return;
    
    try {
      const userId = typeof session.user.id === 'string' ? session.user.id : String(session.user.id);
      const res = await fetch(`/api/creatures/${id}?usuarioId=${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadCreatures(parseInt(session.user.id));
      } else {
        const errorData = await res.json();
        console.error("Error al eliminar:", errorData.error || res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
    signOut({ callbackUrl: "/auth/login" });
  };

  const filteredCreatures = creatures.filter(creature => {
    const matchesSearch = creature.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(creature.especie);
    return matchesSearch && matchesType;
  });

  if (status === "loading" || loading) {
    return <div>Cargando...</div>;
  }

  if (!session?.user) {
    return null;
  }

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
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#777777', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>Cerrar sesión</button>
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
          ) : (
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
                  {creatures.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                      <p style={{marginBottom: '1rem'}}>No tienes criaturas aún.</p>
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
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = 'var(--accent-light)'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'var(--accent-purple)'}
                      >
                        ¡Crea una nueva!
                      </button>
                    </div>
                  ) : (
                    <>
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
                              <button 
                                className="action-btn" 
                                title="Eliminar"
                                onClick={() => handleDelete(creature.id)}
                                style={{color: 'red'}}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}