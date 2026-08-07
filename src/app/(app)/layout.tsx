import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 min-h-screen pb-20 md:pb-0">
        <div className="max-w-page mx-auto px-page-margin py-stack-lg">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
