import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { FadeIn } from "@/components/motion/FadeIn";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur-sm z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center w-full max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-8">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          
          <h2 className="text-3xl font-light tracking-tight text-foreground mb-4">
            Access Denied
          </h2>
          
          <p className="text-sm text-muted-foreground mb-8">
            You don't have permission to access this area of CARE360.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full rounded-full">
              <Link href="/">Return to CARE360</Link>
            </Button>
            
            <div className="pt-2">
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Sign in with a different account
              </Link>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
