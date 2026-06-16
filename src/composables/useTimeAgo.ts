// useTimeAgo.ts
import { computed, ref, onUnmounted, type Ref } from 'vue'

export function useTimeAgo(timestamp: Ref<string>) {
  const now = ref(Date.now())

  const interval = setInterval(() => {
    now.value = Date.now()
  }, 60_000)

  onUnmounted(() => clearInterval(interval))

  const timeAgo = computed(() => {
    const date = new Date(timestamp.value).getTime()
    const diff = now.value - date

    const minutes = Math.floor(diff / 60_000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`

    return `${Math.floor(minutes / 60)} hr ago`
  })

  return { timeAgo }
}