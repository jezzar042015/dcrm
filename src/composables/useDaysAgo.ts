// useDaysAgo.ts
import { computed, ref, onUnmounted, type Ref } from 'vue'

export function useDaysAgo(timestamp: Ref<string>) {
  const now = ref(Date.now())

  // Update once an hour since we are dealing with days/weeks/months
  const interval = setInterval(() => {
    now.value = Date.now()
  }, 3_600_000)

  onUnmounted(() => clearInterval(interval))

  const daysAgo = computed(() => {
    if (!timestamp.value) return 'No Call Visit'
    const date = new Date(timestamp.value).getTime()
    const diff = now.value - date

    // Milliseconds constants
    const ONE_DAY = 24 * 60 * 60 * 1000
    const ONE_WEEK = ONE_DAY * 7
    const ONE_MONTH = ONE_DAY * 30.4375 // Average days in a month over a year
    const ONE_YEAR = ONE_DAY * 365.25   // Accounting for leap years

    if (diff < ONE_DAY) {
      return 'Today'
    }

    const days = Math.floor(diff / ONE_DAY)
    if (days < 7) {
      return days === 1 ? '1 day ago' : `${days} days ago`
    }

    const weeks = Math.floor(diff / ONE_WEEK)
    if (diff < ONE_MONTH) {
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    }

    const months = Math.floor(diff / ONE_MONTH)
    if (diff < ONE_YEAR) {
      return months === 1 ? '1 month ago' : `${months} months ago`
    }

    const years = Math.floor(diff / ONE_YEAR)
    return years === 1 ? '1 year ago' : `${years} years ago`
  })

  return { daysAgo }
}