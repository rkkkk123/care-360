import * as React from "react";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-foreground">Profile</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage your personal information.</p>
      </div>
      <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-foreground">Demo Patient</h2>
            <p className="text-muted-foreground">Patient Account</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">patient@care360.demo</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-medium">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
