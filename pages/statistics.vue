<template>
  <div class="container mx-auto px-4 py-8">
    <!-- SEO Meta Tags -->
    <Head>
      <title>{{ pageTitle }}</title>
      <meta name="description" :content="pageDescription" />
      <meta name="keywords" content="police statistics, stop and search data, UK police analysis, crime statistics, police demographics" />
      <meta property="og:title" :content="pageTitle" />
      <meta property="og:description" :content="pageDescription" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" :content="pageTitle" />
      <meta name="twitter:description" :content="pageDescription" />
      <link rel="canonical" :href="canonicalUrl" />
    </Head>
    <h1 class="text-3xl font-bold mb-8">Stop and Search Statistics</h1>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="flex flex-col space-y-6">
        <!-- Force Selection -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Select Police Forces</h3>
            <div class="flex items-center space-x-4">
              <button
                @click="selectAllForces = !selectAllForces; selectedForceIds = selectAllForces ? forces.map(f => f.id) : []"
                class="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {{ selectAllForces ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
          </div>

          <!-- Selected Forces Tags -->
          <div v-if="selectedForceIds.length > 0" class="flex flex-wrap gap-2 mb-4">
            <div
              v-for="id in selectedForceIds"
              :key="id"
              class="inline-flex items-center bg-primary bg-opacity-10 text-primary rounded-full px-3 py-1 text-sm"
            >
              <span class="mr-1">{{ forces.find(f => f.id === id)?.name }}</span>
              <button
                @click="selectedForceIds = selectedForceIds.filter(fid => fid !== id)"
                class="ml-1 text-primary hover:text-primary-dark focus:outline-none"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Forces -->
          <div class="relative mb-4">
            <input
              type="text"
              v-model="forceSearch"
              placeholder="Search forces..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
            <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Forces Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto px-1">
            <label 
              v-for="force in filteredForces" 
              :key="force.id"
              class="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              :class="{ 'bg-primary bg-opacity-5': selectedForceIds.includes(force.id) }"
            >
              <input
                type="checkbox"
                :value="force.id"
                v-model="selectedForceIds"
                class="rounded border-gray-300 text-primary focus:ring-primary"
              >
              <div class="flex items-center ml-2">
                <img 
                  :src="forceLogos[force.id]?.logo_url" 
                  :alt="`${force.name} logo`"
                  class="w-8 h-8 object-contain mr-2"
                  @error="handleImageError"
                >
                <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{{ force.name }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Month Selection and Update -->
        <div class="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-6 mt-6">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
            <div class="relative">
              <select
                v-model="selectedMonth"
                class="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="latest">Latest Available</option>
                <option 
                  v-for="month in availableMonths" 
                  :key="month.value" 
                  :value="month.value"
                  :disabled="month.disabled"
                >
                  {{ formatMonth(month.value) }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="flex items-end">
            <button
              @click="loadStatistics"
              class="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-h-[42px] space-x-2"
              :disabled="isLoading || selectedForceIds.length === 0"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{{ isLoading ? 'Fetching Data...' : 'Get Data' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Findings -->
    <div v-if="!isLoading && !showProgressModal" class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Key Findings</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          v-for="finding in visibleKeyFindings" 
          :key="finding.title"
          class="bg-gray-50 rounded-lg p-4"
        >
          <h3 class="text-sm font-medium text-gray-500">{{ finding.title }}</h3>
          <p class="mt-1 text-lg font-semibold">{{ finding.value }}</p>
          <p class="text-sm text-gray-500">{{ finding.subtext }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="loading-spinner"></div>
    </div>

    <!-- Progress Modal -->
    <div v-if="showProgressModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold">Fetching Data</h3>
            <p class="text-sm text-gray-600 mt-1">This may take a few minutes. You can cancel at any time.</p>
          </div>
          <button 
            @click="cancelDataFetch"
            class="text-gray-500 hover:text-gray-700"
            title="Cancel data fetch"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">Overall Progress</span>
            <div class="text-sm text-gray-500">
              <span class="font-medium">{{ progressStats.completed }}</span> of 
              <span class="font-medium">{{ progressStats.total }}</span> forces
              ({{ Math.round((progressStats.completed / progressStats.total) * 100) }}%)
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              class="bg-primary rounded-full h-2.5 transition-all duration-300"
              :style="{ width: `${(progressStats.completed / progressStats.total) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>{{ progressStats.forces.filter(f => f.status === 'completed').length }} completed</span>
            <span>{{ progressStats.forces.filter(f => f.status === 'error').length }} failed</span>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent z-10"></div>
          <div ref="forcesList" class="space-y-2 max-h-60 overflow-y-auto px-1 relative scroll-smooth">
            <div 
              v-for="force in progressStats.forces" 
              :key="force.id"
              :ref="el => { if (force.status === 'loading') currentForceElement = el as HTMLElement }"
              :class="[
                'flex items-center justify-between p-2 rounded-lg transition-colors duration-200',
                force.status === 'loading' ? 'bg-blue-50' : 'hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 flex items-center justify-center">
                  <template v-if="force.status === 'pending'">
                    <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </template>
                  <template v-else-if="force.status === 'loading'">
                    <div class="loading-spinner-small"></div>
                  </template>
                  <template v-else-if="force.status === 'completed'">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </template>
                  <template v-else-if="force.status === 'error'">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </template>
                </div>
                <span class="text-sm font-medium">{{ force.name }}</span>
              </div>
              <span class="text-sm" :class="{
                'text-gray-400': force.status === 'pending',
                'text-blue-500': force.status === 'loading',
                'text-green-500': force.status === 'completed',
                'text-red-500': force.status === 'error'
              }">
                {{ force.status.charAt(0).toUpperCase() + force.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <template v-if="progressStats.completed < progressStats.total">
              Estimated time remaining: {{ estimatedTimeRemaining }}
            </template>
            <template v-else>
              All forces processed
            </template>
          </div>
          <button
            @click="cancelDataFetch"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Content -->
    <div v-else>
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Total Searches</h3>
          <div class="text-3xl font-bold text-primary">
            {{ statistics.totalSearches.toLocaleString() }}
      </div>
      </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Arrests Made</h3>
          <div class="text-3xl font-bold text-primary">
            {{ statistics.arrests.toLocaleString() }}
      </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ ((statistics.arrests / statistics.totalSearches) * 100).toFixed(1) }}% of searches
      </div>
    </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">No Further Action</h3>
          <div class="text-3xl font-bold text-primary">
            {{ statistics.noFurtherAction.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ ((statistics.noFurtherAction / statistics.totalSearches) * 100).toFixed(1) }}% of searches
          </div>
      </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Most Common Object</h3>
          <div class="text-xl font-bold text-primary">
            {{ statistics.mostCommonObject }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ statistics.mostCommonObjectCount.toLocaleString() }} searches
            ({{ ((statistics.mostCommonObjectCount / statistics.totalSearches) * 100).toFixed(1) }}%)
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Gender Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Gender Distribution</h3>
          <div class="space-y-2">
            <div v-for="[gender, count] in sortedGenderData" 
                 :key="gender"
                 class="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">{{ gender }}</span>
                <span class="font-semibold text-primary">
                  {{ count.toLocaleString() }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary rounded-full h-2 transition-all"
                     :style="{ width: `${(count / statistics.totalSearches) * 100}%` }">
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-1 text-right">
                {{ ((count / statistics.totalSearches) * 100).toFixed(1) }}% of searches
              </div>
            </div>
          </div>
        </div>

        <!-- Objects of Search -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Objects of Search</h3>
          <div class="space-y-2">
            <div v-for="[object, count] in sortedObjectsData" 
                 :key="object"
                 class="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">{{ object }}</span>
                <span class="font-semibold text-primary">
                  {{ count.toLocaleString() }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary rounded-full h-2 transition-all"
                     :style="{ width: `${(count / statistics.totalSearches) * 100}%` }">
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-1 text-right">
                {{ ((count / statistics.totalSearches) * 100).toFixed(1) }}% of searches
              </div>
            </div>
          </div>
        </div>

        <!-- Search Outcomes -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Search Outcomes</h3>
          <div class="space-y-2">
            <div v-for="[outcome, count] in sortedOutcomesData" 
                 :key="outcome"
                 class="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">{{ outcome }}</span>
                <span class="font-semibold text-primary">
                  {{ count.toLocaleString() }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary rounded-full h-2 transition-all"
                     :style="{ width: `${(count / statistics.totalSearches) * 100}%` }">
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-1 text-right">
                {{ ((count / statistics.totalSearches) * 100).toFixed(1) }}% of searches
              </div>
            </div>
          </div>
        </div>

        <!-- Ethnicity Analysis (moved to bottom) -->
        <div class="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <h3 class="text-lg font-semibold mb-4">Ethnicity Analysis</h3>
          <div class="space-y-4">
            <div v-for="[ethnicity, count] in sortedEthnicityData" 
                 :key="ethnicity" 
                 class="bg-gray-50 p-4 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex-1">
                  <span class="font-medium">{{ ethnicity }}</span>
                  <div class="flex items-center mt-1">
                    <div class="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                      <div class="bg-primary rounded-full h-2"
                           :style="{ width: `${(count / statistics.totalSearches) * 100}%` }">
                      </div>
                    </div>
                    <span class="text-sm text-gray-500 whitespace-nowrap">
                      {{ count.toLocaleString() }} ({{ ((count / statistics.totalSearches) * 100).toFixed(1) }}%)
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span class="text-sm">
                    {{ statistics.ethnicityOutcomes[ethnicity]?.arrests || 0 }} arrests
                  </span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span class="text-sm">
                    {{ statistics.ethnicityOutcomes[ethnicity]?.noAction || 0 }} no action
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Force Rankings -->
        <div class="bg-white rounded-lg shadow p-6 lg:col-span-3 mt-6">
          <h3 class="text-lg font-semibold mb-4">Force Rankings by Search Volume</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Force</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Searches</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of All Searches</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="ranking in forceRankings" 
                    :key="ranking.force"
                    class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ ranking.rank }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ ranking.force }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ ranking.count.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ ((ranking.count / statistics.totalSearches) * 100).toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Section -->
    <section class="mt-12 bg-gray-50 rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-6">Additional Resources</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Official Statistics -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3">Official Statistics</h3>
          <div class="space-y-3">
            <a 
              href="https://www.gov.uk/government/publications/stop-and-search-statistics-data-tables"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Government Data Tables
            </a>
            <a 
              href="https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/policing/stop-and-search/latest"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ethnicity Facts & Figures
            </a>
          </div>
        </div>

        <!-- Research & Analysis -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3">Research & Analysis</h3>
          <div class="space-y-3">
            <a 
              href="https://www.justiceinspectorates.gov.uk/hmicfrs/our-work/article/stop-and-search/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              HMICFRS Reports
            </a>
            <a 
              href="https://www.college.police.uk/app/stop-and-search/stop-and-search"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              College of Policing
            </a>
          </div>
        </div>

        <!-- Data Sources -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3">Data Sources</h3>
          <div class="space-y-3">
            <a 
              href="https://data.police.uk"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Police Data UK
            </a>
            <a 
              href="/api"
              class="flex items-center text-primary hover:text-primary-dark"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              API Documentation
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Server-Side Rendered Data Section (Visible to Bots) -->
    <section class="mt-12 bg-gray-50 rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-6">Latest Statistics Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Searches -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Searches</h3>
          <p class="text-3xl font-bold text-primary">{{ statistics.totalSearches.toLocaleString() }}</p>
          <p class="text-sm text-gray-600 mt-1">Latest available data</p>
        </div>

        <!-- Arrests -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Arrests</h3>
          <p class="text-3xl font-bold text-green-600">{{ statistics.arrests.toLocaleString() }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ statistics.totalSearches > 0 ? ((statistics.arrests / statistics.totalSearches) * 100).toFixed(1) : 0 }}% arrest rate</p>
        </div>

        <!-- No Further Action -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Further Action</h3>
          <p class="text-3xl font-bold text-orange-600">{{ statistics.noFurtherAction.toLocaleString() }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ statistics.totalSearches > 0 ? ((statistics.noFurtherAction / statistics.totalSearches) * 100).toFixed(1) : 0 }}% of searches</p>
        </div>

        <!-- Forces Analyzed -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Forces Analyzed</h3>
          <p class="text-3xl font-bold text-blue-600">{{ statistics.forcesAnalyzed || forces.length }}</p>
          <p class="text-sm text-gray-600 mt-1">of {{ forces.length }} total forces</p>
        </div>
      </div>

      <!-- Key Statistics -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Most Common Object of Search -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Most Common Object of Search</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-primary">{{ statistics.mostCommonObject }}</span>
            <span class="text-lg text-gray-600">{{ statistics.mostCommonObjectCount.toLocaleString() }} searches</span>
          </div>
        </div>

        <!-- Latest Data Month -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Latest Data Available</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-primary">{{ statistics.latestMonth || 'Latest' }}</span>
            <span class="text-lg text-gray-600">Updated monthly</span>
          </div>
        </div>
      </div>

      <!-- Data Freshness Notice -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <h4 class="text-sm font-medium text-blue-800">Data Freshness</h4>
            <p class="text-sm text-blue-700 mt-1">
              This data is automatically updated monthly from official UK Police sources. 
              The latest available data is from {{ statistics.latestMonth || 'the most recent month' }}. 
              Search engines can crawl this content to understand current trends and statistics.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { format, parse } from 'date-fns'
import { useStopSearchStore } from '../stores/stopsearch'
import { useRoute } from 'vue-router'
import { Chart } from 'chart.js/auto'
import type { StopSearchIncident } from '../types'
import forceLogos from '../police_forces.json'
import { useHead } from 'nuxt/app'
import { useAnalytics } from '../composables/useAnalytics'

// Initialize head metadata
useHead({
  title: 'Stop and Search Statistics | UK Police Data Analysis',
  meta: [
    {
      name: 'description',
      content: 'Comprehensive analysis of UK police stop and search data.'
    },
    {
      name: 'keywords',
      content: 'police statistics, stop and search data, UK police analysis, crime statistics, police demographics'
    },
    {
      property: 'og:title',
      content: 'Stop and Search Statistics | UK Police Data Analysis'
    },
    {
      property: 'og:description',
      content: 'Comprehensive statistics and analysis of UK police stop and search data. View trends, demographics, and outcomes.'
    }
  ]
})

// Server-side data fetching
const config = useRuntimeConfig()
const baseURL = config.public.siteUrl || 'http://localhost:3000'
const statisticsData = await $fetch(`${baseURL}/api/statistics`)

// State
const store = useStopSearchStore()
const route = useRoute()
const selectedForceIds = ref<string[]>([])
const selectAllForces = ref(false)
const selectedMonth = ref<string>('latest')
const forces = ref((statisticsData as any)?.forces || [] as { id: string; name: string }[])
const isLoading = ref(false)
const statistics = ref((statisticsData as any)?.statistics || {
  totalSearches: 0,
  arrests: 0,
  noFurtherAction: 0,
  outcomes: {} as Record<string, number>,
  ethnicityBreakdown: {} as Record<string, number>,
  ethnicityOutcomes: {} as Record<string, { arrests: number, noAction: number }>,
  objectsOfSearch: {} as Record<string, number>,
  genderBreakdown: {} as Record<string, number>,
  ageBreakdown: {} as Record<string, number>,
  mostCommonObject: 'None',
  mostCommonObjectCount: 0
})

// Chart refs
const outcomesChart = ref<HTMLCanvasElement | null>(null)
const objectsChart = ref<HTMLCanvasElement | null>(null)
const genderChart = ref<HTMLCanvasElement | null>(null)
const chartInstances = ref<any[]>([])

// Add these to the state section
const showProgressModal = ref(false)

// Add this interface before the state section
interface ForceProgress {
  id: string
  name: string
  status: 'pending' | 'loading' | 'completed' | 'error'
  error: string | null
  retryCount: number
}

// Update the progressStats type
const progressStats = ref({
  completed: 0,
  total: 0,
  forces: [] as ForceProgress[]
})
const isCancelled = ref(false)
const startTime = ref<number>(0)
const currentForceElement = ref<HTMLElement | null>(null)
const forcesList = ref<HTMLElement | null>(null)

// Add these to the state section after statistics ref
const keyFindings = ref({
  mostCommonReason: { value: 'None', count: 0 },
  peakTime: { range: 'None', count: 0 },
  mostActiveForce: { name: 'None', count: 0 },
  totalForces: 0,
  searchesPerForce: {} as Record<string, number>,
  arrestRate: { force: 'None', rate: 0 },
  highestNoActionRate: { force: 'None', rate: 0 },
  peakDay: { day: 'None', count: 0 },
  mostCommonAge: { range: 'None', count: 0 }
})

// Add to the script section, after the state declarations:
const forceSearch = ref('')

// Route handling for force parameter
const router = useRouter()

// Initialize selected forces from URL parameter
const initializeFromRoute = () => {
  const forceParam = route.query.force as string
  if (forceParam && forces.value.length > 0) {
    const force = forces.value.find(f => f.id === forceParam)
    if (force) {
      selectedForceIds.value = [forceParam]
      selectAllForces.value = false
    }
  }
}

// Computed properties for dynamic SEO
const pageTitle = computed(() => {
  if (selectedForceIds.value.length === 1) {
    const force = forces.value.find(f => f.id === selectedForceIds.value[0])
    return `${force?.name} Stop and Search Statistics | UK Police Data Analysis`
  }
  return 'Stop and Search Statistics | UK Police Data Analysis'
})

const pageDescription = computed(() => {
  if (selectedForceIds.value.length === 1) {
    const force = forces.value.find(f => f.id === selectedForceIds.value[0])
    return `Comprehensive stop and search statistics and analysis for ${force?.name}. View trends, demographics, and outcomes.`
  }
  return 'Comprehensive analysis of UK police stop and search data. View trends, demographics, and outcomes across all forces.'
})

const canonicalUrl = computed(() => {
  if (selectedForceIds.value.length === 1) {
    return `https://policestopsearch.co.uk/statistics?force=${selectedForceIds.value[0]}`
  }
  return 'https://policestopsearch.co.uk/statistics'
})

// Watch for force selection changes and update URL
watch(selectedForceIds, (newForces) => {
  if (newForces.length === 1) {
    router.push({ query: { force: newForces[0] } })
  } else if (newForces.length === 0) {
    router.push({ query: {} })
  }
}, { deep: true })

// Initialize from route on mount
onMounted(() => {
  initializeFromRoute()
})

// Add this computed property
const filteredForces = computed(() => {
  const search = forceSearch.value.toLowerCase()
  return forces.value.filter(force => 
    force.name.toLowerCase().includes(search)
  )
})

// Computed
const availableMonths = computed(() => {
  const months: { value: string; label: string; disabled: boolean }[] = []
  
  store.availableDatasets.forEach(dataset => {
    try {
      const date = parse(dataset.date, 'yyyy-MM', new Date())
      const value = format(date, 'yyyy-MM')
      const label = format(date, 'MMM yyyy')
      const disabled = !store.isDateAvailable(value)
      
      months.push({ value, label, disabled })
    } catch (error) {
      console.error('Error parsing date:', error)
    }
  })

  return months.sort((a, b) => b.value.localeCompare(a.value))
})

// Add computed for estimated time
const estimatedTimeRemaining = computed(() => {
  if (progressStats.value.completed === 0) return 'Calculating...'
  
  const elapsedTime = Date.now() - startTime.value
  const timePerForce = elapsedTime / progressStats.value.completed
  const remainingForces = progressStats.value.total - progressStats.value.completed
  const remainingTime = timePerForce * remainingForces

  if (remainingTime < 60000) {
    return 'Less than a minute'
  } else {
    const minutes = Math.ceil(remainingTime / 60000)
    return `About ${minutes} minute${minutes > 1 ? 's' : ''}`
  }
})

// Add these computed properties
const selectedForceNames = computed(() => {
  return selectedForceIds.value.map(id => 
    forces.value.find(f => f.id === id)?.name || 'Unknown Force'
  )
})

// Add computed properties for sorted data
const sortedEthnicityData = computed(() => {
  return Object.entries(statistics.value.ethnicityBreakdown)
    .sort(([,a], [,b]) => b - a)
})

const sortedGenderData = computed(() => {
  return Object.entries(statistics.value.genderBreakdown)
    .sort(([,a], [,b]) => b - a)
})

const sortedObjectsData = computed(() => {
  return Object.entries(statistics.value.objectsOfSearch)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
})

const sortedOutcomesData = computed(() => {
  return Object.entries(statistics.value.outcomes)
    .sort(([,a], [,b]) => b - a)
})

// Add computed property for force rankings
const forceRankings = computed(() => {
  const rankings = Object.entries(keyFindings.value.searchesPerForce)
    .map(([force, count]) => ({ force, count }))
    .sort((a, b) => b.count - a.count)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }))
  return rankings
})

