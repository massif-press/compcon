<template>
  <div>
    <v-card flat color="background">
      <v-list>
        <downtime-menu-item
          v-for="(a, i) in pilot.State.DowntimeActions"
          :action="a"
          available
          :pilot="pilot"
        />
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import DowntimeMenuItem from './DowntimeMenuItem.vue';

export default {
  name: 'downtime-action-menu',
  components: { DowntimeMenuItem },
  props: {
    tab: { type: Number, required: true, default: 1 },
  },
};
</script>
