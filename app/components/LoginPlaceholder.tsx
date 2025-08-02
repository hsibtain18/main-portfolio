import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LoginPromptCardProps {
  title?: string;
}

export default function LoginPlaceholder({
  title = "Login Required",
}: LoginPromptCardProps) {
  return (
    <div className="max-w-[92vw] ring-2 ring-gray-200 dark:ring-gray-700 py-2 px-3 rounded-xl bg-white dark:bg-gray-900 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        You need to be logged in to view this content.
      </p>
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Login
      </Link>
    </div>
  );
}
