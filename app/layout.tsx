import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EPLQ - Privacy-Preserving Location Queries",
  description:
    "Efficient Privacy-Preserving Location-Based Query on Encrypted Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children} 
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

// import './globals.css'
