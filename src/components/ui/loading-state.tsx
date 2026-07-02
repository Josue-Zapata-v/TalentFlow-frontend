import { Spinner } from "./spinner";

export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Spinner className="size-6" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
