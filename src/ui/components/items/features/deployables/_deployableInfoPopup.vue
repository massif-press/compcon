<template>
  <cc-dialog :color="deployable.Color" :icon="deployable.Icon" :title="deployable.Name">
    <template #activator="{ open }">
      <cc-button
        size="small"
        :color="deployable.Color"
        :prepend-icon="deployable.Icon"
        class="ma-1 d-inline-block"
        @click="open">
        {{ deployable.Name }}
      </cc-button>
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
