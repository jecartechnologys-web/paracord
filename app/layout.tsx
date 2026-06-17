import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paracord — Pulseras hechas a mano",
  description: "Pulseras Paracord artesanales. Resistentes, personalizables, únicas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
