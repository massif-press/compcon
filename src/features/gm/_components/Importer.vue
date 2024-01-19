<template>
  <v-card-text>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-file-input
          v-model="fileValue"
          accept="text/json"
          variant="outlined"
          label="Select Data File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>
    <v-container>
      <div class="text-caption">Staged Items:</div>

      <v-table>
        <thead class="heading">
          <tr>
            <th width="1px">
              <v-btn
                icon
                flat
                size="small"
                :value="selected.length === stagedItems.length"
                hide-details
                @click="
                  selected.length ? (selected = []) : (selected = stagedItems.map((x: any) => x.ID))
                ">
                <v-icon
                  size="x-large"
                  :icon="
                    selected.length === stagedItems.length
                      ? 'mdi-checkbox-outline'
                      : selected.length > 0
                        ? 'mdi-minus-box-outline'
                        : 'mdi-checkbox-blank-outline'
                  " />
              </v-btn>
            </th>
            <th>Item</th>
            <th>Collection</th>
            <th>Item Type</th>
            <th>Content Packs</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody v-for="item in stagedItems">
          <tr>
            <td>
              <v-checkbox v-model="selected" multiple hide-details />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.collection }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.content_packs }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-card v-if="missingContent.length">
        variant="tonal" class="mx-12">
        <p v-if="oldBrewsWarning" class="heading h3 text-accent">
          WARNING: The data to be imported was created using an older version of COMP/CON. Lancer
          Content Pack analysis may not be comprehensive and there is a chance COMP/CON will be
          unable to correctly load this data. Export the original file in the latest version of
          COMP/CON to guarantee LCP validation.
        </p>
        <v-card-text class="text-center">
          <p class="heading h4 text-accent">
            The data to be imported requires the following content packs that are not currently
            installed/active, or have mismatching versions:
          </p>
          <p class="effect-text text-center" v-html="missingContent" />
          <p class="text-text">
            This data cannot be imported until the missing content packs are installed and
            activated, or the content pack versions are synchronized.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="tonal" color="error" @click="reset">Abort Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

    <v-row justify="end" class="mt-2 mr-4">
      <v-col cols="auto">
        <v-btn
          variant="tonal"
          size="large"
          color="accent"
          prepend-icon="mdi-plus"
          :disabled="missingContent.length > 0"
          @click="importFile()">
          Complete Import
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import _ from 'lodash';
import { ImportData } from '@/io/Data';

export default {
  name: 'file-import',
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selected: [] as any[],
    // fileValue is just used to clear the file input
    fileValue: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: [] as any[],
    stagedItems: [] as any[],
    alreadyPresent: '',
  }),
  methods: {
    reset() {
      this.fileValue = null;
      this.oldBrewsWarning = false;
      this.missingContent = '';
      this.stagedData = [];
      this.alreadyPresent = '';
    },
    async stageImport(file) {
      if (!file) return;
      let content = [] as any[];
      const data = await ImportData<any>(file.target.files[0]);
      console.log(data);
      if (data.type && data.type === 'collection') content = data.data;
      else content.push(data);

      this.stagedItems = [...content];
      this.stagedData = content;

      this.stagedItems.forEach((item) => {
        if (item.npcType) {
          item.collection = 'NPC';
          item.type = item.npcType;
        } else {
          item.collection = 'Narrative Item';
          item.type = item.narrativeType;
          item.content_packs = 'N/A';
          item.status = true;
        }
      });

      // if (!pilotData.brews) pilotData.brews = [];
      // // catch old style brews
      // if (pilotData.brews.length && !pilotData.brews[0].LcpId) {
      //   this.oldBrewsWarning = true;

      //   const installedPacks = CompendiumStore()
      //     .ContentPacks.filter((x) => x.Active)
      //     .map((x) => `${x.Name} @ ${x.Version}`);
      //   const missingPacks = _.pullAll(pilotData.brews, installedPacks as any);
      //   if (missingPacks.length) this.missingContent = missingPacks.join('<br />');
      // } else {
      //   const installedPacks = CompendiumStore()
      //     .ContentPacks.filter((x) => x.Active)
      //     .map((x) => x.ID);
      //   let missing = [] as string[];
      //   pilotData.brews.forEach((b) => {
      //     if (!installedPacks.includes(b.LcpId)) {
      //       missing.push(`${b.LcpName} @ ${b.LcpVersion}`);
      //     }
      //   });
      //   if (missing.length) this.missingContent = missing.join('<br />');
      // }

      // const exists = PilotStore().Pilots.find((x) => x.ID === pilotData.id);
      // if (exists && !exists.SaveController.IsDeleted) {
      //   this.alreadyPresent =
      //     'A Pilot with this ID already exists in the roster. Importing will create a unique copy of this pilot.';
      //   const num = PilotStore().Pilots.filter((x) => x.Name === pilotData.name).length;
      //   pilotData.name += ` (${num})`;
      // }
      // this.stagedData = pilotData;
    },
    importFile() {
      try {
        // const importPilot = Pilot.Deserialize(this.stagedData as PilotData);
        // importPilot.CloudController.reset();
        // importPilot.RenewID();
        // PilotStore().AddPilot(importPilot, this.groupId);
        // this.reset();
        // this.$emit('done');
        // this.$notify({
        //   title: 'Import Successful',
        //   text: `${importPilot.Name} // ${importPilot.Callsign} successfully added to roster.`,
        //   data: { icon: 'cc:pilot' },
        // });
      } catch (error) {
        this.$notify({
          title: 'Import Error',
          text: `Unable to import GM Data: ${error}`,
          data: { icon: 'cc:compendium', color: 'error' },
        });
      }
    },
    cancelImport() {
      this.reset();
    },
  },
};
</script>
