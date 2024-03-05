<template>
  <cc-dialog no-dismiss :color="action.Color" large>
    <template #button>
      <span class="text-white" style="width: 100%">
        <v-icon dark>{{ action.Icon }}</v-icon>
        {{ action.Name }}
      </span>
    </template>

    <template #title>
      <v-icon start size="large">{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </template>
    <template #title-items>
      <v-chip class="stat-text mt-4 mr-6" variant="outlined" label>
        {{ action.Frequency.ToString() }}
      </v-chip>
    </template>

    <action-base :action="action" :tier="tier" />
  </cc-dialog>
</template>

<script lang="ts">
import ActionBase from './_actionBase.vue';

export default {
  name: 'action-popup',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