// Methods
const formatMonth = (dateString: string) => {
  if (dateString === 'latest') return 'Latest Available'
  try {
    return format(parse(dateString, 'yyyy-MM', new Date()), 'MMMM yyyy')
  } catch {
    return dateString
  }
}

const cancelDataFetch = () => {
  analytics.trackFeatureUse('statistics', 'cancel_load')
  isCancelled.value = true
  showProgressModal.value = false
}

const resetProgress = () => {
  progressStats.value = {
    completed: 0,
    total: 0,
    forces: []
  }
  isCancelled.value = false
}

const initializeSelectedForces = () => {
  const stored = localStorage.getItem('selectedForces')
  if (stored) {
    selectedForceIds.value = JSON.parse(stored)
  } else {
    // Default forces if none stored
    selectedForceIds.value = [
      'metropolitan',
      'greater-manchester',
      'west-midlands',
      'west-yorkshire',
      'essex',
    ]
  }
}

// Move aggregatedStats declaration outside the loadStatistics function
let aggregatedStats = {
  totalSearches: 0,
  arrests: 0,
  noFurtherAction: 0,
  outcomes: {} as Record<string, number>,
  ethnicityBreakdown: {} as Record<string, number>,
  ethnicityOutcomes: {} as Record<string, { arrests: number, noAction: number }>,
  objectsOfSearch: {} as Record<string, number>,
  genderBreakdown: {} as Record<string, number>,
  ageBreakdown: {} as Record<string, number>,
  mostCommonObject: 'None',
  mostCommonObjectCount: 0
}

