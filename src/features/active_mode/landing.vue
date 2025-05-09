<template>
  <cc-solo-dialog v-model="dialog" title="development preview">
    <cc-alert prominent icon="mdi-alert">
      Active mode is a currently a
      <b class="text-error">non functional</b>
      development preview of the v3 active mode. It is not able to be used for any real game play,
      and is not a replacement for the v2 active mode. To follow the development of this feature,
      please check out the
      <a href="https://www.patreon.com/c/compcon" target="_blank">
        public devlogs on the COMP/CON Patreon
      </a>
      .
    </cc-alert>
  </cc-solo-dialog>
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
          <v-list height="100%" class="pt-0" flat tile>
            <v-list-item class="text-center">
              <v-icon :icon="headers[i].icon" size="20vw" />
              <v-list-item-title class="heading h2 text-accent" v-text="headers[i].title" />
            </v-list-item>
            <div v-for="e in list">
              <v-list-item
                v-if="!e.small"
                lines="two"
                :key="e.title"
                :title="e.title"
                density="compact"
                class="my-1 bg-primary"
                :subtitle="e.subtitle"
                disabled
                :to="e.to">
                <template #prepend>
                  <v-avatar>
                    <v-icon size="x-large" :icon="e.icon" />
                  </v-avatar>
                </template>
              </v-list-item>
              <div v-else>
                <v-btn
                  block
                  size="small"
                  tile
                  flat
                  color="gray"
                  disabled
                  :prepend-icon="e.icon"
                  :to="e.to"
                  class="my-1">
                  {{ e.subtitle }}
                </v-btn>
              </div>
            </div>
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
    dialog: true,
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
          title: 'Active Character Sheets',
          subtitle: 'Create, manage, and run active Player Character sheets for your Lancer games',
          icon: 'cc:pilot',
          to: 'active-mode/sheet-manager',
        },
        {
          small: true,
          subtitle: 'resume last',
          icon: 'mdi-restart',
          to: '',
        },
        {
          title: 'Join an Online Table',
          subtitle: 'Join a online realtime Lancer table or resume an active game',
          icon: 'cc:squad',
          to: '/active-mode/join-table',
        },
      ],
      [
        {
          title: 'Local Encounters',
          subtitle: 'Create, manage, and run local Encounters for your Lancer games',
          icon: 'cc:encounter',
          to: '/active-mode/encounter-manager',
        },
        {
          small: true,
          subtitle: 'resume last',
          icon: 'mdi-restart',
          to: '',
        },
        {
          title: 'Active Tables',
          subtitle: 'Create, manage, and run Lancer tables for long-term online or offline  games',
          icon: 'mdi-lan',
          to: '/active-mode/manage-tables',
        },
      ],
      [
        {
          title: 'Spectator Mode',
          subtitle: 'Connect to a non-interactive spectator display for a realtime Lancer game',
          icon: 'mdi-monitor-share',
          to: '/active-mode/spectate',
        },
        {
          small: true,
          subtitle: 'resume last',
          icon: 'mdi-restart',
          to: '',
        },
        {
          title: 'Campaign Display',
          subtitle: 'Connect to an non-interactive GM display for an active campaign',
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
