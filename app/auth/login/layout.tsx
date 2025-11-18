import React, { ReactNode } from 'react';

// Interfaz para definir que el layout recibe componentes hijos
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout simple para las rutas de autenticación (/auth/*).
 * Simplemente pasa el contenido de la página (page.tsx) sin añadir elementos de navegación.
 *
 * NOTA: Los estilos globales se gestionan desde app/layout.tsx o globals.scss.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // Aquí podrías añadir un contenedor o estilos comunes si fuera necesario.
    <>{children}</>
  );
}