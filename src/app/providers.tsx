"use client";

import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "@/contexts/AppContext";
import ErrorFallback from "@/components/ErrorFalback";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProvider>
        <GoogleOAuthProvider clientId={googleClientId}>
          <QueryClientProvider client={queryClient}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {children}
            </NextThemesProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
