"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import "@/app/globals.scss";
import "@/app/cuidador-creatures.scss";

interface Creature {
  id: number;
  nombre: string;
  especie: string;
  nivel_magico: number;
  entrenada: boolean;
  habilidades: string[];
}

export default function CuidadorCreatures() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [tempSelectedTypes, setTempSelectedTypes] = useState<string[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "Dragón",
    nivel_magico: 1,
    entrenada: false,
    habilidades: [] as string[]
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  const tipos = ["Dragón", "Fénix", "Golem", "Grifo", "Vampiro"];

  // Función para convertir números a romanos
  const toRoman = (num: number): string => {
    const romanNumerals: [number, string][] = [
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [value, numeral] of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    loadCreatures(parseInt(session.user.id));
  }, [session, status, router, locale]);

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
    setTempSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleConfirmFilters = () => {
    setSelectedTypes(tempSelectedTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      alert("Error: Usuario no identificado");
      return;
    }

    if (!formData.nombre.trim()) {
      alert(t('creatures.nameRequired'));
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
          console.error("Update error:", error);
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
        
        const responseData = await res.json();
        
        if (res.ok) {
          resetForm();
          loadCreatures(parseInt(session.user.id));
          setShowForm(false);
        } else {
          alert("Error: " + (responseData.error || "No se pudo crear la criatura"));
          console.error("Create error:", responseData);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert(t('creatures.saveError') + ": " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleEdit = (creature: Creature) => {
    setFormData({
      nombre: creature.nombre,
      especie: creature.especie,
      nivel_magico: creature.nivel_magico,
      entrenada: creature.entrenada || false,
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
      entrenada: false,
      habilidades: []
    });
    setEditingId(null);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: `/${locale}/auth/login` });
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
    <main className="creatures-container">
      {/* Sidebar con imagen */}
      <aside className="creatures-sidebar">
        <div className="creatures-image" />
      </aside>

      {/* Contenido principal */}
      <div className="creatures-content">
        {/* Header */}
        <header className="creatures-header">
          <h1 className="site-title">{t('common.siteName')}</h1>
          <nav className="creatures-nav">
            <Link href="/cuidador/misCriaturas" className="active">{t('navigation.myCreatures')}</Link>
            <Link href="/cuidador">{t('navigation.myProfile')}</Link>
            <LanguageSwitcher />
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#777777', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>{t('common.logout')}</button>
          </nav>
        </header>

        {/* Sección de criaturas */}
        <section className="creatures-section">
          <h2 className="section-title">{t('creatures.title')}</h2>
          <p className="section-subtitle">
            Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una
            tiene habilidades únicas y características especiales
          </p>

          {creatures.length === 0 && !showForm ? (
            <div className="empty-state" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              gap: '2rem'
            }}>
              <p className="empty-message" style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                {t('creatures.noCreatures')}
                <br />
                {t('creatures.addFirst')}
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  background: 'var(--accent-purple)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontFamily: '"Sedan SC", serif',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(156, 92, 225, 0.3)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'var(--accent-light)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(156, 92, 225, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'var(--accent-purple)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(156, 92, 225, 0.3)';
                }}
              >
                {t('creatures.addNew')}
              </button>
            </div>
          ) : (
            <>
              {showForm && (
                <div className="creature-form-wrapper">
                  <h3 className="form-heading">{editingId ? t('creatures.editCreature') : t('creatures.createCreature')}</h3>
                  
                  <form className="creature-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('creatures.name')}</label>
                        <input 
                          type="text" 
                          placeholder={t('creatures.name')}
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>{t('creatures.species')}</label>
                        <select 
                          value={formData.especie}
                          onChange={(e) => setFormData({...formData, especie: e.target.value})}
                        >
                          {tipos.map(tipo => (
                            <option key={tipo} value={tipo}>{t(`creatures.types.${tipo}`)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('creatures.magicLevel')}</label>
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
                        <label style={{display: 'block', marginBottom: '0.5rem'}}>{t('creatures.trained')}?</label>
                        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                            <input 
                              type="checkbox"
                              checked={formData.entrenada === true}
                              onChange={() => setFormData({...formData, entrenada: true})}
                              style={{width: '20px', height: '20px', cursor: 'pointer'}}
                            />
                            <span>Sí</span>
                          </label>
                          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                            <input 
                              type="checkbox"
                              checked={formData.entrenada === false}
                              onChange={() => setFormData({...formData, entrenada: false})}
                              style={{width: '20px', height: '20px', cursor: 'pointer'}}
                            />
                            <span>No</span>
                          </label>
                        </div>
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
                              checked={tempSelectedTypes.includes(tipo)}
                              onChange={() => handleTypeToggle(tipo)}
                            />
                            <span>{tipo}</span>
                          </label>
                        ))}
                      </div>

                      <button className="confirm-btn" onClick={handleConfirmFilters}>Confirmar</button>
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
                            <th>Entrenada</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCreatures.map(creature => (
                            <tr key={creature.id}>
                              <td>{creature.nombre}</td>
                              <td>{creature.especie}</td>
                              <td>{toRoman(creature.nivel_magico)}</td>
                              <td>{creature.entrenada ? 'Sí' : 'No'}</td>
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