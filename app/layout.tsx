import type { Metadata } from "next";
import { Chela_One, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbat";
import CustomCursor from "./components/CustomCursor";
import { Providers } from "./ThemeProvider/ThemeProvider ";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chelaOne = Chela_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chela-one",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Syed Hassan Sibtain",
  description: "An experience Front-End Developer working with JS Framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={chelaOne.variable}>
      <head>
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        ></script>
      </head>
      <body>
        <CustomCursor />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
