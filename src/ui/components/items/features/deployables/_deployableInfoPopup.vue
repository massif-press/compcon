<template>
  <cc-dialog no-dismiss large>
    <template #button>
      <span class="text-white" style="width: 100%">
        <v-icon dark>cc:drone</v-icon>
        {{ deployable.Name }}
      </span>
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
      return this.deployable.Activation ? this.deployable.Activation.toLowerCase() : 'Quick';
    },
  },
};
</script>