const processIncidents = (incidents: StopSearchIncident[], forceName: string) => {
  // Track searches per force
  keyFindings.value.searchesPerForce[forceName] = (keyFindings.value.searchesPerForce[forceName] || 0) + incidents.length

  // Process time ranges for peak time analysis
  const timeRanges: Record<string, number> = {}
  const dayRanges: Record<string, number> = {}
  
  // Track force-specific counts
  let forceArrests = 0
  let forceNoActions = 0
  
  incidents.forEach(incident => {
    // Process existing statistics
    const outcome = incident.outcome || 'Not Recorded'
    aggregatedStats.outcomes[outcome] = (aggregatedStats.outcomes[outcome] || 0) + 1
    
    if (outcome.toLowerCase().includes('arrest')) {
      aggregatedStats.arrests++
      forceArrests++
    } else if (outcome.toLowerCase().includes('no further action')) {
      aggregatedStats.noFurtherAction++
      forceNoActions++
    }

    // Count ethnicities and their outcomes
    const ethnicity = incident.self_defined_ethnicity || incident.officer_defined_ethnicity || 'Not Recorded'
    aggregatedStats.ethnicityBreakdown[ethnicity] = (aggregatedStats.ethnicityBreakdown[ethnicity] || 0) + 1
    
    if (!aggregatedStats.ethnicityOutcomes[ethnicity]) {
      aggregatedStats.ethnicityOutcomes[ethnicity] = { arrests: 0, noAction: 0 }
    }
    
    if (outcome.toLowerCase().includes('arrest')) {
      aggregatedStats.ethnicityOutcomes[ethnicity].arrests++
    } else if (outcome.toLowerCase().includes('no further action')) {
      aggregatedStats.ethnicityOutcomes[ethnicity].noAction++
    }

    // Count objects of search
    const object = incident.object_of_search || 'Not Recorded'
    aggregatedStats.objectsOfSearch[object] = (aggregatedStats.objectsOfSearch[object] || 0) + 1

    // Count genders
    const gender = incident.gender || 'Not Recorded'
    aggregatedStats.genderBreakdown[gender] = (aggregatedStats.genderBreakdown[gender] || 0) + 1

    // Count age groups
    const age = incident.age_range || 'Not Recorded'
    aggregatedStats.ageBreakdown[age] = (aggregatedStats.ageBreakdown[age] || 0) + 1

    // Process time for key findings
    if (incident.datetime) {
      const date = new Date(incident.datetime)
      const hour = date.getHours()
      const range = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`
      timeRanges[range] = (timeRanges[range] || 0) + 1

      // Track day of week
      const day = date.toLocaleDateString('en-US', { weekday: 'long' })
      dayRanges[day] = (dayRanges[day] || 0) + 1
    }
  })

  // Calculate arrest rate for this force using force-specific counts
  const forceArrestRate = incidents.length > 0 ? (forceArrests / incidents.length) * 100 : 0
  if (forceArrestRate > keyFindings.value.arrestRate.rate) {
    keyFindings.value.arrestRate = { force: forceName, rate: forceArrestRate }
  }

  // Calculate no action rate for this force using force-specific counts
  const forceNoActionRate = incidents.length > 0 ? (forceNoActions / incidents.length) * 100 : 0
  if (forceNoActionRate > keyFindings.value.highestNoActionRate.rate) {
    keyFindings.value.highestNoActionRate = { force: forceName, rate: forceNoActionRate }
  }

  // Update peak day if this force has a higher peak
  Object.entries(dayRanges).forEach(([day, count]) => {
    if (count > keyFindings.value.peakDay.count) {
      keyFindings.value.peakDay = { day, count }
    }
  })

  // Update most common age range
  Object.entries(aggregatedStats.ageBreakdown).forEach(([range, count]) => {
    if (count > keyFindings.value.mostCommonAge.count) {
      keyFindings.value.mostCommonAge = { range, count }
    }
  })

  // Update total searches
  aggregatedStats.totalSearches += incidents.length

  // Update most common object
  const objects = Object.entries(aggregatedStats.objectsOfSearch)
  if (objects.length > 0) {
    const [object, count] = objects.reduce((max, curr) => 
      curr[1] > max[1] ? curr : max
    )
    aggregatedStats.mostCommonObject = object
    aggregatedStats.mostCommonObjectCount = count
  }

  // Update key findings peak time
  Object.entries(timeRanges).forEach(([range, count]) => {
    if (count > keyFindings.value.peakTime.count) {
      keyFindings.value.peakTime = { range, count }
    }
  })

  // Update most active force
  if (incidents.length > keyFindings.value.mostActiveForce.count) {
    keyFindings.value.mostActiveForce = { name: forceName, count: incidents.length }
  }

  // Update total forces count
  keyFindings.value.totalForces++
}

const loadStatistics = async () => {
  try {
    if (selectedForceIds.value.length === 0) {
      analytics.trackError('statistics', 'No forces selected', 'User attempted to load statistics without selecting forces')
      alert('Please select at least one police force')
      return
    }

    isLoading.value = true
    const perfStartTime = performance.now()

    // Track which forces are being analyzed
    analytics.trackFeatureUse('statistics', 'load_data')
    analytics.trackFilterUse('forces', selectedForceIds.value.join(','))
    analytics.trackFilterUse('month', selectedMonth.value)

    // Reset statistics and key findings
    statistics.value = {
      totalSearches: 0,
      arrests: 0,
      noFurtherAction: 0,
      outcomes: {},
      ethnicityBreakdown: {},
      ethnicityOutcomes: {},
      objectsOfSearch: {},
      genderBreakdown: {},
      ageBreakdown: {},
      mostCommonObject: 'None',
      mostCommonObjectCount: 0
    }

    keyFindings.value = {
      mostCommonReason: { value: 'None', count: 0 },
      peakTime: { range: 'None', count: 0 },
      mostActiveForce: { name: 'None', count: 0 },
      totalForces: 0,
      searchesPerForce: {},
      arrestRate: { force: 'None', rate: 0 },
      highestNoActionRate: { force: 'None', rate: 0 },
      peakDay: { day: 'None', count: 0 },
      mostCommonAge: { range: 'None', count: 0 }
    }

    // Reset aggregatedStats
    aggregatedStats = {
      totalSearches: 0,
      arrests: 0,
      noFurtherAction: 0,
      outcomes: {},
      ethnicityBreakdown: {},
      ethnicityOutcomes: {},
      objectsOfSearch: {},
      genderBreakdown: {},
      ageBreakdown: {},
      mostCommonObject: 'None',
      mostCommonObjectCount: 0
    }

    showProgressModal.value = true
    resetProgress()
    startTime.value = Date.now()

    // Initialize progress tracking
    progressStats.value.total = selectedForceIds.value.length
    progressStats.value.forces = selectedForceIds.value.map(id => ({
      id,
      name: forces.value.find(f => f.id === id)?.name || 'Unknown Force',
      status: 'pending',
      error: null,
      retryCount: 0
    }))

    const maxRetries = 2
    const processForce = async (force: typeof progressStats.value.forces[0]) => {
      if (isCancelled.value) return

      try {
        force.status = 'loading'
        force.error = null
        
        await nextTick()
        
        if (currentForceElement.value && forcesList.value) {
          currentForceElement.value.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }

        const forceIncidents = await store.getStopsByForce(
          force.id,
          selectedMonth.value === 'latest' ? undefined : selectedMonth.value
        )

        // Process incidents immediately and clear them from memory
        processIncidents(forceIncidents, force.name)
        force.status = 'completed'
        progressStats.value.completed++
      } catch (error) {
        console.error(`Error fetching data for force ${force.name}:`, error)
        force.status = 'error'
        force.error = error instanceof Error ? error.message : 'Unknown error'
        progressStats.value.completed++
        
        if (force.retryCount < maxRetries) {
          force.retryCount++
          force.status = 'pending'
          progressStats.value.completed--
          await new Promise(resolve => setTimeout(resolve, 2000))
          return processForce(force)
        }
      }
    }

    // Process forces sequentially
    for (const force of progressStats.value.forces) {
      if (isCancelled.value) break
      await processForce(force)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    if (!isCancelled.value) {
      const failedForces = progressStats.value.forces.filter(f => f.status === 'error')
      if (failedForces.length > 0) {
        const summary = `Completed with ${failedForces.length} failed forces:\n` +
          failedForces.map(f => `${f.name}: ${f.error}`).join('\n')
        console.warn(summary)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      showProgressModal.value = false
    }

    if (!isCancelled.value && aggregatedStats.totalSearches > 0) {
      statistics.value = aggregatedStats
      
      // Track performance and data size
      const perfEndTime = performance.now()
      analytics.trackPerformanceMetric('statistics_load_time', perfEndTime - perfStartTime)
      analytics.trackPerformanceMetric('total_incidents_analyzed', aggregatedStats.totalSearches)
      
      await nextTick()
      await initializeCharts()
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
    analytics.trackError('statistics', 'Failed to load statistics', error instanceof Error ? error.message : 'Unknown error')
    alert('An error occurred while loading statistics. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const initializeCharts = async () => {
  try {
    await nextTick()
    
    chartInstances.value.forEach(chart => {
      if (chart) {
        chart.destroy()
      }
    })
    chartInstances.value = []

    // Only proceed if we have data
    if (!statistics.value.totalSearches) {
      analytics.trackError('charts', 'No data available for charts', 'Attempted to initialize charts with no data')
      console.log('No data available for charts')
      return
    }

    // Track successful chart initialization
    analytics.trackFeatureUse('charts', 'initialization_success')

    // Helper function to safely get canvas context
    const getContext = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        console.warn('Canvas element not found')
        return null
      }
      
      const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
        alpha: true
      })
      
      if (!ctx) {
        console.warn('Could not get canvas context')
        return null
      }
      
      // Clear any existing content
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return ctx
    }

    // Initialize Objects of Search Chart
    const objectsCtx = getContext(objectsChart.value)
    if (objectsCtx) {
      const sortedObjects = Object.entries(statistics.value.objectsOfSearch)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)

      const objectsInstance = new Chart(objectsCtx, {
        type: 'bar',
        data: {
          labels: sortedObjects.map(([label]) => label),
          datasets: [{
            label: 'Number of Searches',
            data: sortedObjects.map(([,value]) => value),
            backgroundColor: '#3B82F6',
            borderRadius: 6,
            maxBarThickness: 30
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500
          },
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      })
      chartInstances.value.push(objectsInstance)
    }

    // Gender Distribution Chart
    const genderCtx = getContext(genderChart.value)
    if (genderCtx) {
      const sortedGender = Object.entries(statistics.value.genderBreakdown)
        .sort(([,a], [,b]) => b - a)

      const genderInstance = new Chart(genderCtx, {
        type: 'doughnut',
        data: {
          labels: sortedGender.map(([label]) => label),
          datasets: [{
            data: sortedGender.map(([,value]) => value),
            backgroundColor: [
              '#3B82F6',
              '#F472B6',
              '#9CA3AF'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500
          },
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12
              }
            }
          }
        }
      })
      chartInstances.value.push(genderInstance)
    }

    // Outcomes Chart
    const outcomesCtx = getContext(outcomesChart.value)
    if (outcomesCtx) {
      const sortedOutcomes = Object.entries(statistics.value.outcomes)
        .sort(([,a], [,b]) => b - a)

      const outcomesInstance = new Chart(outcomesCtx, {
        type: 'doughnut',
        data: {
          labels: sortedOutcomes.map(([label]) => label),
          datasets: [{
            data: sortedOutcomes.map(([,value]) => value),
            backgroundColor: [
              '#3B82F6',
              '#EF4444',
              '#10B981',
              '#F59E0B',
              '#6366F1'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500
          },
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12
              }
            }
          }
        }
      })
      chartInstances.value.push(outcomesInstance)
    }
  } catch (error) {
    console.error('Error initializing charts:', error)
    analytics.trackError('charts', 'Failed to initialize charts', error instanceof Error ? error.message : 'Unknown error')
  }
}

// Update visibleKeyFindings computed property
const visibleKeyFindings = computed(() => {
  const findings = [
    {
      title: 'Most Common Reason',
      value: statistics.value.mostCommonObject,
      subtext: `${statistics.value.mostCommonObjectCount.toLocaleString()} searches`
    },
    {
      title: 'Peak Time for Searches',
      value: keyFindings.value.peakTime.range,
      subtext: `${keyFindings.value.peakTime.count.toLocaleString()} searches`
    }
  ]

  // Only add these if multiple forces are selected
  if (selectedForceIds.value.length > 1) {
    findings.push(
      {
        title: 'Most Active Force',
        value: keyFindings.value.mostActiveForce.name,
        subtext: `${keyFindings.value.mostActiveForce.count.toLocaleString()} searches`
      },
      {
        title: 'Highest Arrest Rate',
        value: keyFindings.value.arrestRate.force,
        subtext: `${keyFindings.value.arrestRate.rate.toFixed(1)}% of searches`
      },
      {
        title: 'Highest No Action Rate',
        value: keyFindings.value.highestNoActionRate.force,
        subtext: `${keyFindings.value.highestNoActionRate.rate.toFixed(1)}% of searches`
      }
    )
  }

  findings.push(
    {
      title: 'Busiest Day',
      value: keyFindings.value.peakDay.day,
      subtext: `${keyFindings.value.peakDay.count.toLocaleString()} searches`
    },
    {
      title: 'Most Common Age Range',
      value: keyFindings.value.mostCommonAge.range,
      subtext: `${keyFindings.value.mostCommonAge.count.toLocaleString()} searches`
    },
    {
      title: 'Total Forces Analyzed',
      value: progressStats.value.completed.toString(),
      subtext: `of ${forces.value.length} forces available`
    }
  )

  return findings
})

// Lifecycle
onMounted(async () => {
  try {
    // Initialize selected forces from localStorage
    initializeSelectedForces()
    
    // Check for force parameter in URL
    const forceId = route.query.force as string
    if (forceId) {
      selectedForceIds.value = [forceId]
    }

    // Data is already loaded server-side, initialize charts
    await nextTick()
    await initializeCharts()
  } catch (error) {
    console.error('Error in component mount:', error)
  }
})

// Cleanup
onUnmounted(() => {
  // Destroy chart instances
  chartInstances.value.forEach(chart => {
    if (chart) {
      chart.destroy()
    }
  })
  chartInstances.value = []
})

// Watch selected forces changes
watch(selectedForceIds, (newIds) => {
  localStorage.setItem('selectedForces', JSON.stringify(newIds))
  // Reset selectAllForces when manually deselecting forces
  if (newIds.length < forces.value.length) {
    selectAllForces.value = false
    analytics.trackFilterUse('forces_deselect', 'manual_deselection')
  }
  // Set selectAllForces to true when all forces are selected
  if (newIds.length === forces.value.length) {
    selectAllForces.value = true
    analytics.trackFilterUse('forces_select', 'select_all')
  }
}, { deep: true })

// Update the watch for statistics changes
watch(() => statistics.value, async () => {
  try {
    // Add a small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100))
    await initializeCharts()
  } catch (error) {
    console.error('Error updating charts:', error)
  }
}, { deep: true })

// Add to script section
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/forces/default.png'
  img.classList.add('opacity-50')
}

// Add after other state declarations
const analytics = useAnalytics()
</script>

<style scoped>
.loading-spinner {
  @apply w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin;
}

.loading-spinner-small {
  @apply w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin;
}

/* Add smooth transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.force-label {
  background: none;
  border: none;
  z-index: 1000;
}

.force-label div {
  white-space: nowrap;
  border: 1px solid rgba(59, 130, 246, 0.5);
  position: relative;
  z-index: 1000;
}

/* Ensure map container has proper dimensions */
.relative.aspect-\[16\/9\] {
  min-height: 400px;
}
</style> 