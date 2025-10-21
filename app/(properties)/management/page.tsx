'use client'; // This component will use client-side hooks like useState and useTheme

import { useTheme } from 'next-themes';
import { Sun, Moon, Building, Users, MapPin, Grid } from 'lucide-react'; // Icons from lucide-react

// --- Mock Data ---
// In a real application, this data would come from API calls to your backend
const mockSummaryData = [
  {
    id: 'developers',
    title: 'Total Developers',
    count: 15,
    icon: Users,
    description: 'Leading property developers.',
  },
  {
    id: 'communities',
    title: 'Master Communities',
    count: 22,
    icon: MapPin,
    description: 'Diverse master-planned communities.',
  },
  {
    id: 'projects',
    title: 'Active Projects',
    count: 85,
    icon: Building,
    description: 'Ongoing and upcoming property projects.',
  },
  {
    id: 'units',
    title: 'Available Units',
    count: 1240,
    icon: Grid,
    description: 'Properties ready for sale or lease.',
  },
];

export default function PropertiesLandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col w-full min-h-screen p-4 sm:p-8 transition-colors duration-300">
      {/* Header with Title and Theme Toggle */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Properties Overview
        </h1>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-blue-500 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Hero Section / Introduction */}
      <section className="text-center mb-12">
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Explore the vast landscape of real estate. Here you can find a summary of the developers, master communities, and active projects currently managed in the system.
        </p>
      </section>

      {/* Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {mockSummaryData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center justify-center p-6 rounded-xl shadow-lg
                       bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                       hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <item.icon className="text-blue-600 dark:text-blue-400 mb-4" size={48} />
            <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              {item.count.toLocaleString()}
            </p>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      {/* Call to Action or Quick Links (Optional) */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Ready to dive deeper?
        </h2>
        <div className="flex justify-center space-x-4">
          <a
            href="/properties/developer"
            className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg
                       hover:bg-blue-700 transition-colors shadow-lg"
          >
            View Developers
          </a>
          <a
            href="/properties/projects"
            className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 text-lg font-medium rounded-lg
                       hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
          >
            Explore Projects
          </a>
        </div>
      </section>
    </div>
  );
}