<template>
  <cc-alert
    prominent
    icon="mdi-alert"
    title="Active Mode Development Preview"
    class="ma-4"
    color="warning">
    Active mode is a currently a
    <b class="text-error">non functional</b>
    development preview of the v3 active mode. It is not able to be used for any real game play, and
    is not a replacement for the v2 active mode. To follow the development of this feature, please
    check out the
    <a href="https://www.patreon.com/c/compcon" target="_blank">
      public devlogs on the COMP/CON Patreon
    </a>
    .
  </cc-alert>
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
              <v-list-item-title
                class="heading h2"
                :class="headers[i].subtitle ? 'text-grey' : 'text-accent'"
                v-text="headers[i].title" />
              <v-list-item-subtitle
                v-if="headers[i].subtitle"
                v-text="headers[i].subtitle"
                class="text-cc-overline my-n1" />
            </v-list-item>
            <div v-for="e in list">
              <v-list-item
                v-if="!e.small"
                lines="two"
                :key="e.title"
                :title="e.title"
                :class="e.disabled ? 'bg-panel' : 'bg-primary'"
                density="compact"
                class="my-1"
                :disabled="e.disabled"
                :subtitle="e.subtitle"
                :to="e.to">
                <template #prepend>
                  <v-avatar>
                    <v-icon size="x-large" :icon="e.icon" />
                  </v-avatar>
                </template>
              </v-list-item>
              <div v-else>
                <v-btn
                  v-if="(e as any).id === 'last-local' && lastLocalEncounter"
                  block
                  size="small"
                  tile
                  color="accent"
                  flat
                  @click="loadLastLocalEncounter()">
                  <v-icon :icon="e.icon" start />
                  resume {{ lastLocalEncounter.Encounter.Name }} (Round
                  {{ lastLocalEncounter.Round }})
                </v-btn>
                <v-btn
                  v-else
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
import { EncounterStore } from '@/stores';

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
        subtitle: 'In Development (release v3.0.2)',
      },
    ],
    lists: [
      [
        {
          title: 'Active Character Sheets',
          subtitle: 'Create, manage, and run active Player Character sheets',
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
          subtitle: 'Feature in development (v3.0.2)',
          disabled: true,
          icon: 'cc:squad',
          to: '/active-mode/join-table',
        },
      ],
      [
        {
          title: 'Local Encounters',
          subtitle: 'Create, manage, and run local Encounters for your Lancer games',
          icon: 'cc:encounter',
          to: '/active-mode/manage-encounters',
        },
        {
          id: 'last-local',
          small: true,
          subtitle: 'resume last',
          icon: 'mdi-restart',
          to: '',
        },
        {
          title: 'Active Tables',
          subtitle: 'Feature in development (v3.0.1)',
          disabled: true,
          icon: 'mdi-lan',
          to: '/active-mode/manage-tables',
        },
      ],
      [
        {
          title: 'Spectator Mode',
          subtitle: 'Feature in development (v3.0.2)',
          disabled: true,
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
          subtitle: 'Feature in development (v3.0.2)',
          disabled: true,
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
    lastLocalEncounter() {
      return EncounterStore().getCurrentActiveEncounter;
    },
  },
  methods: {
    loadLastLocalEncounter() {
      if (this.lastLocalEncounter) {
        EncounterStore().AssignActiveEncounter(this.lastLocalEncounter);
        this.$router.push('active-mode/gm-encounter-runner');
      }
    },
  },
};
</script>
