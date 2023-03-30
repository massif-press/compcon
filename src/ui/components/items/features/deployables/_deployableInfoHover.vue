<template>
  <v-menu open-on-hover bottom offset-y>
    <template v-slot:activator="{ props }">
      <v-chip :color="deployable.Color" v-bind="props">
        <span class="text-white">
          <v-icon start dark>{{ deployable.Icon }}</v-icon>
          {{ deployable.Name }}
        </span>
      </v-chip>
    </template>
    <v-card flat tile>
      <v-toolbar
        density="compact"
        flat
        :color="deployable.Color"
        class="text-white"
      >
        <v-icon start large dark>{{ deployable.Icon }}</v-icon>
        <span class="heading h3">{{ deployable.Name }}</span>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <deployable-info-base :action="action" />
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
  },
};
</script>
