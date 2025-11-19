import "@/app/globals.scss";
import "@/app/profile.scss";

export default function Profile() {
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
            <a href="/criaturas">Mis criaturas</a>
            <a href="/perfil" className="active">Mi perfil</a>
            <a href="/logout">Cerrar sesión</a>
          </nav>
        </header>

        {/* Sección de perfil */}
        <section className="profile-section">
          <h2 className="section-title">Mi perfil</h2>
          <p className="section-subtitle">
            Este es el lugar donde podrás gestionar, actualizar y personalizar la información de tu perfil.
          </p>

          <form className="profile-form">
            {/* Nombre Mágico */}
            <div className="form-group">
              <label>Nombre Mágico</label>
              <input 
                type="text" 
                value="Radagast el Jardinero" 
                readOnly 
              />
            </div>

            {/* Correo mágico */}
            <div className="form-group">
              <label>Correo mágico</label>
              <input 
                type="email" 
                value="radijar@santuario.com" 
                readOnly 
              />
            </div>

            {/* Rol */}
            <div className="form-group">
              <label>Rol</label>
              <input 
                type="text" 
                value="Cuidador" 
                readOnly 
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                rows={6}
                defaultValue="Soy un guardián del bosque y protector de criaturas mágicas. Soy un tanto excéntrico, dedico mi vida a cuidar de una vasta variedad de seres fantásticos, desde majestuosos dragones hasta diminutas hadas. Poseo un vasto conocimiento de las artes curativas y la magia antigua, lo que me permite sanar y proteger a las criaturas que encuentro en sus viajes."
              />
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}