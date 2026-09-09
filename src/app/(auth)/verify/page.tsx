import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-8">
        <MailCheck className="h-10 w-10 text-primary" />
      </div>
      
      <h2 className="text-3xl font-light tracking-tight text-foreground mb-4">
        Check your email
      </h2>
      
      <p className="text-sm text-muted-foreground mb-8">
        We've sent a verification link to your email address. 
        Please click the link to verify your account and continue.
      </p>

      <div className="space-y-4">
        <Button className="w-full rounded-full" variant="outline">
          Resend verification email
        </Button>
        
        <div className="pt-6">
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
