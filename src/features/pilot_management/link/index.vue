<template>
  <v-container class="px-12" style="max-width: 1200px">
    <v-progress-linear v-if="loading" indeterminate />
    <div v-else-if="!pilot">
      <v-row class="mt-4">
        <v-col>
          <div class="heading h2">Pilot Not Found</div>
          <p class="text-center">
            A pilot with the share code
            <span class="text-accent">{{ sharecode }}</span>
            could not be found.
          </p>
        </v-col>
      </v-row>
    </div>
    <div v-else-if="incompatible">
      <v-row class="mt-4">
        <v-col>
          <div class="heading h2">Pilot requires re-sync</div>
          <p class="text-center">
            Pilot
            <b class="text-accent">
              {{ itemData.callsign }}
            </b>

            {{ `(${itemData.name})` }}
            with share code
            <span class="text-accent">{{ sharecode }}</span>
            must be re-synced to the author's account before it can be viewed.
          </p>
        </v-col>
      </v-row>
    </div>
    <div v-else-if="pilot">
      <full-link-sheet v-if="style === 'full'" :pilot="pilot" :mech="mech" />
      <build-link-sheet v-else :pilot="pilot" :mech="mech" />
    </div>
    <div style="height: 80px" />
  </v-container>
  <v-tabs
    v-if="style === 'full' && pilot"
    style="position: fixed; bottom: 26px; left: 0; right: 0; z-index: 2"
    color="primary"
    fixed
    height="22"
    align-tabs="center"
    bg-color="primary">
    <v-tab v-for="l in links" color="accent" style="margin-top: -2px" @click="scrollTo(l.target)">
      {{ l.title }}
    </v-tab>
  </v-tabs>
  <v-footer app density="compact" color="primary" height="30" border="t">
    <cc-button prepend-icon="mdi-arrow-left" size="small" class="mr-2" @click="$router.go(-1)">
      Back
    </cc-button>
    <cc-button prepend-icon="mdi-home" size="small" to="/">Main Menu</cc-button>

    <v-spacer />
    <v-tooltip location="top" open-delay="300">
      <template #activator="{ props }">
        <v-icon v-bind="props" size="small" icon="mdi-share-variant" @click="copyToClipboard" />
      </template>
      <span>Copy link</span>
    </v-tooltip>
  </v-footer>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import { unCamelCase } from '@/classes/utility/accent_fold';
import { downloadFromS3, GetFromCode } from '@/io/apis/account';
import { CompendiumStore } from '@/stores';
import logger from '@/user/logger';
import FullLinkSheet from './_views/FullLinkSheet.vue';
import BuildLinkSheet from './_views/BuildLinkSheet.vue';

export default {
  name: 'pilot-link',
  components: {
    FullLinkSheet,
    BuildLinkSheet,
  },
  props: {
    sharecode: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      default: 'full',
    },
    mechId: {
      type: String,
    },
  },
  data: () => ({
    loading: true,
    itemData: null as any,
    pilot: null as Pilot | null,
  }),
  async created() {
    await this.getFromCode();
  },
  mounted() {
    if (this.pilot) document.title = `${this.pilot.Callsign} // ${this.pilot.Name}`;
    else document.title = 'Pilot Link';
  },
  computed: {
    compendiumLoaded() {
      return CompendiumStore().loaded;
    },
    incompatible() {
      if (this.itemData) {
        return !this.itemData.originId;
      }
    },
    mech() {
      if (this.mechId) {
        return this.pilot?.Mechs.find((m) => m.ID === this.mechId) || undefined;
      }
      return undefined;
    },
    links() {
      if (!this.pilot) return [];
      const links = [{ title: 'Biography', target: 'biography' }];
      if (this.pilot.BondController.Bond) links.push({ title: 'Bond', target: 'bond' });
      if (this.pilot.SkillsController.Skills.length > 0)
        links.push({ title: 'Skills', target: 'skills' });
      if (this.pilot.ReservesController.Reserves.length > 0)
        links.push({ title: 'Reserves', target: 'reserves' });
      links.push({ title: 'Loadout', target: 'loadout' });
      if (this.pilot.LicenseController.Licenses.length > 0)
        links.push({ title: 'Licenses', target: 'licenses' });
      if (this.pilot.CoreBonusController.CoreBonuses.length > 0)
        links.push({ title: 'Core Bonuses', target: 'core-bonuses' });
      if (this.pilot.TalentsController.Talents.length > 0)
        links.push({ title: 'Talents', target: 'talents' });

      if (this.mech) {
        links.push({ title: 'Mech', target: 'mech' });
      }

      return links;
    },
  },
  methods: {
    unCamelCase(str) {
      return unCamelCase(str);
    },
    copyToClipboard() {
      navigator.clipboard.writeText(window.location.href);
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      const offset = 50;
      if (!el) {
        logger.error(`Element with ID ${id} not found for scrolling`, this);
        return;
      }
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    },
    async getFromCode() {
      this.loading = true;
      let row;
      try {
        row = await GetFromCode(this.sharecode);
        console.log(`Got db row from code`, row);
      } catch (err) {
        logger.error(`Unable to find pilot at share code ${this.sharecode}`, this);
      }

      try {
        const itemData = await downloadFromS3(row.uri);
        console.log(`Downloaded item data from S3`, itemData);
        this.itemData = itemData;
        this.pilot = new Pilot(itemData);
      } catch (err) {
        logger.error(`Error downloading pilot data: ${err}`, this);
      }

      this.loading = false;
    },
  },
};
</script>
