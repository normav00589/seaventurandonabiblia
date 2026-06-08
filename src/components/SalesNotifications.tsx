import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";

const NAMES = [
  "Ana", "Carla", "Mariana", "Juliana", "Patrícia", "Fernanda", "Beatriz", "Camila",
  "Rafaela", "Luciana", "Tatiane", "Vanessa", "Aline", "Cristiane", "Débora", "Renata",
  "João", "Lucas", "Pedro", "Rafael", "Felipe", "Marcos", "Tiago", "Bruno",
  "Ricardo", "Anderson", "Eduardo", "Gustavo", "Rodrigo", "Leandro", "Fábio", "Diego",
];

const SURNAMES = [
  "Silva", "Souza", "Oliveira", "Santos", "Pereira", "Lima", "Costa", "Almeida",
  "Ferreira", "Ribeiro", "Carvalho", "Gomes", "Martins", "Araújo", "Rodrigues", "Barbosa",
];

const STATES = [
  "SP", "RJ", "MG", "RS", "PR", "SC", "BA", "PE", "CE", "GO",
  "ES", "DF", "PA", "MA", "MT", "MS", "PB", "RN", "AL", "PI",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maskName(first: string, last: string) {
  const lastInitial = last.charAt(0) + ".";
  return `${first} ${lastInitial}`;
}

function timeAgo() {
  const mins = Math.floor(Math.random() * 8) + 1;
  return `há ${mins} min`;
}

export function SalesNotifications() {
  const [notification, setNotification] = useState<{
    id: number;
    name: string;
    state: string;
    when: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const showNext = () => {
      if (!mounted) return;
      const id = Date.now();
      setNotification({
        id,
        name: maskName(pick(NAMES), pick(SURNAMES)),
        state: pick(STATES),
        when: timeAgo(),
      });

      // Hide after ~6s
      timeoutId = setTimeout(() => {
        if (!mounted) return;
        setNotification(null);
        // Schedule next 15-20s later
        const nextDelay = 15000 + Math.random() * 5000;
        timeoutId = setTimeout(showNext, nextDelay);
      }, 6000);
    };

    // First one shows after 8s
    timeoutId = setTimeout(showNext, 8000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  if (!notification) return null;

  return (
    <div
      key={notification.id}
      className="fixed bottom-4 left-4 z-50 max-w-[92vw] sm:max-w-sm animate-in slide-in-from-left-5 fade-in duration-500"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl bg-white shadow-2xl border border-border p-3 pr-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-adventure to-adventure-dark flex items-center justify-center text-white">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">
            {notification.name} — {notification.state}
          </p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">
            comprou o Plano Pro · <span className="font-semibold text-adventure-dark">R$ 17,90</span>
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">{notification.when} · compra verificada</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          aria-label="Fechar"
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
