import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin — JohnsCodingLab",
    description: "Portfolio admin panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
            >
                {/* 
          ThemeProvider from next-themes:
          - attribute="class" means it toggles the "dark" class on <html>
          - defaultTheme="system" respects the OS preference
          - disableTransitionOnChange prevents a flash of unstyled content when switching themes
          - storageKey persists the user's choice to localStorage
        */}
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="jcl-admin-theme"
                >
                    <QueryProvider>{children}</QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
