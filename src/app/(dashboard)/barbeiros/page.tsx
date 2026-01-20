"use client";

import { useState } from "react";
import {
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  User,
  Phone,
  Calendar,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { barbeiros as initialBarbeiros, type Barbeiro } from "@/lib/data";

const diasSemana = [
  "Domingo",
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
];

export default function BarbeirosPage() {
  const [barbeirosList, setBarbeirosList] = useState(initialBarbeiros);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarbeiro, setEditingBarbeiro] = useState<Barbeiro | null>(null);
  const [formData, setFormData] = useState<Partial<Barbeiro>>({
    nome: "",
    especialidade: "",
    status: "ativo",
    diasTrabalho: [1, 2, 3, 4, 5, 6],
    horarioInicio: "09:00",
    horarioFim: "19:00",
  });

  const filteredBarbeiros = barbeirosList.filter((barbeiro) =>
    barbeiro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barbeiro.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingBarbeiro) {
      setBarbeirosList((prev) =>
        prev.map((b) =>
          b.id === editingBarbeiro.id ? { ...b, ...formData } as Barbeiro : b
        )
      );
    } else {
      const newBarbeiro: Barbeiro = {
        id: String(Date.now()),
        nome: formData.nome || "",
        especialidade: formData.especialidade || "",
        status: "ativo",
        diasTrabalho: formData.diasTrabalho || [],
        horarioInicio: formData.horarioInicio || "09:00",
        horarioFim: formData.horarioFim || "19:00",
      };
      setBarbeirosList((prev) => [...prev, newBarbeiro]);
    }
    setIsDialogOpen(false);
    setEditingBarbeiro(null);
    setFormData({
      nome: "",
      especialidade: "",
      status: "ativo",
      diasTrabalho: [1, 2, 3, 4, 5, 6],
      horarioInicio: "09:00",
      horarioFim: "19:00",
    });
  };

  const handleEdit = (barbeiro: Barbeiro) => {
    setEditingBarbeiro(barbeiro);
    setFormData(barbeiro);
    setIsDialogOpen(true);
  };

  const toggleStatus = (id: string) => {
    setBarbeirosList((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "ativo" ? "inativo" : "ativo" }
          : b
      )
    );
  };

  const toggleDiaTrabalho = (dia: number) => {
    const currentDias = formData.diasTrabalho || [];
    if (currentDias.includes(dia)) {
      setFormData({
        ...formData,
        diasTrabalho: currentDias.filter((d) => d !== dia),
      });
    } else {
      setFormData({
        ...formData,
        diasTrabalho: [...currentDias, dia],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Barbeiros</h1>
          <p className="text-muted-foreground">
            Gerencie os profissionais da barbearia
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingBarbeiro(null);
                setFormData({
                  nome: "",
                  especialidade: "",
                  status: "ativo",
                  diasTrabalho: [1, 2, 3, 4, 5, 6],
                  horarioInicio: "09:00",
                  horarioFim: "19:00",
                });
              }}
            >
              <Plus className="h-4 w-4" />
              Novo Barbeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBarbeiro ? "Editar Barbeiro" : "Novo Barbeiro"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do barbeiro abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={formData.especialidade}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidade: e.target.value })
                  }
                  placeholder="Ex: Barbeiro Master"
                />
              </div>
              <div className="space-y-2">
                <Label>Dias de Trabalho</Label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map((dia, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={
                        formData.diasTrabalho?.includes(index)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleDiaTrabalho(index)}
                      className="text-xs"
                    >
                      {dia.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Entrada</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, horarioInicio: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Saida</Label>
                  <Input
                    id="horarioFim"
                    type="time"
                    value={formData.horarioFim}
                    onChange={(e) =>
                      setFormData({ ...formData, horarioFim: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar barbeiros..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Barbeiros List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBarbeiros.map((barbeiro) => (
          <Card key={barbeiro.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{barbeiro.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {barbeiro.especialidade}
                  </p>
                </div>
              </div>
              <Badge
                variant={barbeiro.status === "ativo" ? "success" : "secondary"}
              >
                {barbeiro.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {barbeiro.diasTrabalho
                      .map((d) => diasSemana[d].slice(0, 3))
                      .join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {barbeiro.horarioInicio} as {barbeiro.horarioFim}
                  </span>
                </div>
                {barbeiro.pausaInicio && barbeiro.pausaFim && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Intervalo: {barbeiro.pausaInicio} - {barbeiro.pausaFim}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(barbeiro)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStatus(barbeiro.id)}
                  >
                    {barbeiro.status === "ativo" ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBarbeiros.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum barbeiro encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

