<template>
  <div class="nav-body elevation-8">
    <div id="cap" />
    <div class="d-inline">
      <nav-item :selected="selected === 1" @click="$emit('to', 1)">
        <v-tooltip
          open-delay="300"
          location="top"
          text="Pilot Skill Triggers, Reserves, and Pilot Gear Loadout">
          <template #activator="{ props }">
            <span v-bind="props">NARRATIVE PROFILE</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item v-if="hasBonds" :selected="selected === 2" @click="$emit('to', 2)">
        <v-tooltip open-delay="300" location="top" text="Pilot Bonds">
          <template #activator="{ props }">
            <span v-bind="props">BONDS</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item :selected="selected === 3" @click="$emit('to', 3)">
        <v-tooltip
          open-delay="300"
          location="top"
          text="Pilot Licenses, Mech Skills, CORE Bonuses, and Talents">
          <template #activator="{ props }">
            <span v-bind="props">TACTICAL PROFILE</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item :selected="selected === 4" @click="$emit('to', 4)">
        <v-tooltip
          open-delay="300"
          location="top"
          text="Create and Modify Mechs and their Loadouts">
          <template #activator="{ props }">
            <span v-bind="props">MECH HANGAR</span>
          </template>
        </v-tooltip>
      </nav-item>
    </div>

    <div id="divider" />

    <v-tooltip
      v-if="pilot.IsRemote"
      open-delay="300"
      :text="
        isAuthed
          ? pilot.CloudController.SyncStatus === 'Synced'
            ? 'Pilot is up to date with remote data'
            : 'Download all remote changes to this pilot, overwriting local data.'
          : 'Must be logged in to update'
      ">
      <template #activator="{ props }">
        <v-btn
          icon
          variant="text"
          size="x-small"
          class="unskew ml-3"
          :disabled="!isAuthed || pilot.CloudController.SyncStatus === 'Synced'"
          :loading="loading"
          v-bind="props"
          @click="remoteUpdate()">
          <v-icon>mdi-cloud-sync</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <cc-dialog v-else title="Share Pilot Data" icon="cc:pilot">
      <template #activator="{ open }">
        <v-tooltip
          open-delay="300"
          :text="isAuthed ? 'Share Pilot Data' : 'Requires Cloud Account'">
          <template #activator="{ props }">
            <v-btn
              icon
              variant="plain"
              size="x-small"
              class="unskew ml-6"
              :disabled="!isAuthed"
              v-bind="props"
              @click="open">
              <v-icon color="white">mdi-broadcast</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      <share-dialog :pilot="pilot" />
    </cc-dialog>

    <v-tooltip open-delay="300" text="Pilot Options">
      <template #activator="{ props }">
        <edit-menu
          :pilot="pilot"
          class="unskew"
          size="x-small"
          v-bind="props"
          style="display: inline-block" />
      </template>
    </v-tooltip>

    <div id="end-cap" />
  </div>
</template>

<script lang="ts">
import EditMenu from './PilotEditMenu.vue';
import ShareDialog from './ShareDialog.vue';
import { Pilot } from '@/class';
import { PilotStore, CompendiumStore, UserStore } from '@/stores';
import NavItem from '../../_components/NavItem.vue';
import { CloudController } from '@/classes/components';

export default {
  name: 'pilot-nav',
  components: {
    EditMenu,
    ShareDialog,
    NavItem,
  },
  emits: ['to'],
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    selected: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    loading: false,
  }),

  computed: {
    isAuthed() {
      return UserStore().IsLoggedIn;
    },
    hasBonds() {
      return CompendiumStore().Bonds.length > 0;
    },
  },
  methods: {
    delete_pilot() {
      this.pilot.SaveController.Delete();
      this.$router.push('/pilot_management');
    },
    async remoteUpdate() {
      try {
        await CloudController.UpdateRemote(this.pilot);
        await UserStore().refreshDbData();
        this.$notify({
          title: `Sync Complete`,
          text: `Pilot ${this.pilot.Callsign} // ${this.pilot.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync Pilot ${this.pilot.Callsign} // ${this.pilot.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
  },
};
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  left: 12px;
  min-height: 19px;
  padding-left: 20px;
  padding-right: 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  z-index: 10;
}

#cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 70px;
  height: 30px;
  left: -50px;
  top: 0;
  z-index: 9;
}

#end-cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 5px;
  height: 32px;
  left: 580px;
  top: 0;
  z-index: 9;
  transition: background-color 0.2s ease-in-out;
}

#divider {
  width: 2px;
  min-width: 2px;
  height: 32px;
  right: 95px;
  top: 0;
  z-index: 11;
  background-color: white;
  position: absolute;
}

.unskew {
  transform: translateZ(0) skew(0.65rad);
}

.nav-body:hover #end-cap {
  background-color: rgb(var(--v-theme-accent));
}
</style>
