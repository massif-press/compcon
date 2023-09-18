<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-text-field
          v-model="shareCode"
          variant="outlined"
          density="compact"
          label="Pilot Share Code"
          hide-details
          clearable
          color="accent"
          style="min-width: 300px"
          @click:clear="reset"
          @keyup="sanitizeShareCode()"
          :readonly="!!searchResults"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="accent"
          :disabled="shareCode && shareCode.length !== 6"
          :loading="loading"
          @click="search()"
        >
          <v-icon large left>mdi-account-search</v-icon>
          Search
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="searchResults !== null" class="my-2">
      <v-card outlined>
        <v-card-text class="text-center">
          <i v-if="!searchResults.Item">No record found with share code {{ shareCode }}</i>
          <div v-else>
            <div>Record found! Attempting to load data...</div>
            <v-progress-linear v-show="loading" indeterminate />
            <v-fade-transition>
              <div v-if="pilotData">
                Loaded {{ pilotData.callsign }} ({{ pilotData.name }}). Staging for import...
              </div>
            </v-fade-transition>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <v-card v-if="missingContent.length">
      <p v-if="oldBrewsWarning" class="heading h3 text-accent">
        WARNING: The imported Pilot was created using an older version of COMP/CON. Lancer Content
        Pack analysis may not be comprehensive and there is a chance COMP/CON will be unable to
        correctly load this data. Export the original file in the latest version of COMP/CON to
        guarantee LCP validation.
      </p>
      <v-card-text class="text-center">
        <p class="heading h4 text-accent">
          The imported Pilot requires the following content packs that are not currently
          installed/active, or have mismatching versions:
        </p>
        <p class="effect-text text-center" v-html="missingContent" />
        <p class="text-text">
          This Pilot cannot be imported until the missing content packs are installed and activated,
          or the content pack versions are synchronized.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="reset">Abort Import</v-btn>
      </v-card-actions>
    </v-card>
    <div class="mt-2">
      <p v-if="alreadyPresentItem" class="text-accent text-center">
        A Pilot with this ID already exists in the roster. Unable to set this pilot as a remote
        resource. You may
        <b class="text-accent">permanently delete</b>
        the existing pilot to continue this import.
        <v-btn x-small color="error" @click="deleteAP()">Permanenty delete local item</v-btn>
      </p>
      <p v-if="isSameUser" class="text-accent text-center">
        The cloud account ID associated with this item is the same as the currently logged-in user.
        Unable to set this pilot as a remote resource.
      </p>
      <v-slide-x-reverse-transition>
        <v-row v-if="stagedData" align="center" justify="space-around">
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              :disabled="missingContent.length > 0"
              @click="importAsCopy()"
            >
              <v-icon large left>cc:accuracy</v-icon>
              Import {{ stagedData.callsign }} ({{ stagedData.name }}) as&nbsp;
              <b>a copy</b>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              :disabled="missingContent.length > 0 || alreadyPresentItem || isSameUser"
              @click="importAsRemote()"
            >
              <v-icon large left>cc:accuracy</v-icon>
              Import {{ stagedData.callsign }} ({{ stagedData.name }}) as&nbsp;
              <b>a remote resource</b>
              <cc-tooltip
                title="Remote Resource"
                content="Importing this Pilot as a remote resource
              will create a
              <b>read-only</b>
              version of this pilot in your roster that can be updated when the owner of this data
              publishes changes to their cloud account. Remote data cannot be saved to your own cloud account. An editable local copy of a remote resource pilot can be made by duplicating the pilot (Pilot Options > Clone > Duplicate)"
              >
                <v-icon end>mdi-information-outline</v-icon>
              </cc-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Pilot } from '@/class';

import { CompendiumStore, PilotStore } from '@/stores';
import { getRecord } from '@/io/apis/share';
// import { GetSingleRemote } from '@/cloud/item_sync';
// import { Auth } from 'aws-amplify';

