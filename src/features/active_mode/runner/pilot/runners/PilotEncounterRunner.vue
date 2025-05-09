<template>
  <div style="overflow-y: hidden">
    <v-layout :style="`height: calc(100vh - ${mobile ? '42px' : '64px'})`">
      <div
        style="position: absolute; z-index: 999"
        :style="`left: ${showNav ? (mobile ? '222' : '252') : '3'}px; top: 12px`">
        <cc-button
          :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          size="small"
          color="primary"
          @click="(showNav as any) = !showNav" />
      </div>
      <v-navigation-drawer v-model="showNav" :width="mobile ? 220 : 250">
        <v-list>
          <v-list-item>pilot</v-list-item>
          <v-list-item>mech</v-list-item>
          <v-list-item>deployable</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main :class="showNav && 'ml-6'">
        <v-container>
          <v-card>
            <v-card-title>encounter</v-card-title>
            <p>tabs: pilot - mech</p>
            <p>show encounter details, actions, etc</p>
          </v-card>
        </v-container>
      </v-main>
      <v-footer app>footer content</v-footer>
    </v-layout>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PilotEncounterRunner',
  data: () => ({
    showNav: true,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
