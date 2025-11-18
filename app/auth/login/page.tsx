'use client'; // 👈 **IMPORTANTE:** Esto lo convierte en un Client Component

import React, { useState } from 'react';
import Link from 'next/link';

// Nota: En un proyecto real, importarías useAuth o signIn de next-auth aquí.
// Usamos una simulación básica por ahora.

const LoginClientPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // **Lógica de Autenticación SIMULADA**
    console.log('Intentando iniciar sesión con:', email, 'y', password);
    
    setTimeout(() => {
        setIsLoading(false);
        // Aquí se haría la llamada a `signIn('credentials', { email, password, redirect: false })` de NextAuth
        
        if (email === 'tunombre@santuario.com' && password === '1234') {
            // Éxito simulado - Redirigir al dashboard (usarías router.push o redirect en el App Router)
            console.log('Inicio de sesión exitoso. Redirigir.');
        } else {
            setError('Credenciales no válidas. Prueba: tunombre@santuario.com / 1234');
        }
    }, 1500);
  };
  
  // La estructura del Layout la simplificamos aquí, asumiendo que el 'app/layout.tsx' 
  // no interfiere y que los estilos globales de SCSS dan la apariencia.

  return (
    <div className="app-container">
      {/* Sidebar: Imagen de Ciervo/Dragón en Login/Register */}
      <div className="sidebar" style={{ 
        backgroundImage: 'url(https://placehold.co/300x1000/000000/F8F8F8?text=Ciervo+Mágico)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Este sidebar se ocultará en pantallas pequeñas gracias al SCSS */}
      </div>
      
      <div className="main-content" style={{ maxWidth: '500px', margin: 'auto' }}>
        <h2 style={{ color: '#C77E01', marginBottom: '1.5rem', textAlign: 'center' }}>INICIA SESIÓN</h2>
        <p style={{ textAlign: 'center', color: '#777777', marginBottom: '2rem' }}>
          Para acceder a la colección de criaturas mágicas. Sólo los maestros y los cuidadores reconocidos pueden entrar.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Campo de Correo */}
          <div className="form-field">
            <label htmlFor="email">CORREO MÁGICO</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tunombre@santuario.com"
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="form-field">
            <label htmlFor="password">PALABRA MÁGICA</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
            />
          </div>

          {error && <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

          {/* Botón de Acceso */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={isLoading}>
            {isLoading ? 'ACCEDIENDO...' : 'ACCEDER AL SANTUARIO'}
          </button>
        </form>
        
        {/* Enlace a Registro */}
        <p style={{ textAlign: 'center', marginTop: '30px' }}>
          ¿No tienes cuenta? <Link href="/auth/register" style={{ color: '#9C5CE1', fontWeight: 'bold' }}>Regístrate como maestro o cuidador</Link>
        </p>
      </div>
    </div>
  );
};

// En el App Router, el archivo page.tsx exporta por defecto el componente
export default LoginClientPage;