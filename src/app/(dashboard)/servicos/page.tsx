"use client";

import { useState } from "react";
import {
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  Scissors,
  Clock,
  CurrencyDollar,
  ToggleLeft,
  ToggleRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { servicos as initialServicos, type Servico } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function ServicosPage() {
  const [servicosList, setServicosList] = useState(initialServicos);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState<Partial<Servico>>({
    nome: "",
    descricao: "",
    duracao: 30,
    valor: 0,
    status: "ativo",
  });

  const filteredServicos = servicosList.filter((servico) =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingServico) {
      setServicosList((prev) =>
        prev.map((s) =>
          s.id === editingServico.id ? { ...s, ...formData } as Servico : s
        )
      );
    } else {
      const newServico: Servico = {
        id: String(Date.now()),
        nome: formData.nome || "",
        descricao: formData.descricao || "",
        duracao: formData.duracao || 30,
        valor: formData.valor || 0,
        status: "ativo",
      };
      setServicosList((prev) => [...prev, newServico]);
    }
    setIsDialogOpen(false);
    setEditingServico(null);
    setFormData({
      nome: "",
      descricao: "",
      duracao: 30,
      valor: 0,
      status: "ativo",
    });
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData(servico);
    setIsDialogOpen(true);
  };

  const toggleStatus = (id: string) => {
    setServicosList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "ativo" ? "inativo" : "ativo" }
          : s
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este servico?")) {
      setServicosList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Servicos</h1>
          <p className="text-muted-foreground">
            Gerencie os servicos oferecidos pela barbearia
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingServico(null);
                setFormData({
                  nome: "",
                  descricao: "",
                  duracao: 30,
                  valor: 0,
                  status: "ativo",
                });
              }}
            >
              <Plus className="h-4 w-4" />
              Novo Servico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingServico ? "Editar Servico" : "Novo Servico"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do servico abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Servico</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Corte Masculino"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descricao</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descricao do servico"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duracao (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="1"
                    value={formData.duracao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duracao: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valor: parseFloat(e.target.value) || 0,
                      })
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
              placeholder="Buscar servicos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Servicos List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServicos.map((servico) => (
          <Card key={servico.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                  <Badge
                    variant={servico.status === "ativo" ? "success" : "secondary"}
                    className="mt-1"
                  >
                    {servico.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">
                  {servico.descricao || "Sem descricao"}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{servico.duracao} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatCurrency(servico.valor)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(servico)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStatus(servico.id)}
                  >
                    {servico.status === "ativo" ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDelete(servico.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServicos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum servico encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

