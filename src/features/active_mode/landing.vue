<template>
  <v-container style="overflow: hidden" fluid>
    <v-row justify="space-around" align="center" class="mt-2">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div
          class="font-weight-light text-center my-n2"
          style="letter-spacing: 2vw !important; font-size: 2vw !important"
        >
          ACTIVE MODE
        </div>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row style="height: calc(100vh - 130px)" class="mt-1 px-5" justify="space-around">
      <v-col v-for="(list, i) in lists">
        <v-card variant="tonal" height="100%" class="px-6">
          <v-list lines="two">
            <v-list-item class="text-center">
              <v-icon :icon="headers[i].icon" size="300" />
              <v-list-item-title class="heading h2 text-accent" v-text="headers[i].title" />
            </v-list-item>
            <v-divider />
            <v-list-item
              v-for="e in list"
              :key="e.title"
              :title="e.title"
              :subtitle="e.subtitle"
              :to="e.to"
              :disabled="e.disabled"
            >
              <template #prepend>
                <v-avatar>
                  <v-icon size="x-large" color="primary" :icon="e.icon" />
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
import { ImageTag } from '@/classes/enums';
import { getImagePath } from '@/io/ImageManagement';
import { CCIconDivider } from '@/ui/globals';

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
          title: 'Start a Character Sheet',
          subtitle:
            'Create a new Character Sheet, an instance of a Pilot and their active Mech, for use in a LANCER game',
          icon: 'cc:pilot',
          to: '/active-mode/new-character-sheet',
        },
        {
          title: 'Open a Character Sheet',
          subtitle: 'Open a previously created Character Sheet to continue a LANCER game',
          icon: 'mdi-book-open',
          to: '/active-mode/open-character-sheet',
        },
        {
          title: 'Join a Table',
          subtitle: 'Join an realtime LANCER table to play with friends online',
          icon: 'cc:squad',
          disabled: true,
          to: '',
        },
        {
          title: 'Resume a Table',
          subtitle: 'Resume a realtime LANCER table',
          icon: 'mdi-lan',
          disabled: true,
          to: '',
        },
      ],
      [
        {
          title: 'Begin a New Encounter',
          subtitle: 'Configure and run an Encounter',
          icon: 'cc:encounter',
          to: '',
        },
        {
          title: 'Resume an Encounter',
          subtitle: 'Continue an active Encounter',
          icon: 'mdi-motion-play-outlne',
          to: '',
        },
        {
          title: 'Create a Table',
          subtitle: 'Create an online LANCER table and invite players to join',
          icon: 'mdi-plus-network-outline',
          disabled: true,
          to: '',
        },
      ],
      [
        {
          title: 'Spectator Mode',
          subtitle: 'Run a non-interactive spectator display for a realtime LANCER game',
          icon: 'mdi-monitor-share',
          disabled: true,
          to: '',
        },
        {
          title: 'Campaign Display',
          subtitle: 'Run an interactive GM display for a loaded LANCER campaign',
          icon: 'mdi-monitor-dashboard',
          disabled: true,
          to: '',
        },
      ],
    ],
  }),
  components: { CCIconDivider },
};
</script>
