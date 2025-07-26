import Header from "../components/Header";
import Sidebar from "../components/SideNavigation";
import { Providers } from "../ThemeProvider/ThemeProvider ";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <div className="lg:flex">
          <Sidebar />
          <main className="flex-1 min-h-screen flex flex-col">
            <Header />
            <div className="p-6">{children}</div>
          </main>
        </div>
      </Providers>
    </>
  );
}
