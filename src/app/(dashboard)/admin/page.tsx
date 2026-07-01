"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRequireRole } from "@/modules/auth/hooks/useRequireRole";
import { RolBadge } from "@/modules/users/components/RolBadge";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { usersService } from "@/modules/users/services/usersService";
import { Rol } from "@/types/shared";

const ROLES: Rol[] = ["ADMIN", "RECLUTADOR", "POSTULANTE"];

export default function AdminPage() {
  const { isReady } = useRequireRole("ADMIN");
  const { user: currentUser } = useAuth();
  const [rolFilter, setRolFilter] = useState<Rol | "TODOS">("TODOS");
  const { users, isLoading, error, refetch } = useUsers(isReady, rolFilter === "TODOS" ? undefined : rolFilter);

  if (!isReady) {
    return null;
  }

  async function handleChangeRol(id: string, rol: Rol) {
    try {
      await usersService.update(id, { rol });
      refetch();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar el rol.");
    }
  }

  async function handleDelete(id: string, nombre: string) {
    if (!window.confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await usersService.remove(id);
      refetch();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar el usuario.");
    }
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">Usuarios</h1>
      <p className="mt-2 text-base text-muted-foreground">Gestiona los usuarios registrados en TalentFlow.</p>

      <div className="mt-6">
        <Select value={rolFilter} onValueChange={(value) => setRolFilter(value as Rol | "TODOS")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="RECLUTADOR">Reclutador</SelectItem>
            <SelectItem value="POSTULANTE">Postulante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="mt-12 text-center text-muted-foreground">Cargando...</p>}

      {error && (
        <p role="alert" className="mt-12 text-center text-destructive">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Nombre</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Rol</th>
                <th className="py-2 pr-4 font-medium">Creado</th>
                <th className="py-2 pr-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-foreground">{u.nombre}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 pr-4">
                      <RolBadge rol={u.rol} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Select
                          value={u.rol}
                          onValueChange={(value) => handleChangeRol(u.id, value as Rol)}
                          disabled={isSelf}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((rol) => (
                              <SelectItem key={rol} value={rol}>
                                {rol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isSelf}
                          onClick={() => handleDelete(u.id, u.nombre)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No hay usuarios con ese filtro.</p>
          )}
        </div>
      )}
    </main>
  );
}
