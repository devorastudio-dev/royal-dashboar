// Dados mockados para o sistema de agendamento da Royal Barbearia

export interface Barbeiro {
  id: string;
  nome: string;
  especialidade: string;
  foto?: string;
  status: "ativo" | "inativo";
  diasTrabalho: number[]; // 0 = Domingo, 1 = Segunda, etc.
  horarioInicio: string;
  horarioFim: string;
  pausaInicio?: string;
  pausaFim?: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  duracao: number; // em minutos
  valor: number;
  status: "ativo" | "inativo";
  barbeiroId?: string; // opcional, se null aplica a todos
}

export interface Agendamento {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  servicoId: string;
  barbeiroId: string;
  data: string;
  hora: string;
  status: "pendente" | "confirmado" | "cancelado" | "concluido";
  observacoes?: string;
  criadoEm: string;
}

export interface Configuracao {
  diasAtivos: number[];
  horarioAbertura: string;
  horarioFechamento: string;
  intervaloAtendimento: number; // em minutos
  bloqueios: {
    data: string;
    motivo: string;
  }[];
}

// Dados iniciais
export const barbeiros: Barbeiro[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    especialidade: "Barbeiro Master",
    foto: "",
    status: "ativo",
    diasTrabalho: [1, 2, 3, 4, 5, 6],
    horarioInicio: "09:00",
    horarioFim: "19:00",
    pausaInicio: "12:00",
    pausaFim: "13:00",
  },
  {
    id: "2",
    nome: "Marcos Santos",
    especialidade: "Especialista em Cortes",
    foto: "",
    status: "ativo",
    diasTrabalho: [2, 3, 4, 5, 6],
    horarioInicio: "10:00",
    horarioFim: "20:00",
    pausaInicio: "14:00",
    pausaFim: "14:30",
  },
  {
    id: "3",
    nome: "Roberto Oliveira",
    especialidade: "Barbeiro Sênior",
    foto: "",
    status: "ativo",
    diasTrabalho: [1, 3, 5],
    horarioInicio: "08:00",
    horarioFim: "18:00",
  },
];

export const servicos: Servico[] = [
  {
    id: "1",
    nome: "Corte Masculino",
    descricao: "Corte de cabelo masculino moderno",
    duracao: 30,
    valor: 45,
    status: "ativo",
  },
  {
    id: "2",
    nome: "Barba",
    descricao: "Aparar e modelar a barba",
    duracao: 20,
    valor: 35,
    status: "ativo",
  },
  {
    id: "3",
    nome: "Corte + Barba",
    descricao: "Pacote completo",
    duracao: 50,
    valor: 70,
    status: "ativo",
  },
  {
    id: "4",
    nome: "Sobrancelha",
    descricao: "Design de sobrancelha",
    duracao: 15,
    valor: 20,
    status: "ativo",
  },
  {
    id: "5",
    nome: "Hidratação",
    descricao: "Tratamento hidratação capilar",
    duracao: 30,
    valor: 40,
    status: "ativo",
  },
  {
    id: "6",
    nome: "Pigmentação",
    descricao: "Pigmentação de cabelo ou barba",
    duracao: 40,
    valor: 60,
    status: "ativo",
  },
];

export const agendamentos: Agendamento[] = [
  {
    id: "1",
    clienteNome: "João Pedro",
    clienteTelefone: "(11) 99999-1111",
    servicoId: "1",
    barbeiroId: "1",
    data: new Date().toISOString().split("T")[0],
    hora: "09:00",
    status: "confirmado",
    observacoes: "Primeira vez",
    criadoEm: new Date().toISOString(),
  },
  {
    id: "2",
    clienteNome: "Lucas Martins",
    clienteTelefone: "(11) 88888-2222",
    servicoId: "2",
    barbeiroId: "1",
    data: new Date().toISOString().split("T")[0],
    hora: "10:00",
    status: "pendente",
    criadoEm: new Date().toISOString(),
  },
  {
    id: "3",
    clienteNome: "Ricardo Souza",
    clienteTelefone: "(11) 77777-3333",
    servicoId: "3",
    barbeiroId: "2",
    data: new Date().toISOString().split("T")[0],
    hora: "11:00",
    status: "confirmado",
    criadoEm: new Date().toISOString(),
  },
  {
    id: "4",
    clienteNome: "Bruno Costa",
    clienteTelefone: "(11) 66666-4444",
    servicoId: "1",
    barbeiroId: "1",
    data: new Date().toISOString().split("T")[0],
    hora: "14:00",
    status: "pendente",
    observacoes: "Cliente vip",
    criadoEm: new Date().toISOString(),
  },
  {
    id: "5",
    clienteNome: "Paulo Ferreira",
    clienteTelefone: "(11) 55555-5555",
    servicoId: "4",
    barbeiroId: "2",
    data: new Date().toISOString().split("T")[0],
    hora: "15:00",
    status: "cancelado",
    criadoEm: new Date().toISOString(),
  },
  {
    id: "6",
    clienteNome: "Diego Almeida",
    clienteTelefone: "(11) 44444-6666",
    servicoId: "1",
    barbeiroId: "3",
    data: new Date().toISOString().split("T")[0],
    hora: "16:00",
    status: "confirmado",
    criadoEm: new Date().toISOString(),
  },
];

