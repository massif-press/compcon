<template>
  <div>
    <router-link to="/pilot_management">
      <v-btn variant="text" color="white" tile>Pilot Roster</v-btn>
    </router-link>
    <v-divider v-if="pilot" vertical dark class="ml-2 mr-2" />
    <v-menu v-if="pilot" nudge-bottom="35px" open-on-hover>
      <template #activator="{ props }">
        <v-btn light tile color="white" elevation="0" v-bind="props">
          {{ pilot.Callsign }}
          <v-icon light>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader>
        <v-list-item
          @click="pilotSheet()"
          prepend-icon="cc:pilot"
          tile="Pilot Sheet"
          text="View, edit, and update this pilot's information"
        />
        <v-list-item
          @click="mechHangar()"
          prepend-icon="cc:frame"
          tile="Mech Hangar"
          text="Build mechs and manage this pilot's library of mech configurations"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: 'pilot-nav-mode',
  props: {
    pilot: { type: Object, required: true },
  },
  methods: {
    pilotSheet() {
      this.$router.push({ name: 'pilot_sheet' });
    },
    mechHangar() {
      this.$router.push({ name: 'mech_hangar' });
    },
  },
};
</script>
