<template>
  <div v-if="item && !item.NoSynergies"
    :class="inline ? 'd-inline-block' : ''">
    <div v-if="alert">
      <div v-for="(s, index) in synergies"
        :key="`synergy-${index}`"
        style="position: relative">
        <cc-alert variant="outlined"
          border-color="primary"
          color="text"
          icon="cc:talent"
          class="my-1"
          density="compact">
          <p v-html-safe="s.Detail" />
        </cc-alert>
        <div style="position: absolute; right: -5px; bottom: -4px"
          class="fade-select">
          <cc-tooltip max-width="300"
            icon="mdi-alert-outline"
            size="16"
            color="warning"
            location="top">
            <i18n-t keypath="pm.loadout.synergyWarning" tag="span" scope="global">
              <template #not>
                <strong class="text-accent"><u>{{ $t('pm.loadout.not') }}</u></strong>
              </template>
            </i18n-t>
          </cc-tooltip>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!synergies.length && showNone"
        class="text-center"
        style="opacity: 0.5">
        <i>{{ $t('pm.loadout.none') }}</i>
      </div>
      <cc-tooltip v-for="(s, index) in synergies"
        :key="`synergy-${index}`"
        max-width="350"
        location="top"
        :size="small ? 'small' : large ? 'large' : ''"
        color="accent"
        icon="cc:talent">
        <div class="heading h5"
          v-text="s.Origin" />
        <v-divider />
        <p v-html-safe="s.Detail"
          class="py-2" />
      </cc-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Mech } from '@/classes/mech/Mech'
import { Synergy } from '@/classes/components/feature/synergy/Synergy'
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';

const props = defineProps<{
  item?: MechEquipment
  mech: Mech
  location: string
  large?: boolean
  small?: boolean
  inline?: boolean
  showNone?: boolean
  alert?: boolean
}>()


const synergies = computed(() => { return Synergy.Collect(props.location, props.mech as Mech, props.item); })
</script>
