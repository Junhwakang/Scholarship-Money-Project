"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientLayout from "./ClientLayout";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </AuthProvider>
  );
}
