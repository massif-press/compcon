<template>
  <div v-show="versionAnalysis !== 'err'" class="ma-1 py-1 px-2 panel rounded">
    <span v-if="versionAnalysis === 'brew outdated'">
      COMP/CON has detected a newer version of this LCP than the one present in
      this item's data. C/C can attempt to force an update. If item IDs have
      remained consistent accross LCP versions, this process will be successful.
    </span>
    <span v-else-if="versionAnalysis === 'pack outdated'">
      COMP/CON has detected that this item has been created with a LCP that is
      newer than the one currently installed. Updating the local LCP is
      recommended, but C/C can attempt to force a downgrade of this data. This
      may cause errors if it contains LCP content not found in earlier versions.
    </span>
    <v-btn color="secondary" x-small @click="$emit('update')"
      >Force Data Update</v-btn
    >
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/store';

export default {
  name: 'autoupdater',
  props: ['brew'],
  computed: {
    lcps() {
      return this.getModule(CompendiumStore).ContentPacks;
    },
    normalizedBrew() {
      if (this.brew.LcpName) return this.brew;
      const arr = this.brew.split(' @ ');
      return {
        LcpName: arr[0],
        LcpVersion: arr[1],
      };
    },
    packByName() {
      return this.lcps.find(
        (x) =>
          x.Name.toLowerCase() === this.normalizedBrew.LcpName.toLowerCase()
      );
    },
    versionAnalysis() {
      if (!this.packByName) return 'err';
      let vBrew = parseInt(this.normalizedBrew.LcpVersion.split('.').join(''));
      if (isNaN(vBrew)) return 'err';
      let vPack = parseInt(this.packByName.Version.split('.').join(''));
      if (isNaN(vPack)) return 'err';

      if (vBrew < vPack) return 'brew outdated';
      return 'pack outdated';
    },
  },
};
</script>
