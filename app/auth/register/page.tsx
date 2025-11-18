import "@/app/globals.scss";

export default function Home() {
  return (
    <main className="register-container">
      {/* Imagen lateral */}
      <div className="register-image" />
      {/* Formulario */}
      <div className="register-form">
        <h1 className="title">ÚNETE AL SANTUARIO</h1>
        <p className="subtitle">
          Elige si serás un cuidador o maestro de criaturas.  
          Completa los detalles para comenzar
        </p>

        <form className="form">

            <label>Nombre mágico</label>
            <input type="text" placeholder="Introduce tu nombre mágico"/>

            <label>Correo mágico</label>
            <input type="email" placeholder="tunombre@bestiario.com" />

            <label>Rol</label>
            <select>
                <option>Cuidador</option>
                <option>Maestro</option>
            </select>

            <label>Palabra mágica</label>
             <input type="password" placeholder="Introduce tu palabra mágica" />

          <button type="submit">Regístrame en el santuario</button>
        </form>

        <p className="register">
          ¿Tienes cuenta? Inicia sesión en el refugio
        </p>
      </div>
    </main>
  );
}
