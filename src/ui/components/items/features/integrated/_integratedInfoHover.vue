<template>
  <v-menu open-on-hover bottom offset-y>
    <template v-slot:activator="{ props }">
      <v-chip :color="item.Color" v-bind="props">
        <span class="text-white">
          <v-icon start dark>{{ item.Icon }}</v-icon>
          {{ item.Name }}
        </span>
      </v-chip>
    </template>
    <v-card flat tile>
      <v-toolbar density="compact" flat :color="item.Color" class="text-white">
        <v-icon start large dark>{{ item.Icon }}</v-icon>
        <span class="heading h3">{{ item.Name }}</span>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <integrated-info-base :item="item" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import integratedInfoBase from './_integratedInfoBase.vue';

export default {
  name: 'integrated-info-hover',
  components: { integratedInfoBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
