import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Link>
  );
}
