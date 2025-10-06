import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import AdminLayoutClient from "@/components/AdminLayoutClient";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthWrapper>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminAuthWrapper>
  );
}
