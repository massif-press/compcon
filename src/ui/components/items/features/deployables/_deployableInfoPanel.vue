<template>
  <v-alert variant="outlined" density="compact" color="primary" class="pb-0 ma-1">
    <div class="text-text">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon size="large" color="stark" icon="cc:drone" />
        </v-col>
        <v-col cols="auto">
          <span class="heading h2">{{ deployable.name }}</span>
          <span v-if="deployable.type" class="heading h3 text-subtle">
            <cc-slashes class="pl-1" />
            {{ deployable.type }}
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-chip
            slot="title-items"
            color="stark"
            small
            class="stat-text mr-2 pr-0"
            variant="outlined"
            label
          >
            DEPLOY&nbsp;
            <v-chip small label dark :color="`action--${activation}`" class="text-uppercase">
              {{ activation }}
            </v-chip>
          </v-chip>
        </v-col>
      </v-row>
      <deployable-info-base :deployable="deployable" />
    </div>
  </v-alert>
</template>

<script lang="ts">
import deployableInfoBase from './_deployableInfoBase.vue';

export default {
  name: 'deployable-info-panel',
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
