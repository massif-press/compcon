<template>
  <cc-dialog :color="deployable.Color"
    :icon="deployable.Icon"
    :title="deployable.Name">
    <template #activator="{ open }">
      <cc-button size="small"
        :color="deployable.Color"
        :prepend-icon="deployable.Icon"
        class="ma-1 d-inline-block"
        @click="open">
        {{ deployable.Name }}
      </cc-button>
    </template>

    <template #title>
      <v-icon start
        large
        dark>cc:drone</v-icon>
      {{ deployable.Name }}
    </template>
    <template #title-items>
      <v-chip size="small"
        class="stat-text pr-0 mb-2"
        label>
        DEPLOY&nbsp;
        <v-chip label
          class="text-uppercase">
          {{ activation }}
        </v-chip>
      </v-chip>
    </template>

    <deployable-info-base :deployable="deployable"
      :tier="tier"
      :owner="owner" />
  </cc-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DeployableInfoBase from './_deployableInfoBase.vue'
import { Deployable } from '@/classes/components/feature/deployable/Deployable';

const props = withDefaults(defineProps<{
  deployable: Deployable
  tier?: number
  owner?: object | null
}>(), {
  owner: null,
})

const activation = computed(() => {
  return props.deployable.Activation ? props.deployable.Activation.toLowerCase() : 'Quick';
})
</script>
