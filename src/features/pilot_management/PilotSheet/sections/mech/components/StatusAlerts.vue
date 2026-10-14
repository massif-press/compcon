<template>
  <div v-if="statuses.length">
    <cc-alert
      v-for="(status, index) in statuses"
      :key="`status-${index}`"
      class="mb-2"
      :color="status.color"
      :icon="status.icon"
      :title="status.title"
    >
      <p v-text="status.text" />
    </cc-alert>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Mech } from '@/classes/mech/Mech'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  defineOptions({ name: 'status-alerts' })

  const props = defineProps<{ mech: any }>()

  type StatusAlert = { title: string; text: string; icon: string; color: string }

  const statuses = computed((): StatusAlert[] => {
    const m = props.mech as Mech
    const out: StatusAlert[] = []
    if (m.FreeSP < 0)
      out.push({
        title: t('pm.statusAlerts.systemCapacityExceeded'),
        text: t('pm.statusAlerts.loadoutConfigurationExceedsAvailableFrameSyste'),
        icon: 'mdi-alert',
        color: 'error',
      })
    if (m.FreeSP > 0)
      out.push({
        title: t('pm.statusAlerts.systemCapacityRemaining'),
        text: t('pm.statusAlerts.operationalCapacitySignificantlyImpaired'),
        icon: 'mdi-alert-decagram-outline',
        color: 'warning',
      })
    if (m.MechLoadoutController.ActiveLoadout.HasEmptyMounts)
      out.push({
        title: t('pm.statusAlerts.emptyMountsDetected'),
        text: t('pm.statusAlerts.operationalCapacitySignificantlyImpaired'),
        icon: 'mdi-alert-decagram-outline',
        color: 'warning',
      })
    if (m.RequiredLicenses.filter((x: any) => x.missing).length)
      out.push({
        title: t('pm.statusAlerts.unlicensedEquipmentDetected'),
        text: t('pm.statusAlerts.missingLicensesWarning'),
        icon: 'mdi-alert',
        color: 'warning',
      })
    if (!m.HasCompatibleMods())
      out.push({
        title: t('pm.statusAlerts.incompatibleWeaponMod'),
        text: t('pm.statusAlerts.incompatibleModsWarning'),
        icon: 'mdi-cancel',
        color: 'warning',
      })
    return out
  })
</script>
