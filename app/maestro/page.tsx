"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import "@/app/globals.scss";
import "@/app/maestro-profile.scss";

export default function MaestroProfile() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [totalCreatures, setTotalCreatures] = useState(0);
  const [loadingCreatures, setLoadingCreatures] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // Cargar datos actualizados del servidor
    fetchUserProfile(parseInt(session.user.id));
    
    // Cargar el total de criaturas creadas
    fetchTotalCreatures(parseInt(session.user.id));
  }, [session, status, router]);

  const fetchUserProfile = async (userId: number) => {
    try {
      const res = await fetch(`/api/auth/profile?userId=${userId}`);
      if (res.ok) {
        const userData = await res.json();
        setFormData({
          name: userData.name,
          email: userData.email,
          description: userData.description || t('profile.descriptionPlaceholderMaestro')
        });
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      // Si falla, usar los datos de la sesión
      if (session?.user) {
        setFormData({
          name: session.user.name,
          email: session.user.email,
          description: t('profile.descriptionPlaceholderMaestro')
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
    signOut({ callbackUrl: "/auth/login" });
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
          userId: session?.user?.id,
          name: formData.name,
          email: formData.email,
          description: formData.description
        })
      });

      if (res.ok) {
        setIsEditing(false);
        alert(t('profile.updateSuccess'));
      } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        alert(errorData.error || t('profile.updateError'));
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(t('profile.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (session?.user) {
      setFormData({
        name: session.user.name,
        email: session.user.email,
        description: t('profile.descriptionPlaceholderMaestro')
      });
    }
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

  if (status === "loading") {
    return <div>{t('common.loading')}</div>;
  }

  if (!session?.user) {
    return null;
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
          <h1 className="site-title">{t('common.siteName')}</h1>
          <nav className="profile-nav">
            <LanguageSwitcher />
            <Link href="/maestro/misCriaturas">{t('navigation.myCreatures')}</Link>
            <Link href="/maestro" className="active">{t('navigation.myProfile')}</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1rem', fontFamily: '"Sedan", serif' }}>{t('common.logout')}</button>
          </nav>
        </header>

        {/* Sección especial de Maestro - Estadísticas */}
        <section style={{
          background: 'var(--accent-purple)',
          color: 'white',
          padding: '1.2rem 1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          marginTop: '1rem',
          marginLeft: '1rem',
          marginRight: '2rem',
          maxWidth: '900px',
          boxShadow: '0 8px 20px rgba(156, 92, 225, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontFamily: '"Sedan SC", serif', margin: '0 0 1rem 0' }}>{t('maestro.summaryTitle')}</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            {/* Tarjeta de Criaturas Creadas */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.4rem' }}>{t('maestro.creaturesCreated')}</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>
                {loadingCreatures ? '...' : totalCreatures}
              </p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.4rem' }}>
                {totalCreatures === 1 ? t('maestro.creatureInSanctuary') : t('maestro.creaturesInSanctuary')}
              </p>
            </div>

            {/* Tarjeta de Rol */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.4rem' }}>{t('maestro.yourRole')}</p>
              <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '0' }}>
                {t(`roles.${session.user.role}`)}
              </p>
            </div>

            {/* Tarjeta de Bienvenida */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.4rem' }}>{t('maestro.welcome')}</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>{t('maestro.greeting', { name: session.user.name })}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.4rem' }}>{t('maestro.keepCreating')}</p>
            </div>
          </div>
        </section>

        {/* Sección de perfil */}
        <section className="profile-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title">{t('profile.title')}</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                title={t('common.edit')}
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
            {t('profile.subtitle')}
          </p>

          <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Nombre Mágico */}
            <div className="form-group">
              <label>{t('profile.magicName')}</label>
              <input 
                type="text" 
                value={formData.name}
                readOnly={!isEditing}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Correo mágico */}
            <div className="form-group">
              <label>{t('profile.magicEmail')}</label>
              <input 
                type="email" 
                value={formData.email}
                readOnly={!isEditing}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Rol */}
            <div className="form-group">
              <label>{t('profile.role')}</label>
              <input 
                type="text" 
                value={t(`roles.${session.user.role}`)} 
                readOnly 
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>{t('profile.description')}</label>
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
                  {isSaving ? t('common.saving') : `✓ ${t('common.save')}`}
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
                  ✕ {t('common.cancel')}
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}