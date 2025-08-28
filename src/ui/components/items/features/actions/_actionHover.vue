<template>
  <v-menu :open-on-hover="!mobile" :open-on-click="mobile" bottom offset-y max-width="700px">
    <template #activator="{ props }">
      <cc-chip
        :bg-color="action.Color"
        v-bind="props"
        variant="flat"
        tile
        class="chip-interactive"
        size="small">
        <span>
          <v-icon start dark>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </span>
      </cc-chip>
    </template>
    <v-card flat tile border>
      <v-toolbar density="compact" :color="action.Color" height="44">
        <v-icon v-if="!hideIcon" dark class="mx-2">{{ action.Icon }}</v-icon>
        <span class="heading h3 pr-6">{{ action.Name }}</span>
        <v-spacer />
        <v-chip v-if="!action.Frequency.Unlimited" class="text-caption" label tile>
          {{ action.Frequency.ToString() }}
        </v-chip>
      </v-toolbar>
      <div class="px-2 pt-1 pb-2">
        <action-base :action="action" :tier="tier" />
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import ActionBase from './_actionBase.vue';

export default {
  name: 'action-hover',
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
    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.chip-interactive {
  clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
  cursor: pointer;
}
</style>
