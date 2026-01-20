"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  Bell,
  Plus,
  Trash,
  ToggleLeft,
  ToggleRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { configuracao as initialConfig, type Configuracao } from "@/lib/data";

const diasSemana = [
  "Domingo",
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
];

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState(initialConfig);
  const [isBloqueioDialogOpen, setIsBloqueioDialogOpen] = useState(false);
  const [novoBloqueio, setNovoBloqueio] = useState({ data: "", motivo: "" });

  const toggleDiaAtivo = (dia: number) => {
    if (config.diasAtivos.includes(dia)) {
      setConfig({
        ...config,
        diasAtivos: config.diasAtivos.filter((d) => d !== dia),
      });
    } else {
      setConfig({
        ...config,
        diasAtivos: [...config.diasAtivos, dia],
      });
    }
  };

  const adicionarBloqueio = () => {
    if (novoBloqueio.data && novoBloqueio.motivo) {
      setConfig({
        ...config,
        bloqueios: [...config.bloqueios, novoBloqueio],
      });
      setNovoBloqueio({ data: "", motivo: "" });
      setIsBloqueioDialogOpen(false);
    }
  };

  const removerBloqueio = (index: number) => {
    setConfig({
      ...config,
      bloqueios: config.bloqueios.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Configuracoes</h1>
        <p className="text-muted-foreground">
          Configure o funcionamento da barbearia
        </p>
      </div>

      <Tabs defaultValue="funcionamento" className="space-y-6">
        <TabsList>
          <TabsTrigger value="funcionamento" className="gap-2">
            <Clock className="h-4 w-4" />
            Horario de Funcionamento
          </TabsTrigger>
          <TabsTrigger value="bloqueios" className="gap-2">
            <Calendar className="h-4 w-4" />
            Bloqueios e Feriados
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificacoes
          </TabsTrigger>
        </TabsList>

        {/* Horario de Funcionamento */}
        <TabsContent value="funcionamento">
          <Card>
            <CardHeader>
              <CardTitle>Horario de Funcionamento</CardTitle>
              <CardDescription>
                Configure os dias e horarios de funcionamento da barbearia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Dias da Semana</Label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map((dia, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={
                        config.diasAtivos.includes(index)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleDiaAtivo(index)}
                    >
                      {dia}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="abertura">Hora de Abertura</Label>
                  <Input
                    id="abertura"
                    type="time"
                    value={config.horarioAbertura}
                    onChange={(e) =>
                      setConfig({ ...config, horarioAbertura: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechamento">Hora de Fechamento</Label>
                  <Input
                    id="fechamento"
                    type="time"
                    value={config.horarioFechamento}
                    onChange={(e) =>
                      setConfig({ ...config, horarioFechamento: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intervalo">Intervalo entre Atendimentos (minutos)</Label>
                <Input
                  id="intervalo"
                  type="number"
                  min="5"
                  max="60"
                  value={config.intervaloAtendimento}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      intervaloAtendimento: parseInt(e.target.value) || 15,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Intervalo automatico entre os agendamentos
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button>Salvar Configuracoes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bloqueios e Feriados */}
        <TabsContent value="bloqueios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bloqueios e Feriados</CardTitle>
                <CardDescription>
                  Configure datas bloqueadas para manutencao ou feriados
                </CardDescription>
              </div>
              <Dialog open={isBloqueioDialogOpen} onOpenChange={setIsBloqueioDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Bloqueio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Bloqueio</DialogTitle>
                    <DialogDescription>
                      Adicione uma data bloqueada
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataBloqueio">Data</Label>
                      <Input
                        id="dataBloqueio"
                        type="date"
                        value={novoBloqueio.data}
                        onChange={(e) =>
                          setNovoBloqueio({ ...novoBloqueio, data: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motivoBloqueio">Motivo</Label>
                      <Input
                        id="motivoBloqueio"
                        placeholder="Ex: Feriado de Natal"
                        value={novoBloqueio.motivo}
                        onChange={(e) =>
                          setNovoBloqueio({ ...novoBloqueio, motivo: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBloqueioDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={adicionarBloqueio}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {config.bloqueios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum bloqueio configurado
                </div>
              ) : (
                <div className="space-y-2">
                  {config.bloqueios.map((bloqueio, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{bloqueio.motivo}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bloqueio.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => removerBloqueio(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificacoes */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configuracoes de Notificacoes</CardTitle>
              <CardDescription>
                Configure como deseja receber as notificacoes do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Confirmacao Automatica</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar confirmacao ao cliente apos agendamento
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <ToggleRight className="h-6 w-6 text-green-600" />
                  Ativado
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Lembrete de Horario</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembrete 1 dia antes do agendamento
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <ToggleRight className="h-6 w-6 text-green-600" />
                  Ativado
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Notificacao de Cancelamento</p>
                  <p className="text-sm text-muted-foreground">
                    Avisar quando um agendamento for cancelado
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                  Desativado
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Notificacoes por WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificacoes via WhatsApp para clientes
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <ToggleRight className="h-6 w-6 text-green-600" />
                  Ativado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

