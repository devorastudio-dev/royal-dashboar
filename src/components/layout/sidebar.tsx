"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Calendar,
  Users,
  Scissors,
  Gear,
  ChartBar,
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/agendamentos", label: "Agendamentos", icon: Calendar },
  { href: "/barbeiros", label: "Barbeiros", icon: Users },
  { href: "/servicos", label: "Servicos", icon: Scissors },
  { href: "/configuracoes", label: "Configuracoes", icon: Gear },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Scissors className="mr-2 h-6 w-6" weight="bold" />
          <span className="text-lg font-bold">Royal Barbearia</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" weight={isActive ? "fill" : "regular"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info & Logout */}
        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">Administrador</p>
              <p className="truncate text-xs text-muted-foreground">
                admin@royal.com
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <SignOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}

