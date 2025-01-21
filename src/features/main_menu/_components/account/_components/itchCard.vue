<template>
  <v-card @click="dialog = true" variant="outlined" style="border-color: rgb(var(--v-theme-itch))">
    <div class="bg-itch text-caption" style="letter-spacing: 4px !important">
      <cc-slashes />
      <b class="px-2">ITCH LINKED</b>
      <cc-slashes />
    </div>
    <v-card-text class="py-2">
      <v-row>
        <v-col cols="auto">
          <v-avatar size="40" color="primary">
            <v-img :src="itch.user.cover_url" />
          </v-avatar>
        </v-col>
        <v-col>
          <div class="heading h3 text-center text-accent">
            <b>{{ itch.user.username }}</b>
          </div>
          <div>Click for details</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog" :fullscreen="mobile" max-width="1000">
    <v-card :loading="loading">
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title class="heading h3">Linked Massif Content</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div>COMP/CON has linked the following itch.io purchases to your account:</div>
        <v-chip
          v-for="game in itch.gamedata"
          label
          variant="tonal"
          color="accent"
          prepend-icon="cc:compendium"
          :text="game.title"
          :key="game.title"
          class="ma-1" />
        <div class="mt-2">
          Your COMP/CON cloud account is eligible for the following automatic updates:
        </div>
        <v-card flat border>
          <v-card-text>
            <v-row v-for="item in map" dense :class="{ 'text-disabled': !item.enabled }">
              <v-col cols="auto">
                <v-icon
                  :color="item.enabled ? 'success' : ''"
                  :icon="item.enabled ? 'mdi-check-bold' : 'mdi-cancel'" />
              </v-col>
              <v-col>{{ item.name }}</v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <div class="text-center py-2">
            Unlinked LCPs and other content can still be manually added via the
            <b>Manage Content</b>
            page.
          </div>
        </v-card>

        <v-alert
          color="accent"
          border
          variant="outlined"
          density="compact"
          class="mt-2"
          icon="mdi-alert-rhombus-outline">
          <div>
            <b>COMP/CON does not automatically track new itch.io data.</b>
            <div class="text-caption">
              If you have new purchases or download keys on your itch.io account click the
              <b>Update</b>
              button below to add these to COMP/CON. Unfortunately, it is not possible to link
              non-Massif purchases at this time due to limitations in the itch.io API.
            </div>
          </div>
        </v-alert>
        <div class="text-caption text-right">
          COMP/CON last polled your itch account on
          {{ new Date(itch.lastUpdate).toLocaleString() }}
          <br />
          <v-btn
            size="small"
            color="accent"
            variant="tonal"
            prepend-icon="mdi-refresh"
            @click="updateItch"
            :loading="loading">
            Update
          </v-btn>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'itch-card',
  data: () => ({
    dialog: false,
    loading: false,
  }),
  computed: {
    itch() {
      return UserStore().User.Itch;
    },
    map() {
      return UserStore().User.ItchMap;
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    async updateItch() {
      this.loading = true;
      await UserStore().refreshItchData();
      this.loading = false;
    },
  },
};
</script>
