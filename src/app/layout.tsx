import { Providers, ThemeProvider, QueryProvider } from "./providers";
import { AppProvider } from "@/contexts/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
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
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
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
        </ErrorBoundary>
      </body>
    </html>
  );
}
