import { useEffect, useState } from "react";
import { Flame, Clock } from "lucide-react";

const STORAGE_KEY = "urgency_deadline_v1";
const DURATION_MS = 5 * 60 * 1000;

function getDeadline() {
  if (typeof window === "undefined") return Date.now() + DURATION_MS;
  const saved = Number(localStorage.getItem(STORAGE_KEY));
  if (saved && saved > Date.now()) return saved;
  const next = Date.now() + DURATION_MS;
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function UrgencyBar() {
  const [deadline, setDeadline] = useState<number>(() =>
    typeof window === "undefined" ? Date.now() + DURATION_MS : getDeadline(),
  );
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    setDeadline(getDeadline());
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (now >= deadline) {
      const next = Date.now() + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, String(next));
      setDeadline(next);
    }
  }, [now, deadline]);

  const remaining = deadline - now;

  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white border-b-2 border-orange-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-center gap-2 sm:gap-4 text-center">
        <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 flex-shrink-0 animate-pulse" />
        <p className="font-heading font-bold text-[11px] sm:text-sm leading-tight">
          <span className="hidden sm:inline">⚡ </span>
          Faltam apenas <span className="text-orange-300 font-display text-base sm:text-lg">13 vagas</span>{" "}
          <span className="hidden sm:inline">com esse valor promocional</span>
          <span className="sm:hidden">promo</span>
        </p>
        <div className="flex items-center gap-1.5 bg-red-950/60 border border-orange-400/60 rounded-full px-2.5 py-1 font-display text-sm sm:text-base tabular-nums">
          <Clock className="w-3.5 h-3.5 text-orange-300" />
          <span className="text-orange-300">{format(remaining)}</span>
        </div>
      </div>
    </div>
  );
}
