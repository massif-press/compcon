<template>
  <v-menu :open-on-hover="!mobile"
    :open-on-click="mobile"
    bottom
    offset-y
    max-width="700px">
    <template #activator="{ props }">
      <cc-chip :bg-color="deployable.Color"
        v-bind="props"
        variant="flat"
        tile
        class="chip-interactive"
        size="small">
        <span class="text-white">
          <v-icon start
            dark>{{ deployable.Icon }}</v-icon>
          {{ deployable.Name }}
        </span>
      </cc-chip>
    </template>
    <v-card flat
      tile>
      <v-toolbar density="compact"
        flat
        :color="deployable.Color"
        class="text-white">
        <v-toolbar-title>
          <v-icon start
            large
            dark>{{ deployable.Icon }}</v-icon>
          <span class="heading h3">{{ deployable.Name }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <deployable-info-base :deployable="deployable"
          :tier="tier"
          :owner="owner" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import DeployableInfoBase from './_deployableInfoBase.vue'
import { useDisplay } from 'vuetify'

const { smAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  deployable: Deployable
  tier?: number
  owner?: object | null
}>(), {
  owner: null,
})
</script>
