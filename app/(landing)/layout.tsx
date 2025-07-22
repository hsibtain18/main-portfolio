import { Providers } from "../ThemeProvider/ThemeProvider ";
import Navbar from "./components/Navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <> 
      <Providers>
        <Navbar/>
        {children}
      </Providers>
    </>
  );
}
