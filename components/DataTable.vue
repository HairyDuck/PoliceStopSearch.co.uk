<template>
  <div class="data-table">
    <!-- Table Controls -->
    <div class="table-controls">
      <!-- Search -->
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="search-input"
          @input="handleSearch"
        />
      </div>

      <!-- Page Size -->
      <div class="page-size">
        <label>Show</label>
        <select v-model="pageSize" class="page-size-select">
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="handleSort(column)"
              :class="{ sortable: column.sortable }"
            >
              {{ column.label }}
              <span v-if="column.sortable" class="sort-icon">
                {{ getSortIcon(column.key) }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columns.length">
              <div class="loading-message">
                <div class="spinner"></div>
                <span>Loading data...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredData.length === 0" class="empty-row">
            <td :colspan="columns.length">
              <div class="empty-message">
                No data available
              </div>
            </td>
          </tr>
          <tr
            v-else
            v-for="(row, index) in paginatedData"
            :key="index"
            @click="handleRowClick(row)"
            :class="{ clickable: !!onRowClick }"
          >
            <td
              v-for="column in columns"
              :key="column.key"
            >
              <template v-if="column.formatter">
                {{ column.formatter(row[column.key]) }}
              </template>
              <template v-else>
                {{ row[column.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="pagination-info">
        Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalItems }} entries
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          ⟪
        </button>
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ⟨
        </button>
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          ⟩
        </button>
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          ⟫
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any) => string;
}

interface Props {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:sort', sort: { key: string; direction: 'asc' | 'desc' }): void;
}>()

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizes = [10, 25, 50, 100]

// Search
const searchQuery = ref('')
const searchDebounceTimeout = ref<number | null>(null)

// Sorting
const sortKey = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Computed Properties
const filteredData = computed(() => {
  let result = [...props.data]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(row => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(query)
      )
    })
  }

  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      if (aVal === bVal) return 0
      
      const comparison = aVal > bVal ? 1 : -1
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

const totalItems = computed(() => filteredData.value.length)

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const paginationStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalItems.value)
})

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= currentPage.value - delta && i <= currentPage.value + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach(i => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// Methods
const handleSearch = () => {
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value)
  }

  searchDebounceTimeout.value = window.setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

const handleSort = (column: Column) => {
  if (!column.sortable) return

  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }

  emit('update:sort', { key: sortKey.value, direction: sortDirection.value })
}

const getSortIcon = (columnKey: string): string => {
  if (sortKey.value !== columnKey) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const handleRowClick = (row: any) => {
  if (props.onRowClick) {
    props.onRowClick(row)
  }
}

const goToPage = (page: number) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
}

// Watchers
watch(pageSize, () => {
  currentPage.value = 1
})

watch(() => props.data, () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
.data-table {
  @apply w-full;
}

.table-controls {
  @apply flex justify-between items-center mb-4;
}

.search-box {
  @apply relative;
}

.search-input {
  @apply w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-color focus:border-primary-color;
}

.page-size {
  @apply flex items-center space-x-2;
}

.page-size-select {
  @apply px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-color focus:border-primary-color;
}

.table-container {
  @apply w-full overflow-x-auto border border-gray-200 rounded-lg;
}

table {
  @apply w-full border-collapse;
}

th {
  @apply px-4 py-3 text-left bg-gray-50 border-b border-gray-200 font-medium text-gray-700;
}

th.sortable {
  @apply cursor-pointer hover:bg-gray-100;
}

.sort-icon {
  @apply ml-1 text-gray-400;
}

td {
  @apply px-4 py-3 border-b border-gray-200;
}

tr:last-child td {
  @apply border-b-0;
}

tr.clickable {
  @apply cursor-pointer hover:bg-gray-50;
}

.loading-row td,
.empty-row td {
  @apply py-8;
}

.loading-message,
.empty-message {
  @apply flex items-center justify-center text-gray-500;
}

.spinner {
  @apply w-5 h-5 border-2 border-primary-color border-t-transparent rounded-full animate-spin mr-2;
}

.pagination {
  @apply flex justify-between items-center mt-4;
}

.pagination-info {
  @apply text-sm text-gray-600;
}

.pagination-controls {
  @apply flex items-center space-x-1;
}

.pagination-button {
  @apply px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed;
}

.page-numbers {
  @apply flex items-center space-x-1;
}

.page-number {
  @apply px-3 py-1 text-gray-600 hover:bg-gray-100 rounded;
}

.page-number.active {
  @apply bg-primary-color text-white hover:bg-primary-color-dark;
}
</style> 