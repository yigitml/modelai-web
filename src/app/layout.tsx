import "../styles/globals.css";
import { Metadata } from "next";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "ModelAI",
  description: "Create your own AI models and take photos with them.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
