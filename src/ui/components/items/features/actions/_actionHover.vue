<template>
  <v-menu :open-on-hover="!mobile"
    :open-on-click="mobile"
    bottom
    offset-y
    max-width="700px">
    <template #activator="{ props }">
      <cc-chip :bg-color="action.Color"
        v-bind="props"
        variant="flat"
        tile
        class="chip-interactive"
        size="small">
        <span>
          <v-icon start
            dark>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </span>
      </cc-chip>
    </template>
    <v-card flat
      tile
      border>
      <v-toolbar density="compact"
        :color="action.Color"
        height="44">
        <v-icon v-if="!hideIcon"
          dark
          class="mx-2">{{ action.Icon }}</v-icon>
        <span class="heading h3 pr-6">{{ action.Name }}</span>
        <v-spacer />
        <v-chip v-if="!action.Frequency.Unlimited"
          class="text-caption"
          label
          tile>
          {{ action.Frequency.ToString() }}
        </v-chip>
      </v-toolbar>
      <div class="px-2 pt-1 pb-2">
        <action-base :action="action"
          :tier="tier" />
      </div>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import ActionBase from './_actionBase.vue'
import { Action } from '@/classes/Action';

const { smAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  action: Action
  tier?: number
  hideIcon?: boolean
}>(), {
  hideIcon: false,
})
</script>

<style scoped>
.chip-interactive {
  clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
  cursor: pointer;
}
</style>
