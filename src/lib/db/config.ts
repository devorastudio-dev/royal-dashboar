import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Kbc104301.00@db.obssszoxtomcdbafluhz.supabase.co:5432/postgres';

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool);

// Função para testar conexão
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error);
    return false;

   



  }
}

