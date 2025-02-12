<template>
  <div
    class="state-message"
    :class="{
      'error': type === 'error',
      'loading': type === 'loading',
      'success': type === 'success',
      'info': type === 'info'
    }"
  >
    <!-- Icon -->
    <div class="icon" v-if="type === 'loading'">
      <div class="spinner"></div>
    </div>
    <div class="icon" v-else>
      <span v-if="type === 'error'">❌</span>
      <span v-else-if="type === 'success'">✅</span>
      <span v-else-if="type === 'info'">ℹ️</span>
    </div>

    <!-- Content -->
    <div class="content">
      <h3 v-if="title" class="title">{{ title }}</h3>
      <p class="message">{{ message }}</p>
      
      <!-- Action Button -->
      <button
        v-if="actionLabel"
        class="action-button"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </button>

      <!-- Additional Details -->
      <div v-if="details" class="details">
        <button
          class="details-toggle"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Hide Details' : 'Show Details' }}
        </button>
        <div v-if="isExpanded" class="details-content">
          <pre>{{ details }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface Props {
  type: 'error' | 'loading' | 'success' | 'info';
  title?: string;
  message: string;
  details?: string;
  actionLabel?: string;
}

defineProps<Props>()
defineEmits<{
  (e: 'action'): void;
}>()

const isExpanded = ref(false)
</script>

<style scoped>
.state-message {
  @apply flex items-start p-4 rounded-lg;
}

.state-message.error {
  @apply bg-red-50 border border-red-200;
}

.state-message.loading {
  @apply bg-blue-50 border border-blue-200;
}

.state-message.success {
  @apply bg-green-50 border border-green-200;
}

.state-message.info {
  @apply bg-gray-50 border border-gray-200;
}

.icon {
  @apply flex-shrink-0 mr-4;
}

.spinner {
  @apply w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin;
}

.content {
  @apply flex-grow;
}

.title {
  @apply text-lg font-semibold mb-1;
}

.error .title {
  @apply text-red-800;
}

.loading .title {
  @apply text-blue-800;
}

.success .title {
  @apply text-green-800;
}

.info .title {
  @apply text-gray-800;
}

.message {
  @apply text-sm;
}

.error .message {
  @apply text-red-700;
}

.loading .message {
  @apply text-blue-700;
}

.success .message {
  @apply text-green-700;
}

.info .message {
  @apply text-gray-700;
}

.action-button {
  @apply mt-3 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200;
}

.error .action-button {
  @apply bg-red-100 text-red-800 hover:bg-red-200;
}

.loading .action-button {
  @apply bg-blue-100 text-blue-800 hover:bg-blue-200;
}

.success .action-button {
  @apply bg-green-100 text-green-800 hover:bg-green-200;
}

.info .action-button {
  @apply bg-gray-100 text-gray-800 hover:bg-gray-200;
}

.details {
  @apply mt-3;
}

.details-toggle {
  @apply text-sm underline;
}

.error .details-toggle {
  @apply text-red-700;
}

.loading .details-toggle {
  @apply text-blue-700;
}

.success .details-toggle {
  @apply text-green-700;
}

.info .details-toggle {
  @apply text-gray-700;
}

.details-content {
  @apply mt-2 p-2 rounded bg-white bg-opacity-50 text-sm font-mono;
}

.error .details-content {
  @apply bg-red-50;
}

.loading .details-content {
  @apply bg-blue-50;
}

.success .details-content {
  @apply bg-green-50;
}

.info .details-content {
  @apply bg-gray-50;
}
</style> 