import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdmin() {
  const [state, setState] = useState<{ loading: boolean; isAdmin: boolean; email: string | null }>({
    loading: true,
    isAdmin: false,
    email: null,
  });
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setUser(data.session?.user ?? null);
        setAuthReady(true);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkRole = async () => {
      try {
        if (!authReady) return;
        if (!user) {
          if (!cancelled) setState({ loading: false, isAdmin: false, email: null });
          return;
        }
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          console.error("[useAdmin] role query error", error);
          setState({ loading: false, isAdmin: false, email: user.email ?? null });
          return;
        }
        setState({ loading: false, isAdmin: !!data, email: user.email ?? null });
      } catch (e) {
        console.error("[useAdmin] unexpected", e);
        if (!cancelled) setState({ loading: false, isAdmin: false, email: null });
      }
    };

    if (!authReady) return;
    setState((current) => ({ ...current, loading: true, email: user?.email ?? null }));
    void checkRole();

    return () => {
      cancelled = true;
    };
  }, [authReady, user]);

  return state;
}
