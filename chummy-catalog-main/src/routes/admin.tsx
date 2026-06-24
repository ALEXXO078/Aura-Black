import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, isAdmin, email } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-2xl text-gradient-gold">Panel de Administración</h1>
            <p className="text-xs uppercase tracking-luxury text-muted-foreground">{email}</p>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/admin" activeOptions={{ exact: true }} className="rounded-sm px-3 py-2 text-xs uppercase tracking-luxury text-muted-foreground hover:text-foreground" activeProps={{ className: "text-gold" }}>
              Productos
            </Link>
            <Link to="/admin/categorias" className="rounded-sm px-3 py-2 text-xs uppercase tracking-luxury text-muted-foreground hover:text-foreground" activeProps={{ className: "text-gold" }}>
              Categorías
            </Link>
            <Link to="/" className="rounded-sm px-3 py-2 text-xs uppercase tracking-luxury text-muted-foreground hover:text-foreground">
              Ver sitio
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/login" });
              }}
            >
              Salir
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
