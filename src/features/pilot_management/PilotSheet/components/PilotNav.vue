<template>
  <div class="nav-body elevation-8">
    <div id="cap" />
    <div class="d-inline">
      <nav-item :selected="selected === 0" @click="$emit('to', 0)">
        <cc-tooltip inline delayed content="Pilot IDENT, Status, and Biographical Information">
          DOSSIER
        </cc-tooltip>
      </nav-item>
      <nav-item :selected="selected === 1" @click="$emit('to', 1)">
        <cc-tooltip inline delayed content="Pilot Skill Triggers, Reserves, and Pilot Gear Loadout">
          NARRATIVE PROFILE
        </cc-tooltip>
      </nav-item>
      <nav-item v-if="hasBonds" :selected="selected === 2" @click="$emit('to', 2)">
        <cc-tooltip inline delayed content="Pilot Bonds">BONDS</cc-tooltip>
      </nav-item>
      <nav-item :selected="selected === 3" @click="$emit('to', 3)">
        <cc-tooltip inline delayed content="Pilot Licenses, Mech Skills, CORE Bonuses, and Talents">
          TACTICAL PROFILE
        </cc-tooltip>
      </nav-item>
      <nav-item :selected="selected === 4" @click="$emit('to', 4)">
        <cc-tooltip inline delayed content="Create and Modify Mechs and their Loadouts">
          MECH HANGAR
        </cc-tooltip>
      </nav-item>
    </div>

    <div id="divider" />
    <cc-tooltip
      v-if="pilot.CloudController.IsRemoteResource"
      inline
      delayed
      title="Download Latest Data"
      :content="
        isAuthed
          ? 'Download all remote changes to this pilot, overwriting local data.'
          : 'Requires Cloud Account'
      ">
      <v-btn
        icon
        class="unskew ml-6"
        :disabled="!isAuthed"
        :loading="loading"
        @click="remoteUpdate()">
        <v-icon color="white">mdi-cloud-sync</v-icon>
      </v-btn>
    </cc-tooltip>
    <cc-tooltip
      v-else
      inline
      delayed
      :content="isAuthed ? 'Share Pilot Data' : 'Requires Cloud Account'">
      <v-btn
        icon
        variant="plain"
        class="unskew ml-6"
        :disabled="!isAuthed"
        @click="($refs as any).share.show()">
        <v-icon color="white">mdi-code-json</v-icon>
      </v-btn>
    </cc-tooltip>
    <cc-tooltip inline delayed content="Pilot Options">
      <edit-menu :pilot="pilot" class="unskew" style="display: inline-block" />
    </cc-tooltip>

    <cc-solo-dialog title="Share Code Management" ref="share" no-confirm>
      <share-dialog :pilot="pilot" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import EditMenu from './PilotEditMenu.vue';
import ShareDialog from './ShareDialog.vue';
import { Pilot } from '@/class';
import { PilotStore, CompendiumStore, UserStore } from '@/stores';
import NavItem from '../../_components/NavItem.vue';
// import { Auth } from 'aws-amplify';
// import { RemoteSyncItem } from '@/cloud/item_sync';

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
  async mounted() {
    // await Auth.currentAuthenticatedUser();
  },
  computed: {
    lastLoaded() {
      const store = PilotStore();
      return null;
      // TODO: Fix this
      // return this.pilot.Mechs.some((x) => x.ID === store.LoadedMechID)
      //   ? store.LoadedMechID
      //   : this.pilot.ActiveMech
      //   ? this.pilot.ActiveMech.ID
      //   : null;
    },
    isAuthed() {
      return UserStore().IsLoggedIn;
    },
    hasBonds() {
      return CompendiumStore().Bonds.length > 0;
    },
  },
  methods: {
    toMech() {
      this.$router.push(`../mech/${this.lastLoaded}`);
    },
    toActive() {
      this.$router.push(`/active/${this.pilot.ID}`);
    },
    delete_pilot() {
      this.pilot.SaveController.delete();
      this.$router.push('/pilot_management');
    },
    async remoteUpdate() {
      // this.loading = true;
      // try {
      //   await RemoteSyncItem(this.pilot);
      //   this.$notify('Pilot synced to remote', 'success');
      // } catch (error) {
      //   console.error(error);
      //   this.$notify('An error occurred while attempting to download remote data', 'error');
      // }
      // this.loading = false;
    },
  },
};
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  left: 16px;
  min-height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  color: white;
  z-index: 10;
}

#cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 70px;
  height: 45px;
  left: -50px;
  top: 0;
  z-index: 9;
}

#divider {
  width: 2px;
  min-width: 2px;
  height: 47px;
  right: 120px;
  top: 0;
  z-index: 11;
  background-color: white;
  position: absolute;
}

.unskew {
  transform: translateZ(0) skew(0.65rad);
}
</style>
