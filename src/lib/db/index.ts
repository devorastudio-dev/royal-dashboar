export { db, testConnection, pool } from './config';
export { 
  barbeiros, 
  servicos, 
  agendamentos, 
  configuracoes,
  barbeirosRelations,
  servicosRelations,
  agendamentosRelations
} from './schema';
export type { 
  Barbeiro, 
  NewBarbeiro, 
  Servico, 
  NewServico, 
  Agendamento, 
  NewAgendamento,
  Configuracao,
  NewConfiguracao
} from './schema';

