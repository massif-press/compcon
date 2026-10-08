<template>
  <div v-if="mobile"
    class="text-cc-overline text-disabled">
    {{ $t('active.panelBase.cover') }}
  </div>
  <v-btn-toggle v-model="controller.Cover"
    flat
    tile
    mandatory
    color="primary"
    style="height: 30px">
    <v-btn size="small"
      height="30"
      value="none">
      {{ mobile ? $t('common.none') : $t('active.panelBase.noCover') }}
    </v-btn>
    <v-btn size="small"
      height="30"
      value="soft">
      {{ mobile ? $t('active.panelBase.soft') : $t('active.panelBase.softCover') }}
    </v-btn>
    <v-btn size="small"
      height="30"
      value="hard">
      {{ mobile ? $t('active.panelBase.hard') : $t('active.panelBase.hardCover') }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { CombatController } from '@/classes/components/combat/CombatController'

defineOptions({ name: 'CoverToggle' })

defineProps<{ controller: CombatController }>()

const { mdAndDown: mobile } = useDisplay()
</script>
