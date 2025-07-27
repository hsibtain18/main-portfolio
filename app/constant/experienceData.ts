export interface ExperienceItem {
  title: string;
  company: string;
  companyDetails?: string;
  companyURL?: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  techStack?: { name: string; path: string }[]; // Updated techStack property
}

export const experienceData: ExperienceItem[] = [
  {
    title: "Senior Software Developer",
    company: "Contour Software (CSI)",
    companyDetails: `Contour Software, founded in Karachi in 2010, rapidly grew to 2,000 employees across Pakistan, serving global clients. This expansion followed Constellation Software's acquisition of Gladstone PLC UK, becoming a key part of Constellation, Canada's largest software company and a top global acquirer. Constellation's systems are widely used globally.`,
    location: "Remote",
    companyURL: "https://contour-software.com/",
    startDate: "01/2025",
    endDate: "06/2025",
    responsibilities: [
      "Lead the design, development, and implementation of high-quality, scalable, and maintainable software solutions across various platforms and technologies.",
      "Work closely with product managers, QA engineers, and stakeholders to ensure software solutions meet business and user requirements.",
      "Conduct peer code reviews, mentor junior developers, and contribute to improving coding standards and practices within the team.",
      "Stay updated with emerging technologies and recommend tools and frameworks that enhance productivity and software quality.",
      "Participate actively in Agile ceremonies, including sprint planning, stand-ups, and retrospectives, ensuring timely delivery of tasks and projects.",
      "Identify and resolve performance bottlenecks, ensuring efficient application performance and system reliability.",
    ],
    techStack: [
      { name: "Angular", path: "/icons/angular.svg" },
      { name: "Figma", path: "/icons/figma.svg" },
      { name: "TypeScript", path: "/icons/typescript.svg" },
      { name: "Angular Material", path: "/icons/angular-material.svg" },
      { name: "Jira", path: "/icons/jira.svg" },
      { name: "Confluence", path: "/icons/confluence.svg" },
    ],
  },
  {
    title: "Software Engineer (Front-End- Angular)",
    company: "Contour Software (CSI)",
    companyDetails: `Contour Software, founded in Karachi in 2010, rapidly grew to 2,000 employees across Pakistan, serving global clients. This expansion followed Constellation Software's acquisition of Gladstone PLC UK, becoming a key part of Constellation, Canada's largest software company and a top global acquirer. Constellation's systems are widely used globally.`,
    companyURL: "https://contour-software.com/",
    location: "Remote",
    startDate: "01/2021",
    endDate: "12/2024",
    responsibilities: [
      "Architect and refine highly interactive user interfaces for enterprise-level platforms using Angular (v7 to v17) and RxJS, delivering robust and scalable solutions.",
      "Oversee the end-to-party migration of Nexus View from Angular 7 to Angular 12, charting a roadmap to Angular 17, incorporating cutting-edge features to boost performance and simplify maintenance.",
      "Craft adaptive and visually appealing designs, ensuring seamless cross-device functionality while enhancing accessibility and navigation efficiency.",
      "Execute in-depth performance diagnostics and apply optimizations, achieving a notable 30% faster load time by leveraging advanced strategies such as lazy loading, modular code splitting, and streamlined API interactions.",
      "Partner with multidisciplinary teams to conceptualize and implement technical solutions aligned with business objectives, adhering to Agile workflows and iterative development cycles.",
      "Integrate complex third-party systems, such as Invoice Cloud, to optimize payment workflows, elevate operational efficiency, and improve customer satisfaction.",
      "Innovate UI styling workflows by incorporating Tailwind CSS alongside Angular Material, modernizing the design system and reducing development cycles.",
      "Manage source code using Git, enforce version control best practices, and lead comprehensive code reviews to uphold rigorous standards of quality and maintainability.",
      "Guide and empower junior team members by providing hands-on training in Angular development, design methodologies, and performance tuning.",
      "Analyze user behavior and feedback to iterate on features and functionalities, ensuring the product evolves to meet changing needs and surpass user expectations.",
    ],
    techStack: [
      { name: "Angular", path: "/icons/angular.svg" },
      { name: "Figma", path: "/icons/figma.svg" },
      { name: "TypeScript", path: "/icons/typescript.svg" },
      { name: "Angular Material", path: "/icons/angular-material.svg" },
      { name: "Jira", path: "/icons/jira.svg" },
      { name: "Confluence", path: "/icons/confluence.svg" },
    ],
  },
  {
    title: "Software Engineer (Front-End & Back-End)",
    company: "Haball Pvt Ltd",
    companyDetails: `Haball.pk offers businesses an open, multi-channel, and digital payment solution. It automates invoicing, reconciliation, and payments across the supply chain, allowing stakeholders to manage payments and financing against invoices, replacing manual processes with an omni-channel platform.`,
    companyURL: "https://haball.pk/",
    location: "Karachi, Pakistan",
    startDate: "01/2018",
    endDate: "01/2021",
    responsibilities: [
      "Engineered dynamic, modular applications using Angular (v4 to v14), React.js, and Node.js, enhancing system scalability and performance.",
      "Refined the SCF Product by creating reusable UI components and implementing lazy loading and resolvers, reducing development time by 35%.",
      "Spearheaded the creation of the Wissaq platform with Angular 14 and NGRX for state management, optimizing build pipelines and halving deployment time.",
      "Translated complex Figma designs into responsive React and Angular components, ensuring UI/UX consistency and improving user engagement.",
      "Designed and implemented RESTful APIs for seamless communication with MySQL databases and banking systems, reducing delays and enhancing data flow.",
      "Strengthened application security with advanced encryption, authentication protocols, and role-based access, achieving GDPR and InfoSec compliance.",
      "Optimized MySQL procedures and backend systems, reducing API latency, improving query execution by 40%, and ensuring rapid response times.",
    ],
    techStack: [
      { name: "Angular", path: "/icons/angular.svg" },
      { name: "React", path: "/icons/react.svg" },
      { name: "Node", path: "/icons/Node.js.svg" },
      { name: "MySQL", path: "/icons/mysql.svg" },
      { name: "Express", path: "https://cdn.simpleicons.org/express/cccccc" },
      { name: "Jira", path: "/icons/jira.svg" },
      { name: "Confluence", path: "/icons/confluence.svg" },
      { name: "JavaScript", path: "/icons/JavaScript.svg" },
    ],
  },
  {
    title: "Intern – Android Developer",
    company: "Sibisoft Pvt Ltd",
    companyDetails: `Sibisoft is a software house based in Karachi, Pakistan, employing over 200 developers and designers. They are responsible for developing and powering Northstar's Club Management Software, which is used by hundreds of clubs globally. Sibisoft also provides project and account management services to ensure efficient and accurate setups.`,
    companyURL: "https://www.sibisoft.com/",
    location: "Karachi, Pakistan",
    startDate: "05/2016",
    endDate: "08/2016",
    responsibilities: [
      "Assisted in Android application development and UI implementation using Java.",
      "Collaborated with senior developers to debug and test mobile functionality.",
      "Gained hands-on experience in mobile development lifecycle and API integration.",
    ],
    techStack: [
      { name: "Android Studio", path: "/icons/android-studio.svg" },
      { name: "Java", path: "/icons/java.svg" },
      { name: "Google Maps", path: "/icons/google-maps.svg" },
    ],
  },
];
export const currencies = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "https://flagcdn.com/us.svg",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "https://flagcdn.com/eu.svg",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "https://flagcdn.com/gb.svg",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    flag: "https://flagcdn.com/ae.svg",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "https://flagcdn.com/in.svg",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "https://flagcdn.com/jp.svg",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "$",
    flag: "https://flagcdn.com/ca.svg",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "$",
    flag: "https://flagcdn.com/au.svg",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "CHF",
    flag: "https://flagcdn.com/ch.svg",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "https://flagcdn.com/cn.svg",
  },
];

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
}
