<template>
  <div>
    <!-- Breadcrumbs -->
    <nav class="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <a href="/" class="hover:text-primary">Home</a>
          </li>
          <li>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
          <li class="text-gray-900 font-medium">UK Police Stop and Search Data Portal</li>
        </ol>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-primary text-white py-16 -mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            UK Police Stop and Search Data Portal
          </h1>
          <p class="text-xl mb-8">
            Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data.
          </p>
          <div class="flex justify-center space-x-4">
            <NuxtLink to="/map" class="btn btn-secondary">
              View Interactive Map
            </NuxtLink>
            <NuxtLink to="/statistics" class="btn btn-outline">
              View Statistics
            </NuxtLink>
            <NuxtLink to="/analytics" class="btn btn-outline">
              Advanced Analytics
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Meta Tags -->
    <Head>
      <title>UK Police Stop and Search Data Portal | Interactive Maps & Statistics</title>
      <meta name="description" content="Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data." />
      <meta name="keywords" content="police data, stop and search, UK police, crime statistics, law enforcement data, police transparency, UK crime data, police accountability" />
      <meta property="og:title" content="UK Police Stop and Search Data Portal" />
      <meta property="og:description" content="Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://policestopsearch.co.uk" />
      <meta property="og:image" content="https://policestopsearch.co.uk/images/puk-logo.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="UK Police Stop and Search Data Portal" />
      <meta name="twitter:description" content="Access and analyse UK police stop and search data through interactive maps and detailed statistics." />
      <meta name="twitter:image" content="https://policestopsearch.co.uk/images/puk-logo.png" />
      <link rel="canonical" href="https://policestopsearch.co.uk" />
    </Head>

    <!-- Open Source Banner -->
    <section class="bg-secondary/10 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-3xl">🌟</div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Open Source Project</h2>
              <p class="text-gray-600">This project is open source and welcomes community contributions!</p>
            </div>
          </div>
          <div>
            <a 
              href="https://github.com/HairyDuck/PoliceStopSearch.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- UK Police Forces Overview Map -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">UK Police Forces Overview</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize the current state of police data transparency across all UK police forces. 
            See which forces are actively reporting data and identify areas with transparency issues.
          </p>
        </div>
        <HomePageMap :forceData="homepageData.forces" :summaryData="homepageData.summary" />
      </div>
    </section>

    <!-- Key Features -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">🗺️</div>
            <h3 class="text-xl font-semibold mb-4">Interactive Map</h3>
            <p class="text-gray-600">
              Explore stop and search incidents on an interactive map. Filter by location, date, and more.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold mb-4">Detailed Statistics</h3>
            <p class="text-gray-600">
              Access comprehensive statistics and trends about stop and search incidents across the UK.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">📱</div>
            <h3 class="text-xl font-semibold mb-4">Mobile Friendly</h3>
            <p class="text-gray-600">
              Access the data portal on any device with our responsive design.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Official Resources -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Official Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Police.uk Resources -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Police.uk Resources</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://www.college.police.uk/app/stop-and-search/stop-and-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Stop and Search Overview
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.uk/police-powers-to-stop-and-search-your-rights"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Know Your Rights
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.uk/government/publications/best-use-of-stop-and-search-scheme"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Best Use of Stop and Search
                </a>
              </li>
            </ul>
          </div>

          <!-- Government Resources -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Government Resources</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://www.gov.uk/government/publications/stop-and-search-statistics-data-tables"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  Official Statistics
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/policing/stop-and-search/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Ethnicity Facts and Figures
                </a>
              </li>
              <li>
                <a 
                  href="https://www.justiceinspectorates.gov.uk/hmicfrs/our-work/article/stop-and-search/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  HMICFRS Reports
                </a>
              </li>
            </ul>
          </div>
        </div>
              </div>
      </section>

    <!-- Research & Academic Resources -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Research & Academic Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Academic Research -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Academic Research</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://www.ucl.ac.uk/jill-dando-institute/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  UCL Jill Dando Institute
                </a>
              </li>
              <li>
                <a 
                  href="https://www.lse.ac.uk/research/research-for-the-world/society/stop-and-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  LSE Research
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ox.ac.uk/research/research-in-conversation/stop-and-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Oxford Research
                </a>
              </li>
            </ul>
          </div>

          <!-- Civil Rights Organizations -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Civil Rights & Advocacy</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://www.libertyhumanrights.org.uk/issue/stop-and-search/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Liberty
                </a>
              </li>
              <li>
                <a 
                  href="https://www.stop-watch.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  StopWatch
                </a>
              </li>
              <li>
                <a 
                  href="https://www.raceequalityfoundation.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Race Equality Foundation
                </a>
              </li>
            </ul>
          </div>

          <!-- Data & Technology -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Data & Technology</h3>
            <ul class="space-y-4">
              <li>
                <a 
                  href="https://data.police.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  UK Police Data Portal
                </a>
              </li>
              <li>
                <a 
                  href="https://www.openpolicing.stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Stanford Open Policing
                </a>
              </li>
              <li>
                <a 
                  href="https://www.themarshallproject.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  The Marshall Project
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-8">Start Exploring Now</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Discover insights about police stop and search practices in your area and across the UK.
        </p>
        <NuxtLink to="/map" class="btn btn-primary">
          View Interactive Map
        </NuxtLink>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div class="grid gap-8 max-w-3xl mx-auto">
          <!-- Data Source FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">Where does the data come from?</h3>
            <p class="text-gray-600">
              All data is sourced directly from the official UK Police Data API (data.police.uk). This ensures that our information is accurate, up-to-date, and matches official records.
            </p>
          </div>

          <!-- Data Updates FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">How often is the data updated?</h3>
            <p class="text-gray-600">
              The UK Police Data API updates its data monthly, typically with a two-month delay. For example, January's data becomes available in March. This delay allows for proper data validation and processing by police forces. We automatically fetch the latest available data as soon as it's published.
            </p>
          </div>

          <!-- Data Coverage FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">What time period does the data cover?</h3>
            <p class="text-gray-600">
              Our platform provides access to the last 24 months of stop and search data. The current month and previous month are typically not available due to the processing delay in the official police data system. This ensures we only display validated and complete data sets.
            </p>
          </div>

          <!-- Data Accuracy FAQ -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-xl font-semibold mb-4">How accurate is the data?</h3>
            <p class="text-gray-600">
              The data comes directly from police records and undergoes validation before being published. However, some incidents might have incomplete information or approximate locations for privacy and operational reasons. We clearly indicate when data is estimated or incomplete.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import type { Map as LeafletMap } from 'leaflet'

