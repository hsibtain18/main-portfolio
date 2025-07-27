import { Button } from "@/components/ui/button";

interface LoginPromptCardProps {
  title?: string;
}

export default function LoginPlaceholder({
  title = "Login Required",
}: LoginPromptCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        You need to be logged in to view this content.
      </p>
      <Button variant="default" className="px-6 py-2">
        Login
      </Button>
    </div>
  );
}
