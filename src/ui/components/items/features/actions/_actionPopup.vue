<template>
  <cc-dialog no-dismiss :color="action.Color" large>
    <span slot="button" class="text-white" style="width: 100%">
      <v-icon dark>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </span>

    <span slot="title">
      <v-icon start size="large">{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </span>
    <v-chip slot="title-items" class="stat-text mt-4 mr-6" variant="outlined" label>
      {{ action.Frequency.ToString() }}
    </v-chip>

    <action-base :action="action" />
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
  },
};
</script>
