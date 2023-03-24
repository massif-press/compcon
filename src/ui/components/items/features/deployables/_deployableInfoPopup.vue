<template>
  <cc-dialog no-dismiss large>
    <span slot="button" class="white--text" style="width: 100%">
      <v-icon dark>cc:drone</v-icon>
      {{ deployable.name }}
    </span>

    <span slot="title">
      <v-icon start large dark>cc:drone</v-icon>
      {{ deployable.name }}
    </span>
    <v-chip
      slot="title-items"
      dark
      small
      class="stat-text mr-2 pr-0 mt-4"
      variant="outlined"
      label
    >
      DEPLOY&nbsp;
      <v-chip small label dark :color="`action--${activation.toLowerCase()}`">
        {{ activation.toUpperCase() }}
      </v-chip>
    </v-chip>
    <deployable-info-base :deployable="deployable" />
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
  },
  computed: {
    activation() {
      return this.deployable.activation
        ? this.deployable.activation.toLowerCase()
        : 'quick';
    },
  },
};
</script>
