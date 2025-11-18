import "@/app/globals.scss";

export default function Home() {
  return (
    <main className="login-container">
      {/* Imagen lateral */}
      <div className="login-image" />

      {/* Formulario */}
      <div className="login-form">
        <h1 className="title">INICIA SESION</h1>
        <p className="subtitle">
          Para acceder a la colección de criaturas mágicas.  
          Sólo los maestros y los cuidadores reconocidos pueden entrar
        </p>

        <form className="form">
          <label>Correo mágico</label>
          <input type="email" placeholder="tunombre@santuario.com" />

          <label>Palabra mágica</label>
          <input type="password" placeholder="Introduce tu contraseña" />

          <button type="submit">Acceder al santuario</button>
        </form>

        <p className="register">
          ¿No tienes cuenta? Regístrate como maestro o cuidador
        </p>
      </div>
    </main>
  );
}