// Types for homepage data
interface ForceData {
  id: string
  name: string
  status: 'active' | 'limited' | 'none'
  latestMonth: string | null
  totalIncidents: number
  coordinates?: [number, number]
  hasTransparencyIssues?: boolean
  logoUrl?: string
}

interface SummaryData {
  totalForces: number
  activeForces: number
  limitedDataForces: number
  noDataForces: number
  transparencyIssues: number
  latestMonth: string
}

// Server-side data fetching for SEO
const { data: homepageData } = await useFetch<{
  success: boolean
  summary?: SummaryData
  forces?: ForceData[]
  error?: string
}>('/api/homepage-map', {
  server: true,
  default: () => ({
    success: false,
    summary: {
      totalForces: 0,
      activeForces: 0,
      limitedDataForces: 0,
      noDataForces: 0,
      transparencyIssues: 0,
      latestMonth: 'Unknown'
    },
    forces: []
  })
})

// SEO and Structured Data
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "UK Police Stop and Search Data Portal",
        "description": "Access and analyse UK police stop and search data through interactive maps and detailed statistics. Promoting transparency and informed discussions through accurate data.",
        "url": "https://policestopsearch.co.uk",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://policestopsearch.co.uk/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PoliceStopSearch.co.uk",
        "url": "https://policestopsearch.co.uk",
        "logo": "https://policestopsearch.co.uk/images/puk-logo.png",
        "sameAs": [
          "https://github.com/HairyDuck/PoliceStopSearch.co.uk"
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where does the data come from?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "All data is sourced directly from the official UK Police Data API (data.police.uk). This ensures that our information is accurate, up-to-date, and matches official records."
            }
          },
          {
            "@type": "Question",
            "name": "How often is the data updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The UK Police Data API updates its data monthly, typically with a two-month delay. For example, January's data becomes available in March. This delay allows for proper data validation and processing by police forces."
            }
          },
          {
            "@type": "Question",
            "name": "What time period does the data cover?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our platform provides access to the last 24 months of stop and search data. The current month and previous month are typically not available due to the processing delay in the official police data system."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The data comes directly from police records and undergoes validation before being published. However, some incidents might have incomplete information or approximate locations for privacy and operational reasons."
            }
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://policestopsearch.co.uk"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "UK Police Stop and Search Data Portal",
            "item": "https://policestopsearch.co.uk"
          }
        ]
      })
    }
  ]
})

// Remove statistics data
const mapPreview = ref<HTMLElement | null>(null)
let previewMap: LeafletMap | null = null

onMounted(async () => {
  try {
    // Remove statistics calculation
    // Initialize map preview
    if (mapPreview.value) {
      const { $L } = useNuxtApp()
      const L = $L as typeof import('leaflet')
      previewMap = L.map(mapPreview.value, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      }).setView([51.505, -0.09], 10)

      if (previewMap) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(previewMap)
      }
    }
  } catch (error) {
    console.error('Error initializing map:', error)
  }
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}

.btn-secondary {
  @apply bg-secondary text-white hover:bg-secondary-dark;
}

.btn-outline {
  @apply border-2 border-white text-white hover:bg-white hover:text-primary;
}

.btn-white {
  @apply bg-white text-primary hover:bg-gray-100;
}
</style> 