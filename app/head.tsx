// app/head.tsx
export default function Head() {
  return (
    <>
      <title>Syed Hassan Sibtain | Frontend Developer Portfolio</title>
      <meta
        name="description"
        content="Syed Hassan Sibtain is a frontend developer based in Dubai, specializing in React, Next.js, GSAP, Tailwind CSS, and modern UI/UX development. Explore his interactive portfolio and projects."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Syed Hassan Sibtain" />
      <link rel="canonical" href="https://hassansibtain.dev/" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Syed Hassan Sibtain | Frontend Developer" />
      <meta
        property="og:description"
        content="Interactive portfolio of Syed Hassan Sibtain — showcasing skills in React, Next.js, Tailwind, GSAP, and full-stack UI development."
      />
      <meta property="og:url" content="https://hassansibtain.dev/" />
      <meta property="og:image" content="https://hassansibtain.dev/preview.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Syed Hassan Sibtain | Frontend Developer" />
      <meta
        name="twitter:description"
        content="Modern, animated portfolio built with Next.js, React, GSAP, and Tailwind CSS."
      />
      
      {/* Keywords */}
      <meta
        name="keywords"
        content="Frontend Developer, React Developer, Next.js, GSAP, Tailwind CSS, UI/UX, Portfolio, Dubai Developer, Open to Work, JavaScript Developer"
      />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Syed Hassan Sibtain",
            url: "https://hassansibtain.dev",
            jobTitle: "Frontend Developer",
            worksFor: {
              "@type": "Organization",
              name: "Freelance",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Dubai",
              addressCountry: "United Arab Emirates",
            },
            email: "mailto:hsibtain18@gmail.com",
            telephone: "+971528483965",
            sameAs: [
              "https://www.linkedin.com/in/syed-hassan-sibtain-52a2085b/",
              "https://github.com/hsibtain18"
            ],
          }),
        }}
      />
    </>
  );
}
