import "./globals.css";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          value={{
            light: "light",
            dark: "dark",
            purple: "purple",
            mint: "mint"
          }}
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}