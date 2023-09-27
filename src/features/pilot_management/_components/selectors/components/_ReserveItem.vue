<template>
  <cc-titled-panel :title="reserve.Name" :icon="icon" :color="color">
    <v-row style="min-height: 70px" align="center">
      <v-col cols="auto">
        <cc-tooltip simple content="Add Reserve">
          <v-btn icon variant="plain" color="accent" class="mt-n4" @click="$emit('click')">
            <v-icon size="60">mdi-plus</v-icon>
          </v-btn>
        </cc-tooltip>
      </v-col>
      <v-col>
        <div v-html-safe="reserve.Description" class="flavor-text text-text" />
      </v-col>
    </v-row>
  </cc-titled-panel>
</template>

<script lang="ts">
export default {
  name: 'reserve-item',
  emits: ['click'],
  props: {
    reserve: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
    icon: {
      type: String,
      required: false,
      default: 'cc:barrage',
    },
  },
};
</script>
