<template>
  <v-container fluid style="overflow: hidden; height: calc(100vh - 50px)">
    <v-row justify="center" align="center">
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
    <v-row style="height: 100%" class="mt-1 px-5" justify="space-around">
      <v-col v-for="(list, i) in lists">
        <v-list lines="two">
          <v-list-item>
            <v-img :src="headers[i].img" />
            <v-list-item-title
              class="heading h2 text-accent"
              v-text="headers[i].title"
            />
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
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-1">
                <v-icon size="x-large" color="accent" :icon="e.icon" />
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ImageTag } from '@/classes/enums';
import { getImagePath } from '@/io/ImageManagement';

export default {
  name: 'home',
  data: () => ({
    headers: [
      {
        img: getImagePath(ImageTag.Misc, 'lancer.svg'),
        title: 'LANCER',
      },
      {
        img: getImagePath(ImageTag.Misc, 'nhp.svg'),
        title: 'GAME MASTER',
      },
      {
        img: getImagePath(ImageTag.Misc, 'diasporan.svg'),
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
          subtitle:
            'Open a previously created Character Sheet to continue a LANCER game',
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
          subtitle:
            'Run a non-interactive spectator display for a realtime LANCER game',
          icon: 'mdi-monitor-share',
          disabled: true,
          to: '',
        },
        {
          title: 'Campaign Display',
          subtitle:
            'Run an interactive GM display for a loaded LANCER campaign',
          icon: 'mdi-monitor-dashboard',
          disabled: true,
          to: '',
        },
      ],
    ],
  }),
};
</script>
