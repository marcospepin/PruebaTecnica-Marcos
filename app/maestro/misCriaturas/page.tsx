"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import "@/app/globals.scss";
import "@/app/maestro-creatures.scss";

interface Creature {
  id: number;
  nombre: string;
  especie: string;
  nivel_magico: number;
  entrenada: boolean;
  habilidades: string[];
}

export default function MaestroCreatures() {
  const t = useTranslations();
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
      console.error(t('creatures.errorLoading'), error);
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
      alert(t('creatures.errorUserNotIdentified'));
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
          alert(t('creatures.errorUpdate') + ": " + (error.error || t('creatures.errorUpdateFailed')));
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
          alert(t('creatures.errorCreate') + ": " + (error.error || t('creatures.errorCreateFailed')));
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
      entrenada: false,
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
    return <div>{t('common.loading')}</div>;
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
          <h1 className="site-title">{t('common.siteName')}</h1>
          <nav className="maestro-nav">
            <LanguageSwitcher />
            <Link href="/maestro/misCriaturas" className="active">{t('navigation.myCreatures')}</Link>
            <Link href="/maestro">{t('navigation.myProfile')}</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#777777', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>{t('common.logout')}</button>
          </nav>
        </header>

        {/* Sección de criaturas */}
        <section className="maestro-section">
          <h2 className="section-title">{t('creatures.title')}</h2>
          <p className="section-subtitle">
            {t('creatures.subtitle')}
          </p>

          {showForm ? (
            <div className="creature-form-wrapper">
              <h3 className="form-heading">{editingId ? t('creatures.editCreature') : t('creatures.createCreature')}</h3>
              
              <form className="creature-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('creatures.nameMagic')}</label>
                    <input 
                      type="text" 
                      placeholder={t('creatures.namePlaceholder')}
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('creatures.creatureType')}</label>
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
                    <label>{t('creatures.powerLevel')}</label>
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
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t('creatures.trainedQuestion')}</label>
                    <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                        <input 
                          type="checkbox"
                          checked={formData.entrenada === true}
                          onChange={() => setFormData({...formData, entrenada: true})}
                          style={{width: '20px', height: '20px', cursor: 'pointer'}}
                        />
                        <span>{t('creatures.yes')}</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                        <input 
                          type="checkbox"
                          checked={formData.entrenada === false}
                          onChange={() => setFormData({...formData, entrenada: false})}
                          style={{width: '20px', height: '20px', cursor: 'pointer'}}
                        />
                        <span>{t('creatures.no')}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
                  <button 
                    type="submit" 
                    className="submit-btn"
                  >
                    {editingId ? t('creatures.updateCreature') : t('creatures.registerCreature')}
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
                    {t('common.cancel')}
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
                  {t('creatures.addNew')}
                </button>
              )}

              <div className="list-container">
                {/* Sidebar de filtros */}
                <aside className="filters-sidebar">
                  <h3 className="filters-title">{t('creatures.filter')}</h3>
                  
                  <div className="filter-section">
                    <h4 className="filter-label">{t('creatures.searchByType')}</h4>
                    {tipos.map(tipo => (
                      <label key={tipo} className="filter-checkbox">
                        <input 
                          type="checkbox"
                          checked={tempSelectedTypes.includes(tipo)}
                          onChange={() => handleTypeToggle(tipo)}
                        />
                        <span>{t(`creatures.types.${tipo}`)}</span>
                      </label>
                    ))}
                  </div>

                  <button className="confirm-btn" onClick={handleConfirmFilters}>{t('common.confirm')}</button>
                </aside>

                {/* Lista de criaturas */}
                <div className="creatures-table-wrapper">
                  {creatures.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                      <p style={{marginBottom: '1rem'}}>{t('creatures.noCreatures')}</p>
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
                        {t('creatures.createFirst')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="search-box">
                        <label>{t('creatures.magicWord')}</label>
                        <input 
                          type="text"
                          placeholder={t('creatures.name')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <table className="creatures-table">
                      <thead>
                        <tr>
                          <th>{t('creatures.name')}</th>
                          <th>{t('creatures.type')}</th>
                          <th>{t('creatures.level')}</th>
                          <th>{t('creatures.trained')}</th>
                          <th>{t('creatures.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCreatures.map(creature => (
                          <tr key={creature.id}>
                            <td>{creature.nombre}</td>
                            <td>{t(`creatures.types.${creature.especie}`)}</td>
                            <td>{toRoman(creature.nivel_magico)}</td>
                            <td>{creature.entrenada ? t('creatures.yes') : t('creatures.no')}</td>
                            <td>
                              <button 
                                className="action-btn" 
                                title={t('common.edit')}
                                onClick={() => handleEdit(creature)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="action-btn" 
                                title={t('common.delete')}
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