"use client";

import { ReactNode } from "react";
import AdditionalInfoModal from "./modals/AdditionalInfoModal";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdditionalInfoModal />
    </>
  );
}
