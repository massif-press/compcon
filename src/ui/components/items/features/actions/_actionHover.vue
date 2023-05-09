<template>
  <v-menu open-on-hover bottom offset-y max-width="700px">
    <template #activator="{ props }">
      <v-chip :color="action.Color" v-bind="props">
        <span>
          <v-icon start dark>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </span>
      </v-chip>
    </template>
    <v-card flat tile>
      <v-toolbar density="compact" :color="action.Color" class="text-white">
        <v-icon size="40" dark class="mx-2">{{ action.Icon }}</v-icon>
        <span class="heading h3">{{ action.Name }}</span>
        <v-spacer />
        <v-chip
          v-if="!action.Frequency.Unlimited"
          slot="title-items"
          color="white"
          class="stat-text mt-4 mr-6"
          variant="outlined"
          label
        >
          {{ action.Frequency.ToString() }}
        </v-chip>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <action-base :action="action" />
      </v-card-text>
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
  },
};
</script>
