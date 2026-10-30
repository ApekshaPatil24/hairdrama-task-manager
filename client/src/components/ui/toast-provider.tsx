
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles: Record<
  ToastType,
  {
    title: string;
    icon: LucideIcon;
    card: string;
    iconBox: string;
  }
> = {
  success: {
    title: "Success",
    icon: CheckCircle2,
    card: "border-[#dce9dc] bg-[#fbfdf9] text-[#315b48]",
    iconBox: "bg-[#e8f1e7] text-[#315b48]",
  },
  error: {
    title: "Something went wrong",
    icon: AlertCircle,
    card: "border-[#f0d9d2] bg-[#fffaf8] text-[#a05243]",
    iconBox: "bg-[#f9e9e4] text-[#a05243]",
  },
  warning: {
    title: "Please check",
    icon: AlertTriangle,
    card: "border-[#eee2c8] bg-[#fffdf7] text-[#96723d]",
    iconBox: "bg-[#f7efd9] text-[#96723d]",
  },
  info: {
    title: "Information",
    icon: Info,
    card: "border-[#dce5e0] bg-[#fbfcfa] text-[#53665c]",
    iconBox: "bg-[#eaf0e9] text-[#53665c]",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const style = toastStyles[toast.type];
  const Icon = style.icon;

  useEffect(() => {
    const duration = toast.type === "error" ? 5000 : 3800;

    const timeout = window.setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [toast.id, toast.type, onDismiss]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`animate-toast-enter pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_12px_35px_rgba(35,54,43,0.12)] backdrop-blur-sm ${style.card}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.iconBox}`}
      >
        <Icon size={19} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold">{style.title}</p>
        <p className="mt-1 break-words text-[13px] leading-5 opacity-80">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-55 transition hover:bg-black/5 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const cleanMessage = message.trim();

      if (!cleanMessage) return;

      const id = ++nextId.current;

      setToasts((current) => [
        ...current.slice(-3),
        { id, message: cleanMessage, type },
      ]);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100%-2rem)] max-w-[380px] flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
