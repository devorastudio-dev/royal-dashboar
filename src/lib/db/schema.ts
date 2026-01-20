import { pgTable, serial, text, varchar, integer, timestamp, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabela de Barbeiros
export const barbeiros = pgTable('barbeiros', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 100 }).notNull(),
  especialidade: varchar('especialidade', { length: 100 }),
  foto: text('foto'),
  status: varchar('status', { length: 20 }).default('ativo').notNull(), // 'ativo' | 'inativo'
  diasTrabalho: integer('dias_trabalho').array(), // 0 = Domingo, 1 = Segunda, etc.
  horarioInicio: varchar('horario_inicio', { length: 5 }),
  horarioFim: varchar('horario_fim', { length: 5 }),
  pausaInicio: varchar('pausa_inicio', { length: 5 }),
  pausaFim: varchar('pausa_fim', { length: 5 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de Serviços
export const servicos = pgTable('servicos', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 100 }).notNull(),
  descricao: text('descricao'),
  duracao: integer('duracao').notNull(), // em minutos
  valor: decimal('valor', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('ativo').notNull(), // 'ativo' | 'inativo'
  barbeiroId: integer('barbeiro_id'), // opcional, se null aplica a todos
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de Agendamentos
export const agendamentos = pgTable('agendamentos', {
  id: serial('id').primaryKey(),
  clienteNome: varchar('cliente_nome', { length: 100 }).notNull(),
  clienteTelefone: varchar('cliente_telefone', { length: 20 }).notNull(),
  servicoId: integer('servico_id').notNull(),
  barbeiroId: integer('barbeiro_id').notNull(),
  data: varchar('data', { length: 10 }).notNull(), // formato: YYYY-MM-DD
  hora: varchar('hora', { length: 5 }).notNull(),
  status: varchar('status', { length: 20 }).default('pendente').notNull(), // 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
  observacoes: text('observacoes'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de Configurações
export const configuracoes = pgTable('configuracoes', {
  id: serial('id').primaryKey(),
  diasAtivos: integer('dias_ativos').array(),
  horarioAbertura: varchar('horario_abertura', { length: 5 }),
  horarioFechamento: varchar('horario_fechamento', { length: 5 }),
  intervaloAtendimento: integer('intervalo_atendimento').default(15), // em minutos
  bloqueios: jsonb('bloqueios').default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const barbeirosRelations = relations(barbeiros, ({ many }) => ({
  servicos: many(servicos),
  agendamentos: many(agendamentos),
}));

export const servicosRelations = relations(servicos, ({ one, many }) => ({
  barbeiro: one(barbeiros, {
    fields: [servicos.barbeiroId],
    references: [barbeiros.id],
  }),
  agendamentos: many(agendamentos),
}));

export const agendamentosRelations = relations(agendamentos, ({ one }) => ({
  servico: one(servicos, {
    fields: [agendamentos.servicoId],
    references: [servicos.id],
  }),
  barbeiro: one(barbeiros, {
    fields: [agendamentos.barbeiroId],
    references: [barbeiros.id],
  }),
}));

// Types TypeScript
export type Barbeiro = typeof barbeiros.$inferSelect;
export type NewBarbeiro = typeof barbeiros.$inferInsert;
export type Servico = typeof servicos.$inferSelect;
export type NewServico = typeof servicos.$inferInsert;
export type Agendamento = typeof agendamentos.$inferSelect;
export type NewAgendamento = typeof agendamentos.$inferInsert;
export type Configuracao = typeof configuracoes.$inferSelect;
export type NewConfiguracao = typeof configuracoes.$inferInsert;

