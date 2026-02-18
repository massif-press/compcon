<template>
  <v-container>
    <v-card>
      <v-card-title>encounter</v-card-title>
      <p>tabs: pilot - mech</p>
      <p>show encounter details, actions, etc</p>
    </v-card>
  </v-container>

</template>

<script lang="ts">
import { PilotStore } from '@/stores';

export default {
  name: 'pilot-runner',
  props: {
    id: String,
  },
  data: () => ({
    showNav: true,
  }),
  computed: {
    async sheet() {
      console.log(await PilotStore().GetActiveSheet(
        this.id || this.$route.params.id || PilotStore().CurrentActiveID
      ))
      return await PilotStore().GetActiveSheet(
        this.id || this.$route.params.id || PilotStore().CurrentActiveID
      );
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
