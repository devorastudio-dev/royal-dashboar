import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} às ${formatTime(date)}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    confirmado: "bg-green-100 text-green-800",
    pendente: "bg-yellow-100 text-yellow-800",
    cancelado: "bg-red-100 text-red-800",
    concluido: "bg-blue-100 text-blue-800",
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-gray-100 text-gray-800",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
}

