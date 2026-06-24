<template>
  <v-menu :open-on-hover="!mobile"
    offset-y
    max-width="600px">
    <template #activator="{ props }">
      <v-chip label
        tile
        :color="licenseRequirement.missing ? 'warning' : 'success'"
        class="ma-1"
        v-bind="props">
        <span v-if="licenseRequirement.source === 'GMS'">
          <v-icon start
            size="large"
            icon="cc:gms" />
          GMS
        </span>
        <span v-else>
          <v-icon start
            :icon="`cc:rank_${licenseRequirement.rank}`" />
          {{ licenseRequirement.source }} {{ licenseRequirement.name }} {{
            'I'.repeat(licenseRequirement.rank) }}
        </span>
      </v-chip>
    </template>

    <v-card flat
      tile
      border>
      <v-toolbar v-if="licenseRequirement.missing"
        color="error"
        class="px-2 heading h3"
        height="32">
        {{ $t('pm.sheet.warningLICENSEMISSING') }}
      </v-toolbar>
      <v-card-text class="pa-2 text-text">
        <b v-if="licenseRequirement.source === 'GMS'">{{ $t('pm.sheet.gmsSTANDARDPILOTSLICENSE') }}</b>
        <b v-else>{{ licenseRequirement.name }} {{ $t('common.rank') }} {{ licenseRequirement.rank }}</b>
        <v-divider class="my-1" />
        <div class="text-cc-overline text-disabled">{{ $t('pm.sheet.requiredFor') }}:</div>
        <cc-chip v-for="(item, index) in licenseRequirement.items"
          :key="`item-${index}`"
          size="small"
          class="ma-1">{{ item }}</cc-chip>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { ILicenseRequirement } from '@/classes/pilot/components/license/LicensedItem'

defineProps<{
  licenseRequirement: ILicenseRequirement
}>()

const { smAndDown: mobile, xs: portrait } = useDisplay()
</script>
