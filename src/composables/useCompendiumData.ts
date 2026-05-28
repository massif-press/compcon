import { storeToRefs } from 'pinia'
import { CompendiumStore } from '@/features/compendium/store'

export function useCompendiumData() {
  return storeToRefs(CompendiumStore())
}
