<template>
  <v-menu :open-on-hover="!mobile" :open-on-click="mobile" bottom offset-y max-width="700px">
    <template #activator="{ props }">
      <cc-chip
        :bg-color="deployable.Color"
        v-bind="props"
        variant="flat"
        tile
        class="chip-interactive"
        size="small">
        <span class="text-white">
          <v-icon start dark>{{ deployable.Icon }}</v-icon>
          {{ deployable.Name }}
        </span>
      </cc-chip>
    </template>
    <v-card flat tile>
      <v-toolbar density="compact" flat :color="deployable.Color" class="text-white">
        <v-toolbar-title>
          <v-icon start large dark>{{ deployable.Icon }}</v-icon>
          <span class="heading h3">{{ deployable.Name }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <deployable-info-base :deployable="deployable" :tier="tier" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import deployableInfoBase from './_deployableInfoBase.vue';

export default {
  name: 'action-hover',
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
