import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">
        <Topbar />
        <main className="mx-auto max-w-[1480px] px-4 pb-28 pt-6 sm:px-6 md:px-8 md:pb-10 md:pt-8 xl:px-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
