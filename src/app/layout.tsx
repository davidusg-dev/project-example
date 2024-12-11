import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "sonner";

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
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
