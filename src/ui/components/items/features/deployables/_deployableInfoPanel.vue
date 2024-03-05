<template>
  <v-alert variant="outlined" density="compact" color="primary" class="pb-0 ma-1">
    <div class="text-text">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon size="large" color="stark" icon="cc:drone" />
        </v-col>
        <v-col cols="auto">
          <span class="heading h2">{{ deployable.Name }}</span>
          <span v-if="deployable.Type" class="heading h3 text-disabled">
            <cc-slashes class="pl-1" />
            {{ deployable.Type }}
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-chip slot="title-items" size="small" class="stat-text pr-0 mb-2" label>
            DEPLOY&nbsp;
            <v-chip label class="text-uppercase">
              {{ activation }}
            </v-chip>
          </v-chip>
        </v-col>
      </v-row>
      <deployable-info-base :deployable="deployable" :tier="tier" />
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
