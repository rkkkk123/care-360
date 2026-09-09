import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      {/* Minimal Header */}
      <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur-sm z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Logo size="sm" />
          </Link>
          <div className="text-sm text-muted-foreground hidden sm:block">
            Your health. One connected ecosystem.
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <FadeIn className="sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </FadeIn>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-8 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/safety" className="hover:text-primary transition-colors">Safety</Link>
          <Link href="/help" className="hover:text-primary transition-colors">Help</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} CARE360. All rights reserved.</p>
      </footer>
    </div>
  );
}
