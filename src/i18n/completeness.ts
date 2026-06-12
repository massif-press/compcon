import { ref } from 'vue'

const STATS_URL = 'https://hosted.weblate.org/api/components/compcon/ui/statistics/'

// at or above this translated percent a locale is treated as reviewed
export const QUALITY_THRESHOLD = 90

export const completeness = ref<Record<string, number>>({})

let started = false

export async function fetchCompleteness(): Promise<void> {
  if (started) return
  started = true
  try {
    const map: Record<string, number> = {}
    let url: string | null = STATS_URL
    while (url) {
      const res = await fetch(url)
      if (!res.ok) {
        started = false
        return
      }
      const data: any = await res.json()
      for (const s of data.results ?? []) {
        const code = s.code ?? s.language_code
        if (code) map[code] = Math.round(s.translated_percent ?? 0)
      }
      url = data.next ?? null
    }
    completeness.value = map
  } catch {
    started = false
  }
}
