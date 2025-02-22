<template>
  <v-menu :open-on-hover="!mobile" offset-y max-width="600px">
    <template #activator="{ props }">
      <v-chip
        slot="activator"
        label
        tile
        :color="license.missing ? 'warning' : 'success'"
        class="ma-1"
        @click="props.onClick($event)">
        <span v-if="license.source === 'GMS'">
          <v-icon start size="large" icon="cc:gms" />
          GMS
        </span>
        <span v-else>
          <v-icon start :icon="`cc:rank_${license.rank}`" />
          {{ license.source }} {{ license.name }} {{ 'I'.repeat(license.rank) }}
        </span>
      </v-chip>
    </template>

    <v-card>
      <v-card-title v-if="license.missing" class="bg-error font-weight-bolder py-1 my-0">
        WARNING: LICENSE MISSING&emsp;
      </v-card-title>
      <v-card-text class="pa-2 text-text">
        <b v-if="license.source === 'GMS'">GMS STANDARD PILOT'S LICENSE</b>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
