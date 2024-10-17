import { Providers, ThemeProvider, QueryProvider } from "./providers";
import { AppProvider } from "@/contexts/AppContext";
import "../styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ModelAI",
  description: "Create stunning AI-generated images with ease.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <QueryProvider>
            <AppProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </AppProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
