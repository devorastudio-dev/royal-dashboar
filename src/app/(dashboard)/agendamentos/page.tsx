"use client";

import { useState } from "react";
import {
  Plus,
  MagnifyingGlass,
  Funnel,
  Phone,
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  CalendarPlus,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { agendamentos, barbeiros, servicos, getBarbeiroById, getServicoById, type Agendamento } from "@/lib/data";
import { formatDate, formatTime, getStatusColor } from "@/lib/utils";

export default function AgendamentosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [barbeiroFilter, setBarbeiroFilter] = useState("all");
  const [agendamentosList, setAgendamentosList] = useState(agendamentos);

  const filteredAgendamentos = agendamentosList.filter((agendamento) => {
    const matchesSearch =
      agendamento.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.clienteTelefone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || agendamento.status === statusFilter;
    const matchesBarbeiro =
      barbeiroFilter === "all" || agendamento.barbeiroId === barbeiroFilter;
    return matchesSearch && matchesStatus && matchesBarbeiro;
  });

  const updateStatus = (id: string, newStatus: Agendamento["status"]) => {
    setAgendamentosList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "success" | "warning" | "info" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "info"> = {
      confirmado: "success",
      pendente: "warning",
      cancelado: "destructive",
      concluido: "info",
    };
    return variants[status] || "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os agendamentos da barbearia
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="concluido">Concluido</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={barbeiroFilter} onValueChange={setBarbeiroFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Barbeiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {barbeiros.map((barbeiro) => (
                  <SelectItem key={barbeiro.id} value={barbeiro.id}>
                    {barbeiro.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agenda do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda de Hoje - {formatDate(new Date())}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Servico</TableHead>
                <TableHead>Barbeiro</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgendamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum agendamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgendamentos.map((agendamento) => {
                  const barbeiro = getBarbeiroById(agendamento.barbeiroId);
                  const servico = getServicoById(agendamento.servicoId);
                  return (
                    <TableRow key={agendamento.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{agendamento.clienteNome}</p>
                            <p className="text-sm text-muted-foreground">
                              {agendamento.clienteTelefone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-muted-foreground" />
                          <span>{servico?.nome || "Servico nao encontrado"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{barbeiro?.nome || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{agendamento.hora}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(agendamento.status)}>
                          {agendamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {agendamento.status === "pendente" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateStatus(agendamento.id, "confirmado")}
                                title="Confirmar"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateStatus(agendamento.id, "cancelado")}
                                title="Cancelar"
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {agendamento.status === "confirmado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(agendamento.id, "concluido")}
                              title="Concluir"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Reagendar">
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Ligar para o cliente"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

