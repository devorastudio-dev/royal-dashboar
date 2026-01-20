import { db } from './config';
import { 
  barbeiros, 
  servicos, 
  agendamentos, 
  configuracoes,
  Barbeiro,
  Servico,
  Agendamento
} from './schema';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';

// ============= BARBEIROS =============

export async function getAllBarbeiros(): Promise<Barbeiro[]> {
  const result = await db.select().from(barbeiros).orderBy(barbeiros.nome);
  return result;
}

export async function getBarbeiroById(id: number): Promise<Barbeiro | undefined> {
  const result = await db.select().from(barbeiros).where(eq(barbeiros.id, id));
  return result[0];
}

export async function getBarbeirosAtivos(): Promise<Barbeiro[]> {
  const result = await db
    .select()
    .from(barbeiros)
    .where(eq(barbeiros.status, 'ativo'))
    .orderBy(barbeiros.nome);
  return result;
}

export async function createBarbeiro(data: Omit<Barbeiro, 'id' | 'createdAt' | 'updatedAt'>): Promise<Barbeiro[]> {
  const result = await db.insert(barbeiros).values(data).returning();
  return result;
}

export async function updateBarbeiro(id: number, data: Partial<Omit<Barbeiro, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Barbeiro[]> {
  const result = await db
    .update(barbeiros)
    .set(data)
    .where(eq(barbeiros.id, id))
    .returning();
  return result;
}

export async function deleteBarbeiro(id: number): Promise<void> {
  await db.delete(barbeiros).where(eq(barbeiros.id, id));
}

// ============= SERVIÇOS =============

export async function getAllServicos(): Promise<Servico[]> {
  const result = await db.select().from(servicos).orderBy(servicos.nome);
  return result;
}

export async function getServicoById(id: number): Promise<Servico | undefined> {
  const result = await db.select().from(servicos).where(eq(servicos.id, id));
  return result[0];
}

export async function getServicosAtivos(): Promise<Servico[]> {
  const result = await db
    .select()
    .from(servicos)
    .where(eq(servicos.status, 'ativo'))
    .orderBy(servicos.nome);
  return result;
}

export async function createServico(data: Omit<Servico, 'id' | 'createdAt' | 'updatedAt'>): Promise<Servico[]> {
  const result = await db.insert(servicos).values(data).returning();
  return result;
}

export async function updateServico(id: number, data: Partial<Omit<Servico, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Servico[]> {
  const result = await db
    .update(servicos)
    .set(data)
    .where(eq(servicos.id, id))
    .returning();
  return result;
}

export async function deleteServico(id: number): Promise<void> {
  await db.delete(servicos).where(eq(servicos.id, id));
}

// ============= AGENDAMENTOS =============

export async function getAllAgendamentos(): Promise<Agendamento[]> {
  const result = await db
    .select()
    .from(agendamentos)
    .orderBy(desc(agendamentos.criadoEm));
  return result;
}

export async function getAgendamentoById(id: number): Promise<Agendamento | undefined> {
  const result = await db.select().from(agendamentos).where(eq(agendamentos.id, id));
  return result[0];
}

export async function getAgendamentosByDate(data: string): Promise<Agendamento[]> {
  const result = await db
    .select()
    .from(agendamentos)
    .where(eq(agendamentos.data, data))
    .orderBy(agendamentos.hora);
  return result;
}

export async function getAgendamentosByBarbeiro(barbeiroId: number): Promise<Agendamento[]> {
  const result = await db
    .select()
    .from(agendamentos)
    .where(eq(agendamentos.barbeiroId, barbeiroId))
    .orderBy(desc(agendamentos.criadoEm));
  return result;
}

export async function getAgendamentosByStatus(status: string): Promise<Agendamento[]> {
  const result = await db
    .select()
    .from(agendamentos)
    .where(eq(agendamentos.status, status))
    .orderBy(desc(agendamentos.criadoEm));
  return result;
}

export async function getAgendamentosHoje(): Promise<Agendamento[]> {
  const hoje = new Date().toISOString().split('T')[0];
  return getAgendamentosByDate(hoje);
}

export async function createAgendamento(data: Omit<Agendamento, 'id' | 'criadoEm' | 'updatedAt'>): Promise<Agendamento[]> {
  const result = await db.insert(agendamentos).values(data).returning();
  return result;
}

export async function updateAgendamento(id: number, data: Partial<Omit<Agendamento, 'id' | 'criadoEm' | 'updatedAt'>>): Promise<Agendamento[]> {
  const result = await db
    .update(agendamentos)
    .set(data)
    .where(eq(agendamentos.id, id))
    .returning();
  return result;
}

export async function deleteAgendamento(id: number): Promise<void> {
  await db.delete(agendamentos).where(eq(agendamentos.id, id));
}

// ============= CONFIGURAÇÕES =============

export async function getConfiguracao(): Promise<typeof configuracoes.$inferSelect | undefined> {
  const result = await db.select().from(configuracoes).limit(1);
  return result[0];
}

export async function updateConfiguracao(id: number, data: Partial<typeof configuracoes.$inferInsert>): Promise<typeof configuracoes.$inferSelect[]> {
  const result = await db
    .update(configuracoes)
    .set(data)
    .where(eq(configuracoes.id, id))
    .returning();
  return result;
}

// ============= ESTATÍSTICAS =============

export async function getEstatisticasDashboard() {
  const hoje = new Date().toISOString().split('T')[0];
  
  const agendamentosHoje = await getAgendamentosByDate(hoje);
  
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const fimSemana = new Date();
  fimSemana.setDate(fimSemana.getDate() + (6 - fimSemana.getDay()));
  
  const todosAgendamentos = await getAllAgendamentos();
  const agendamentosSemana = todosAgendamentos.filter(a => {
    const data = new Date(a.data);
    return data >= inicioSemana && data <= fimSemana;
  });

  const confirmadosHoje = agendamentosHoje.filter(a => a.status === 'confirmado').length;
  const pendentesHoje = agendamentosHoje.filter(a => a.status === 'pendente').length;
  const canceladosHoje = agendamentosHoje.filter(a => a.status === 'cancelado').length;

  // Serviços mais agendados
  const servicosCount: Record<number, number> = {};
  todosAgendamentos.forEach((a) => {
    servicosCount[a.servicoId] = (servicosCount[a.servicoId] || 0) + 1;
  });
  const servicosMaisAgendados = Object.entries(servicosCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([servicoId, count]) => ({
      servico: getServicoById(parseInt(servicoId)),
      count,
    }));

  // Barbeiro com maior demanda
  const barbeirosCount: Record<number, number> = {};
  todosAgendamentos.forEach((a) => {
    barbeirosCount[a.barbeiroId] = (barbeirosCount[a.barbeiroId] || 0) + 1;
  });
  const barbeiroMaisDemandado = Object.entries(barbeirosCount)
    .sort(([, a], [, b]) => b - a)[0];

  // Taxa de cancelamento
  const total = todosAgendamentos.length;
  const cancelados = todosAgendamentos.filter(a => a.status === 'cancelado').length;
  const taxaCancelamento = total > 0 ? (cancelados / total) * 100 : 0;

  // Receita de hoje
  let receitaHoje = 0;
  for (const a of agendamentosHoje.filter(a => a.status === 'confirmado')) {
    const servico = await getServicoById(a.servicoId);
    if (servico?.valor) {
      receitaHoje += Number(servico.valor);
    }
  }

  return {
    agendamentosHoje: agendamentosHoje.length,
    confirmadosHoje,
    pendentesHoje,
    canceladosHoje,
    agendamentosSemana: agendamentosSemana.length,
    servicosMaisAgendados,
    barbeiroMaisDemandado: barbeiroMaisDemandado
      ? {
          barbeiro: await getBarbeiroById(parseInt(barbeiroMaisDemandado[0])),
          count: barbeiroMaisDemandado[1],
        }
      : null,
    taxaCancelamento: taxaCancelamento.toFixed(1),
    receitaHoje,
  };
}

