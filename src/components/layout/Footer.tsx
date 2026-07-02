export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-(--breakpoint-xl) px-6 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} TalentFlow — Proyecto académico, Instituto Tecsup.</p>
      </div>
    </footer>
  );
}