export default {
  name: 'share-import',
  data: () => ({
    cid: '',
    shareCode: '',
    loading: false,
    pilotData: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: null,
    alreadyPresentItem: null,
    isSameUser: false,
    searchResults: null,
  }),
  async mounted() {
    // this.cid = await Auth.currentUserCredentials()
    //   .then((res) => res.identityId)
    //   .catch(() => '');
  },
  watch: {
    searchResults(newval) {
      if (newval && newval.Item) {
        if (newval.Item.iid === this.cid) {
          this.isSameUser = true;
        }
        this.downloadPilotData();
      }
    },
  },
  methods: {
    reset() {
      this.shareCode = '';
      this.loading = false;
      this.pilotData = null;
      this.oldBrewsWarning = false;
      this.missingContent = '';
      this.stagedData = null;
      this.alreadyPresentItem = null;
      this.searchResults = null;
      this.isSameUser = false;
    },
    async search() {
      this.loading = true;
      this.shareCode = this.shareCode.toUpperCase();
      getRecord(this.shareCode)
        .then((res) => {
          this.searchResults = res.data;
          if (!res.data.Item) this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.$notify('An error occurred when searching for the share code.', err);
          this.loading = false;
        });
    },
    async downloadPilotData() {
      // const record = this.searchResults.Item;
      // GetSingleRemote(record.key, record.iid)
      //   .then((res) => {
      //     this.pilotData = res;
      //   })
      //   .then(() => this.stageImport())
      //   .catch((err) => {
      //     console.error(err);
      //     this.$notify('An error occurred while downloading remote data.', err);
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
    },
    async stageImport() {
      if (!this.pilotData.brews) this.pilotData.brews = [];
      // catch old style brews
      if (this.pilotData.brews.length && !this.pilotData.brews[0].LcpId) {
        this.oldBrewsWarning = true;

        const installedPacks = CompendiumStore()
          .ContentPacks.filter((x) => x.Active)
          .map((x) => `${x.Name} @ ${x.Version}`);
        const missingPacks = _.pullAll(this.pilotData.brews, installedPacks);
        if (missingPacks.length) this.missingContent = missingPacks.join('<br />');
      } else {
        const installedPacks = CompendiumStore()
          .ContentPacks.filter((x) => x.Active)
          .map((x) => x.ID);
        let missing = [];
        this.pilotData.brews.forEach((b) => {
          if (!installedPacks.includes(b.LcpId)) {
            missing.push(`${b.LcpName} @ ${b.LcpVersion}`);
          }
        });
        if (missing.length) this.missingContent = missing.join('<br />');
      }
      const ap = PilotStore().AllPilots.find((x) => x.ID === this.pilotData.id);
      if (ap) {
        this.alreadyPresentItem = ap;
      }
      this.stagedData = this.pilotData;
    },
    importAsCopy() {
      console.log('importing as copy');
      try {
        this.pilotData.name += '※';
        this.pilotData.callsign += '※';
        const importPilot = Pilot.Deserialize(this.stagedData);
        importPilot.CloudController.reset();
        importPilot.RenewID();
        this.$store.dispatch('addPilot', importPilot);
        this.reset();
        this.$emit('done');
        this.$notify('Pilot successfully imported', 'success');
      } catch (error) {
        this.$notify(
          'An error occured during the import attempt. Please check the console log.',
          'error'
        );
      }
    },
    importAsRemote() {
      console.log('importing as remote');
      try {
        const importPilot = Pilot.Deserialize(this.stagedData);
        const record = this.searchResults.Item;
        // importPilot.CloudController.SetRemoteResource(record.iid, record.key);
        this.$store.dispatch('addPilot', importPilot);
        this.reset();
        this.$emit('done');
        this.$notify('Pilot successfully imported', 'success');
      } catch (error) {
        this.$notify(
          'An error occured during the import attempt. Please check the console log.',
          'error'
        );
      }
    },
    cancelImport() {
      this.reset();
    },
    sanitizeShareCode() {
      if (!this.shareCode) this.shareCode = '';
      this.shareCode = this.shareCode.replaceAll(' ', '');
    },
    deleteAP() {
      const ps = PilotStore();
      ps.deletePilotPermanent(ps.AllPilots.find((x) => x.ID === this.alreadyPresentItem.ID));
      this.alreadyPresentItem = null;
    },
  },
};
</script>

<style scoped>
#panel {
  border: 5px double rgb(var(--v-theme-panel-border)) !important;
  border-radius: 2px !important;
}
</style>
