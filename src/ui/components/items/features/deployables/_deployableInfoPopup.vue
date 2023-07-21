<template>
  <cc-dialog no-dismiss large>
    <template #button>
      <span class="text-white" style="width: 100%">
        <v-icon dark>cc:drone</v-icon>
        {{ deployable.name }}
      </span>
    </template>

    <template #title>
      <v-icon start large dark>cc:drone</v-icon>
      {{ deployable.name }}
    </template>
    <template #title-items>
      <v-chip class="mr-2 pr-0" variant="outlined" label>
        DEPLOY&emsp;
        <v-chip label variant="elevated" :color="`action--${activation.toLowerCase()}`">
          {{ activation.toUpperCase() }}
        </v-chip>
      </v-chip>
    </template>
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
      return this.deployable.activation ? this.deployable.activation.toLowerCase() : 'quick';
    },
  },
};
</script>
