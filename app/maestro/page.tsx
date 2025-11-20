"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "@/app/globals.scss";
import "@/app/maestro-profile.scss";

export default function MaestroProfile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [totalCreatures, setTotalCreatures] = useState(0);
  const [loadingCreatures, setLoadingCreatures] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Cargar datos actualizados del servidor
    fetchUserProfile(parsedUser.id);
    
    // Cargar el total de criaturas creadas
    fetchTotalCreatures(parsedUser.id);
  }, [router]);

  const fetchUserProfile = async (userId: number) => {
    try {
      const res = await fetch(`/api/auth/profile?userId=${userId}`);
      if (res.ok) {
        const userData = await res.json();
        setFormData({
          name: userData.name,
          email: userData.email,
          description: userData.description || "Cuéntanos sobre ti y tu pasión por las criaturas mágicas..."
        });
        // Actualizar también el user state con los datos del servidor
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      // Si falla, usar los datos del localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setFormData({
          name: parsedUser.name,
          email: parsedUser.email,
          description: parsedUser.description || "Cuéntanos sobre ti y tu pasión por las criaturas mágicas..."
        });
      }
    }
  };

  const fetchTotalCreatures = async (userId: number) => {
    try {
      setLoadingCreatures(true);
      const res = await fetch(`/api/creatures`);
      if (res.ok) {
        const creatures = await res.json();
        // La respuesta es un array directo cuando no hay userId
        const totalCount = Array.isArray(creatures) ? creatures.length : 0;
        setTotalCreatures(totalCount);
      }
    } catch (error) {
      console.error("Error al obtener criaturas:", error);
    } finally {
      setLoadingCreatures(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          email: formData.email,
          description: formData.description
        })
      });

      if (res.ok) {
        const responseData = await res.json();
        // Actualizar con los datos del servidor
        const updatedUser = { ...user, ...responseData.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert("¡Perfil actualizado correctamente!");
      } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        alert(errorData.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      description: user.description || "Cuéntanos sobre ti y tu pasión por las criaturas mágicas..."
    });
    setIsEditing(false);
  };

  const handleSaveMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSaving) {
      (e.target as HTMLButtonElement).style.background = 'var(--accent-light)';
      (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
      (e.target as HTMLButtonElement).style.boxShadow = '0 5px 15px rgba(156, 92, 225, 0.3)';
    }
  };

  const handleSaveMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.target as HTMLButtonElement).style.background = 'var(--accent-purple)';
    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
    (e.target as HTMLButtonElement).style.boxShadow = 'none';
  };

  const handleCancelMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSaving) {
      (e.target as HTMLButtonElement).style.background = 'var(--accent-gold)';
      (e.target as HTMLButtonElement).style.color = 'white';
      (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
      (e.target as HTMLButtonElement).style.boxShadow = '0 5px 15px rgba(199, 126, 1, 0.3)';
    }
  };

  const handleCancelMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.target as HTMLButtonElement).style.background = 'transparent';
    (e.target as HTMLButtonElement).style.color = 'var(--accent-gold)';
    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
    (e.target as HTMLButtonElement).style.boxShadow = 'none';
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
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>Cerrar sesión</button>
          </nav>
        </header>

        {/* Sección especial de Maestro - Estadísticas */}
        <section style={{
          background: 'var(--accent-purple)',
          color: 'white',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          boxShadow: '0 8px 20px rgba(156, 92, 225, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: '"Sedan SC", serif' }}>Resumen del Maestro</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Tarjeta de Criaturas Creadas */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>Criaturas Creadas</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>
                {loadingCreatures ? '...' : totalCreatures}
              </p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>
                {totalCreatures === 1 ? 'criatura en el santuario' : 'criaturas en el santuario'}
              </p>
            </div>

            {/* Tarjeta de Rol */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>Tu Rol</p>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0' }}>
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </p>
            </div>

            {/* Tarjeta de Bienvenida */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>Bienvenida</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>¡Hola, {user?.name}!</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>Sigue creando criaturas mágicas</p>
            </div>
          </div>
        </section>

        {/* Sección de perfil */}
        <section className="profile-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title">Mi perfil</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                title="Editar perfil"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.transform = 'scale(1)'}
              >
                ✏️
              </button>
            )}
          </div>
          <p className="section-subtitle">
            Este es el lugar donde podrás gestionar, actualizar y personalizar la información de tu perfil.
          </p>

          <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Nombre Mágico */}
            <div className="form-group">
              <label>Nombre Mágico</label>
              <input 
                type="text" 
                value={formData.name}
                readOnly={!isEditing}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Correo mágico */}
            <div className="form-group">
              <label>Correo mágico</label>
              <input 
                type="email" 
                value={formData.email}
                readOnly={!isEditing}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.description}
                readOnly={!isEditing}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button 
                  type="submit" 
                  style={{
                    fontFamily: '"Sedan SC", serif',
                    padding: '0.9rem 2rem',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    background: 'var(--accent-purple)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px',
                    opacity: isSaving ? 0.7 : 1,
                  }}
                  disabled={isSaving}
                  onMouseEnter={handleSaveMouseEnter}
                  onMouseLeave={handleSaveMouseLeave}
                >
                  {isSaving ? "Guardando..." : "✓ Guardar cambios"}
                </button>
                <button 
                  type="button" 
                  style={{
                    fontFamily: '"Sedan SC", serif',
                    padding: '0.9rem 2rem',
                    borderRadius: '50px',
                    border: '2px solid var(--accent-gold)',
                    fontSize: '1rem',
                    fontWeight: '500',
                    background: 'transparent',
                    color: 'var(--accent-gold)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px',
                    opacity: isSaving ? 0.7 : 1,
                  }}
                  onClick={handleCancel}
                  disabled={isSaving}
                  onMouseEnter={handleCancelMouseEnter}
                  onMouseLeave={handleCancelMouseLeave}
                >
                  ✕ Cancelar
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}