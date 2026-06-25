import { ref } from 'vue'
import baked from './completeness.json'

// at or above this translated percent a locale is treated as reviewed
export const QUALITY_THRESHOLD = 90

export const TRANSLATION_COMPONENTS = ['ui', 'lancer-data', 'lancer-srd'] as const

export const completeness = ref<Record<string, Record<string, number>>>(baked)

export async function fetchCompleteness(): Promise<void> {
  // no op
}
