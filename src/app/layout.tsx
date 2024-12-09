import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";

export const metadata: Metadata = {
  title: "Gestor de Proyectos",
  description: "Sistema de gestión de proyectos y tareas",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="es" className={GeistSans.variable}>
        <body className="min-h-screen bg-slate-50 font-sans antialiased">
          <TRPCReactProvider>
            <Navbar />
            {children}
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