export const configuracao: Configuracao = {
  diasAtivos: [1, 2, 3, 4, 5, 6],
  horarioAbertura: "08:00",
  horarioFechamento: "20:00",
  intervaloAtendimento: 15,
  bloqueios: [
    {
      data: "2024-12-25",
      motivo: "Natal",
    },
    {
      data: "2024-01-01",
      motivo: "Ano Novo",
    },
  ],
};

// Funções auxiliares
export function getBarbeiroById(id: string): Barbeiro | undefined {
  return barbeiros.find((b) => b.id === id);
}

export function getServicoById(id: string): Servico | undefined {
  return servicos.find((s) => s.id === id);
}

export function getAgendamentosByDate(data: string): Agendamento[] {
  return agendamentos.filter((a) => a.data === data);
}

export function getAgendamentosByBarbeiro(barbeiroId: string): Agendamento[] {
  return agendamentos.filter((a) => a.barbeiroId === barbeiroId);
}

export function getAgendamentosByStatus(status: string): Agendamento[] {
  return agendamentos.filter((a) => a.status === status);
}

// Funções de estatísticas
export function getEstatisticasDashboard() {
  const hoje = new Date().toISOString().split("T")[0];
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const fimSemana = new Date();
  fimSemana.setDate(fimSemana.getDate() + (6 - fimSemana.getDay()));

  const agendamentosHoje = agendamentos.filter((a) => a.data === hoje);
  const agendamentosSemana = agendamentos.filter((a) => {
    const data = new Date(a.data);
    return data >= inicioSemana && data <= fimSemana;
  });

  const confirmadosHoje = agendamentosHoje.filter(
    (a) => a.status === "confirmado"
  ).length;
  const pendentesHoje = agendamentosHoje.filter(
    (a) => a.status === "pendente"
  ).length;
  const canceladosHoje = agendamentosHoje.filter(
    (a) => a.status === "cancelado"
  ).length;

  // Serviços mais agendados
  const servicosCount: Record<string, number> = {};
  agendamentos.forEach((a) => {
    servicosCount[a.servicoId] = (servicosCount[a.servicoId] || 0) + 1;
  });
  const servicosMaisAgendados = Object.entries(servicosCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([servicoId, count]) => ({
      servico: getServicoById(servicoId),
      count,
    }));

  // Barbeiro com maior demanda
  const barbeirosCount: Record<string, number> = {};
  agendamentos.forEach((a) => {
    barbeirosCount[a.barbeiroId] = (barbeirosCount[a.barbeiroId] || 0) + 1;
  });
  const barbeiroMaisDemandado = Object.entries(barbeirosCount)
    .sort(([, a], [, b]) => b - a)[0];

  // Taxa de cancelamento
  const total = agendamentos.length;
  const cancelados = agendamentos.filter((a) => a.status === "cancelado").length;
  const taxaCancelamento = total > 0 ? (cancelados / total) * 100 : 0;

  return {
    agendamentosHoje: agendamentosHoje.length,
    confirmadosHoje,
    pendentesHoje,
    canceladosHoje,
    agendamentosSemana: agendamentosSemana.length,
    servicosMaisAgendados,
    barbeiroMaisDemandado: barbeiroMaisDemandado
      ? {
          barbeiro: getBarbeiroById(barbeiroMaisDemandado[0]),
          count: barbeiroMaisDemandado[1],
        }
      : null,
    taxaCancelamento: taxaCancelamento.toFixed(1),
    receitaHoje: agendamentosHoje
      .filter((a) => a.status === "confirmado")
      .reduce((acc: number, a: Agendamento) => {
        const servico = getServicoById(a.servicoId);
        return acc + (servico?.valor || 0);
      }, 0),
  };
}

