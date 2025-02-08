<template>
  <cc-dialog :color="deployable.Color" :icon="`cc:${deployable.Icon}`" :title="deployable.Name">
    <template #activator="{ open }">
      <v-icon start>cc:drone</v-icon>
      {{ deployable.Name }}
    </template>

    <template #title>
      <v-icon start large dark>cc:drone</v-icon>
      {{ deployable.Name }}
    </template>
    <template #title-items>
      <v-chip slot="title-items" size="small" class="stat-text pr-0 mb-2" label>
        DEPLOY&nbsp;
        <v-chip label class="text-uppercase">
          {{ activation }}
        </v-chip>
      </v-chip>
    </template>
    <deployable-info-base :deployable="deployable" :tier="tier" />
  </cc-dialog>
</template>

<script lang="ts">
import deployableInfoBase from './_deployableInfoBase.vue';

export default {
  name: 'deployable-popup',
  components: { deployableInfoBase },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    activation() {
      return this.deployable.Activation ? this.deployable.Activation.toLowerCase() : 'Quick';
    },
  },
};
</script>
