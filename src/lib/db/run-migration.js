// Script para testar conexão com banco e executar migração
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Kbc104301.00@db.obssszoxtomcdbafluhz.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

const migrationSQL = `
-- Criar tabela de barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    foto TEXT,
    status VARCHAR(20) DEFAULT 'ativo' NOT NULL,
    dias_trabalho INTEGER[],
    horario_inicio VARCHAR(5),
    horario_fim VARCHAR(5),
    pausa_inicio VARCHAR(5),
    pausa_fim VARCHAR(5),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Criar tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo' NOT NULL,
    barbeiro_id INTEGER REFERENCES barbeiros(id),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_nome VARCHAR(100) NOT NULL,
    cliente_telefone VARCHAR(20) NOT NULL,
    servico_id INTEGER NOT NULL REFERENCES servicos(id),
    barbeiro_id INTEGER NOT NULL REFERENCES barbeiros(id),
    data VARCHAR(10) NOT NULL,
    hora VARCHAR(5) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    dias_ativos INTEGER[],
    horario_abertura VARCHAR(5),
    horario_fechamento VARCHAR(5),
    intervalo_atendimento INTEGER DEFAULT 15,
    bloqueios JSONB DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Inserir configuração inicial
INSERT INTO configuracoes (dias_ativos, horario_abertura, horario_fechamento, intervalo_atendimento, bloqueios)
VALUES 
    (ARRAY[1, 2, 3, 4, 5, 6], '08:00', '20:00', 15, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    dias_ativos = EXCLUDED.dias_ativos,
    horario_abertura = EXCLUDED.horario_abertura,
    horario_fechamento = EXCLUDED.horario_fechamento,
    intervalo_atendimento = EXCLUDED.intervalo_atendimento,
    bloqueios = EXCLUDED.bloqueios,
    updated_at = NOW();

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro_id ON agendamentos(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_servico_id ON agendamentos(servico_id);
CREATE INDEX IF NOT EXISTS idx_servicos_barbeiro_id ON servicos(barbeiro_id);

-- Inserir dados iniciais de barbeiros
INSERT INTO barbeiros (nome, especialidade, foto, status, dias_trabalho, horario_inicio, horario_fim, pausa_inicio, pausa_fim)
VALUES 
    ('Carlos Silva', 'Barbeiro Master', '', 'ativo', ARRAY[1, 2, 3, 4, 5, 6], '09:00', '19:00', '12:00', '13:00'),
    ('Marcos Santos', 'Especialista em Cortes', '', 'ativo', ARRAY[2, 3, 4, 5, 6], '10:00', '20:00', '14:00', '14:30'),
    ('Roberto Oliveira', 'Barbeiro Sênior', '', 'ativo', ARRAY[1, 3, 5], '08:00', '18:00', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Inserir dados iniciais de serviços
INSERT INTO servicos (nome, descricao, duracao, valor, status, barbeiro_id)
VALUES 
    ('Corte Masculino', 'Corte de cabelo masculino moderno', 30, 45.00, 'ativo', NULL),
    ('Barba', 'Aparar e modelar a barba', 20, 35.00, 'ativo', NULL),
    ('Corte + Barba', 'Pacote completo', 50, 70.00, 'ativo', NULL),
    ('Sobrancelha', 'Design de sobrancelha', 15, 20.00, 'ativo', NULL),
    ('Hidratação', 'Tratamento hidratação capilar', 30, 40.00, 'ativo', NULL),
    ('Pigmentação', 'Pigmentação de cabelo ou barba', 40, 60.00, 'ativo', NULL)
ON CONFLICT DO NOTHING;
`;

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Conectando ao Supabase...');
    await client.query('SELECT NOW()');
    console.log('✅ Conexão estabelecida com sucesso!');
    
    console.log('🔄 Executando migração...');
    await client.query(migrationSQL);
    console.log('✅ Migração executada com sucesso!');
    
    // Verificar tabelas criadas
    console.log('🔄 Verificando tabelas criadas...');
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('barbeiros', 'servicos', 'agendamentos', 'configuracoes')
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas encontradas:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Contar registros
    console.log('📊 Contando registros...');
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM barbeiros) as barbeiros,
        (SELECT COUNT(*) FROM servicos) as servicos,
        (SELECT COUNT(*) FROM agendamentos) as agendamentos,
        (SELECT COUNT(*) FROM configuracoes) as configuracoes
    `);
    
    const c = counts.rows[0];
    console.log(`   - Barbeiros: ${c.barbeiros}`);
    console.log(`   - Serviços: ${c.servicos}`);
    console.log(`   - Agendamentos: ${c.agendamentos}`);
    console.log(`   - Configurações: ${c.configuracoes}`);
    
    console.log('\n🎉 Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

