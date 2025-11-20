-- Añadir columna description a la tabla usuarios si no existe
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Cuéntanos sobre ti y tu pasión por las criaturas mágicas...';
