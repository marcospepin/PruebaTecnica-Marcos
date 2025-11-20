-- Tabla para almacenar las criaturas de usuarios
CREATE TABLE IF NOT EXISTS criaturas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  especie VARCHAR(255) NOT NULL,
  nivel_magico INT DEFAULT 1,
  habilidades JSON,
  entrenada TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear índice para búsquedas rápidas por usuario
CREATE INDEX idx_usuario_id ON criaturas(usuario_id);
