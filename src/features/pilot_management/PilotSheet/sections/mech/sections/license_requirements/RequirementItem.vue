<template>
  <v-menu open-on-hover offset-y>
    <template #activator="{ props }">
      <v-chip
        slot="activator"
        label
        :outlined="!license.missing"
        :dark="license.missing"
        :color="license.missing ? 'deep-orange darken-4' : 'success darken-2'"
        class="ma-1"
        v-bind="props"
      >
        <span v-if="license.name === 'GMS'"> <v-icon start icon="mdi-check" /> GMS </span>
        <span v-else>
          <v-icon start :icon="`cc:rank_${license.rank}`" />
          {{ license.source }} {{ license.name }} {{ 'I'.repeat(license.rank) }}
        </span>
      </v-chip>
    </template>

    <v-card width="40vw">
      <v-card-title v-if="license.missing" class="error text-white font-weight-bolder py-1 my-0">
        WARNING: LICENSE MISSING&emsp;
      </v-card-title>
      <v-card-text class="pa-2 text-text">
        <b v-if="license.name === 'GMS'">GMS STANDARD PILOT'S LICENSE</b>
        <b v-else>{{ license.name }} RANK {{ license.rank }}</b>
        <v-divider class="my-1" />
        <i>Required for:&nbsp;</i>
        {{ license.items.join(', ') }}
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'requirement-item',
  props: {
    license: {
      type: Object,
      required: true,
    },
  },
};
</script>
