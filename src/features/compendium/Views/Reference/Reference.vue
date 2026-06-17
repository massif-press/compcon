<template>
  <div
    style="position: absolute; top: 0; left: 0; right: 0; height: 45px"
    class="bg-primary"
  />
  <cc-tabs fixed-tabs>
    <template #tabs>
      <v-tab>{{ $t('common.actions') }}</v-tab>
      <v-tab>{{ $t('compendium.categories.statusesConditions') }}</v-tab>
      <v-tab>{{ $t('compendium.reference.iconGuide') }}</v-tab>
      <v-tab>{{ $t('compendium.reference.damageTables') }}</v-tab>
    </template>
    <v-window-item>
      <action-economy />
      <actions :is-modal="isModal" />
    </v-window-item>
    <v-window-item>
      <statuses :is-modal="isModal" />
    </v-window-item>
    <v-window-item>
      <icon-guide :is-modal="isModal" />
    </v-window-item>
    <v-window-item>
      <damage-tables :is-modal="isModal" />
    </v-window-item>
  </cc-tabs>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ActionEconomy from './qr_pages/ActionEconomy.vue'
import Actions from './qr_pages/Actions.vue'
import DamageTables from './qr_pages/DamageTables.vue'
import IconGuide from './qr_pages/IconGuide.vue'
import Statuses from './qr_pages/Statuses.vue'

const props = withDefaults(defineProps<{
  isModal?: boolean
  preScroll?: string
}>(), {
  preScroll: ''
})

onMounted(() => {
if (props.preScroll) {
        _nextTick(() => {
          const el = document.getElementById(props.preScroll)
          if (el) {
            el.scrollIntoView()
          }
        })
      }
})
</script>
