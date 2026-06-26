<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <div class="text-text">
        <p
          v-if="item.Description"
          v-html-safe="item.Description"
          class="card-effect pa-2 mb-1 text-text"
          style="font-size: 15px" />
        <p
          v-if="item.Detail"
          v-html-safe="item.Detail"
          class="card-effect pa-2 mb-1 text-text"
          style="font-size: 15px" />
        <div>
          <v-row
            v-if="item.Damage || item.Range"
            no-gutters
            justify="space-around"
            align="center"
            style="max-height: 200px; min-height: 50px">
            <v-col v-if="item.Damage" cols="auto">
              <cc-damage-element :damage="item.Damage" />
            </v-col>
            <v-col v-if="item.Range" cols="auto">
              <cc-range-element :range="item.Range" />
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </c-card-base>
</template>

<script setup lang="ts">
import type { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon'
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'gear-card-content' })

const props = defineProps<{
  item: PilotWeapon
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
}
</style>
