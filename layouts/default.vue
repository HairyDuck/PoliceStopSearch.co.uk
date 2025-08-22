<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="site-header">
      <div class="container header-content">
        <NuxtLink to="/" class="logo">
          UK Police Stop Search Portal
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink 
            to="/map" 
            class="nav-link"
            :class="{ 'active': $route.path === '/map' }"
          >
            Map
          </NuxtLink>
          <NuxtLink 
            to="/statistics" 
            class="nav-link"
            :class="{ 'active': $route.path === '/statistics' }"
          >
            Statistics
          </NuxtLink>
          <NuxtLink 
            to="/analytics" 
            class="nav-link"
            :class="{ 'active': $route.path === '/analytics' }"
          >
            Analytics
          </NuxtLink>
          <NuxtLink 
            to="/forces" 
            class="nav-link"
            :class="{ 'active': $route.path === '/forces' }"
          >
            Police Forces
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="nav-link"
            :class="{ 'active': $route.path === '/about' }"
          >
            About
          </NuxtLink>
          <a 
            href="https://github.com/HairyDuck/PoliceStopSearch.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link"
          >
            <span>GitHub</span>
            <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </nav>

    <main class="container py-8">
      <slot />
    </main>

    <footer class="bg-white mt-auto">
      <div class="container py-6">
        <p class="text-center text-gray-500">
          Data provided by <a href="https://data.police.uk" class="text-primary hover:text-primary-dark">data.police.uk</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No need to import defineProps or defineEmits as they are compiler macros
</script>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium;
  @apply border-b-2 border-transparent;
}

.nav-link:hover {
  @apply text-primary border-primary-light;
}

.nav-link.active {
  @apply border-primary text-primary;
}
</style> 