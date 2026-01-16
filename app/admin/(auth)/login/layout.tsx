import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Portfolio",
  description: "Secure admin access point",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {children}
    </section>
  );
}