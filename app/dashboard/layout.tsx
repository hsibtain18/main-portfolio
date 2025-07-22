import { Providers } from "../ThemeProvider/ThemeProvider ";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <> 
      <Providers>
        {children}
      </Providers>
    </>
  );
}
