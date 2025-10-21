import { Providers } from "../ThemeProvider/ThemeProvider ";

export default function PropertiesLayout({
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
