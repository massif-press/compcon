<template>
  <div v-if="statuses.length">
    <cc-alert v-for="(status, index) in statuses"
      :key="`status-${index}`"
      class="mb-2"
      :color="status.color"
      :icon="status.icon"
      :title="status.title">
      <p v-text="status.text" />
    </cc-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Mech } from '@/classes/mech/Mech'

defineOptions({ name: 'status-alerts' })

const props = defineProps<{ mech: any }>()

type StatusAlert = { title: string; text: string; icon: string; color: string }

const statuses = computed((): StatusAlert[] => {
  const m = props.mech as Mech
  const out: StatusAlert[] = []
  if (m.FreeSP < 0)
    out.push({ title: 'SYSTEM CAPACITY EXCEEDED', text: 'Loadout configuration exceeds available Frame System Capacity', icon: 'mdi-alert', color: 'error' })
  if (m.FreeSP > 0)
    out.push({ title: 'SYSTEM CAPACITY REMAINING', text: 'Operational capacity significantly impaired', icon: 'mdi-alert-decagram-outline', color: 'warning' })
  if (m.MechLoadoutController.ActiveLoadout.HasEmptyMounts)
    out.push({ title: 'EMPTY MOUNTS DETECTED', text: 'Operational capacity significantly impaired', icon: 'mdi-alert-decagram-outline', color: 'warning' })
  if (m.RequiredLicenses.filter((x: any) => x.missing).length)
    out.push({ title: 'UNLICENSED EQUIPMENT DETECTED', text: 'Pilot is missing one or more licenses required to legally print or operate this configuration', icon: 'mdi-alert', color: 'warning' })
  if (!m.HasCompatibleMods())
    out.push({ title: 'INCOMPATIBLE WEAPON MOD', text: 'One or more weapon mods are installed to incompatible weapons', icon: 'mdi-cancel', color: 'warning' })
  return out
})
</script>
