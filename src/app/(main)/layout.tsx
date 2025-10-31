'use client';

import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser();

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
  )
}
