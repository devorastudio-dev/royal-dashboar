"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  CurrencyDollar,
  ChartBar,
  Clock,
  XCircle,
  CheckCircle,
  TrendUp,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstatisticasDashboard, getServicoById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<ReturnType<typeof getEstatisticasDashboard> | null>(null);

  useEffect(() => {
    setStats(getEstatisticasDashboard());
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Agendamentos Hoje",
      value: stats.agendamentosHoje,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      subtext: `${stats.confirmadosHoje} confirmados, ${stats.pendentesHoje} pendentes`,
    },
    {
      title: "Agendamentos da Semana",
      value: stats.agendamentosSemana,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      subtext: "Total desta semana",
    },
    {
      title: "Receita Hoje",
      value: formatCurrency(stats.receitaHoje),
      icon: CurrencyDollar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      subtext: "Valor confirmado",
    },
    {
      title: "Taxa de Cancelamento",
      value: `${stats.taxaCancelamento}%`,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      subtext: "Do total de agendamentos",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua barbearia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Services Most Requested */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="h-5 w-5" />
              Serviços Mais Agendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.servicosMaisAgendados.map((item, index) => {
                const servico = item.servico;
                if (!servico) return null;
                const percentage = Math.round((item.count / stats.agendamentosSemana) * 100) || 0;
                return (
                  <div key={servico.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{servico.nome}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} agendamentos
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Professional */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Barbeiro Mais Demandado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.barbeiroMaisDemandado?.barbeiro ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                    {stats.barbeiroMaisDemandado.barbeiro.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{stats.barbeiroMaisDemandado.barbeiro.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.barbeiroMaisDemandado.barbeiro.especialidade}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total de agendamentos</span>
                    <span className="font-medium">{stats.barbeiroMaisDemandado.count}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum dado disponível</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Resumo do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.confirmadosHoje}</p>
                <p className="text-sm text-green-600">Confirmados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendentesHoje}</p>
                <p className="text-sm text-yellow-600">Pendentes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-700">{stats.canceladosHoje}</p>
                <p className="text-sm text-red-600">Cancelados</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
  );
}

