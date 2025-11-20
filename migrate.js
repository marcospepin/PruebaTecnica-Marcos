const mysql = require('mysql2/promise');

async function addDescriptionColumn() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'santuario'
    });

    console.log('Conectado a la base de datos...');

    try {
      // Intentar agregar la columna
      await connection.query(
        `ALTER TABLE usuarios ADD COLUMN description VARCHAR(500) DEFAULT 'Cuéntanos sobre ti y tu pasión por las criaturas mágicas...'`
      );
      console.log('✓ Columna description agregada exitosamente');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ La columna description ya existe');
      } else {
        throw error;
      }
    }

    // Verificar la estructura de la tabla
    const [columns] = await connection.query('DESCRIBE usuarios');
    console.log('\nEstructura actual de la tabla usuarios:');
    console.table(columns);

    await connection.end();
    console.log('\n✓ Migración completada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addDescriptionColumn();
