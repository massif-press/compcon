<template>
  <v-container fluid>
    <v-row justify="space-around" align="center">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div
          class="font-weight-light text-center my-n2"
          style="letter-spacing: calc(5px + 2cqw); font-size: calc(20px + 2cqw)">
          ACTIVE MODE
        </div>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row class="mt-1" :class="!mobile && 'px-5'" justify="space-around">
      <v-col v-for="(list, i) in lists" cols="12" lg="">
        <v-card variant="tonal" height="100%" :class="!mobile && 'px-6'" flat tile>
          <v-list lines="two" height="100%" class="pt-0" flat tile>
            <v-list-item class="text-center">
              <v-icon :icon="headers[i].icon" size="20vw" />
              <v-list-item-title class="heading h2 text-accent" v-text="headers[i].title" />
            </v-list-item>
            <v-list-item
              v-for="e in list"
              :key="e.title"
              :title="e.title"
              class="bg-primary my-1"
              :subtitle="e.subtitle"
              :to="e.to">
              <template #prepend>
                <v-avatar>
                  <v-icon size="x-large" :icon="e.icon" />
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'home',
  data: () => ({
    headers: [
      {
        icon: 'cc:lancer',
        title: 'LANCER',
      },
      {
        icon: 'cc:nhp',
        title: 'GAME MASTER',
      },
      {
        icon: 'cc:diasporan',
        title: 'OBSERVER',
      },
    ],
    lists: [
      [
        {
          title: 'Start an Active Character Sheet',
          subtitle:
            'Create an instance of a Pilot and their active Mech, for use in tables and encounters',
          icon: 'cc:pilot',
          to: '/active-mode/new-character-sheet',
        },
        {
          title: 'Manage Active Character Sheets',
          subtitle: 'Open, edit, and delete active character sheets',
          icon: 'mdi-book-open',
          to: '/active-mode/character-sheets',
        },
        {
          title: 'Join an Online Table',
          subtitle:
            'Join a online realtime Lancer table to play with friends online, or resume an active game',
          icon: 'cc:squad',
          to: '/active-mode/join-table',
        },
      ],
      [
        {
          title: 'Begin a New Encounter',
          subtitle: 'Configure and run an Encounter',
          icon: 'cc:encounter',
          to: '/active-mode/new-encounter',
        },
        {
          title: 'Manage Active Encounters',
          subtitle: 'Open, edit, and delete active encounters',
          icon: 'mdi-motion-play-outline',
          to: '/active-mode/encounters',
        },
        {
          title: 'Create a Table',
          subtitle: 'Create a table for long-term online, offline or asynchronous Lancer games',
          icon: 'mdi-plus-network-outline',
          to: '/active-mode/new-table',
        },
        {
          title: 'Manage Active Tables',
          subtitle: 'Open, edit, and delete active tables',
          icon: 'mdi-lan',
          to: '/active-mode/tables',
        },
      ],
      [
        {
          title: 'Spectator Mode',
          subtitle: 'Run a non-interactive spectator display for a realtime Lancer game',
          icon: 'mdi-monitor-share',
          to: '/active-mode/spectate',
        },
        {
          title: 'Campaign Display',
          subtitle: 'Run an interactive GM display for an active campaign',
          icon: 'mdi-monitor-dashboard',
          to: '/active-mode/campaign',
        },
      ],
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
