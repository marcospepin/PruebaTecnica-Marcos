const mysql = require('mysql2/promise');

async function updateCreaturesTable() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'santuario'
    });

    console.log('Conectado a la base de datos...');

    try {
      // Verificar si existe la columna elemento
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = 'santuario' 
         AND TABLE_NAME = 'criaturas' 
         AND COLUMN_NAME = 'elemento'`
      );

      if (columns.length > 0) {
        // Eliminar la columna elemento
        await connection.query('ALTER TABLE criaturas DROP COLUMN elemento');
        console.log('✓ Columna elemento eliminada exitosamente');
      } else {
        console.log('✓ La columna elemento ya no existe');
      }
    } catch (error) {
      console.error('Error al eliminar elemento:', error.message);
    }

    try {
      // Verificar si existe la columna entrenada
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = 'santuario' 
         AND TABLE_NAME = 'criaturas' 
         AND COLUMN_NAME = 'entrenada'`
      );

      if (columns.length === 0) {
        // Agregar la columna entrenada
        await connection.query(
          'ALTER TABLE criaturas ADD COLUMN entrenada TINYINT(1) DEFAULT 0'
        );
        console.log('✓ Columna entrenada agregada exitosamente');
      } else {
        console.log('✓ La columna entrenada ya existe');
      }
    } catch (error) {
      console.error('Error al agregar entrenada:', error.message);
    }

    // Verificar la estructura actualizada de la tabla
    const [structure] = await connection.query('DESCRIBE criaturas');
    console.log('\nEstructura actual de la tabla criaturas:');
    console.table(structure);

    await connection.end();
    console.log('\n✓ Migración completada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateCreaturesTable();
