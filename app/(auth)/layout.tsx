"use client";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../ThemeProvider/ThemeProvider ";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SessionProvider>
        <Providers>
          <main className="flex min-h-screen items-center justify-center bg-auth-light bg-cover bg-center bg-no-repeat px-4 py-10 dark:bg-dark">
            {/* <section className="light-border background- shadow- min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8"> */}
            {children}
            {/* </section> */}
          </main>
        </Providers>
      </SessionProvider>
    </>
  );
}
