<template>
  <v-container>
    <div v-if="!missingLength" class="heading h4">
      <span>
        <v-icon color="success" class="mt-n1">mdi-check-bold</v-icon>
        No Issues Detected
      </span>
    </div>
    <div v-else class="heading h3 text-stark">
      <span>
        <span class="text-error">{{ missingLength }}</span>
        {{ missingLength > 1 ? 'issues' : 'issue' }} detected
      </span>
    </div>
    <div>
      <p v-if="missingLength > 0">
        COMP/CON has determined the following items cannot be loaded, and require Lancer Content
        Packs that are not installed or not activated:
      </p>
      <v-alert
        v-if="missingPacks.length"
        prominent
        color="error"
        icon="mdi-alert-rhombus"
        variant="tonal">
        <div v-for="pack in missingPacks">
          Lancer Content Pack
          <b>{{ pack.Name }}</b>
          cannot be loaded because it is missing the following dependencies:
          <ul class="py-2 pl-8">
            <li v-for="dep in getMissingDependencies(pack)">
              <b>{{ dep.name }}</b>
              at version
              <b>{{ dep.version }}</b>
              <a v-if="dep.link" :href="dep.link" target="_blank" class="pl-2">[link]</a>
            </li>
          </ul>
        </div>
      </v-alert>

      <div>
        <v-card variant="tonal" v-for="item in allItems" class="mt-1 mb-2">
          <v-toolbar density="compact" style="height: 40px" class="mt-n2" color="pilot">
            <v-toolbar-title v-if="item.ItemType === 'Pilot'" class="text-caption">
              Pilot Data:
              <b>
                {{ item.Callsign }}
                <cc-slashes />
                {{ item.Name }}
              </b>
              <span class="text-disabled">- {{ item.ID }}</span>
            </v-toolbar-title>
            <v-toolbar-title v-else class="text-caption">
              NPC:
              <b>
                {{ item.Name }}
              </b>
              <span class="text-disabled">- {{ item.ID }}</span>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="py-1">
            <v-row align="center" dense>
              <v-col cols="auto">
                <v-icon
                  size="40"
                  :color="item.BrewController.IsUnableToLoad ? 'error' : 'warning'"
                  icon="mdi-alert-rhombus" />
              </v-col>
              <v-col>
                <div v-if="item.BrewController.DeactivatedBrews.length">
                  <b>DEACTIVATED LCPS</b>
                  <div v-for="brew in item.BrewController.DeactivatedBrews" class="ml-2">
                    <b class="text-accent" v-text="`${brew.LcpName}`" />
                    is present but not active.
                    <div class="text-caption">
                      This may result in missing or unavailable options and equipment. Please
                      re-enable and reload {{ brew.LcpName }} to resolve this issue.
                    </div>
                  </div>
                </div>

                <div v-if="item.BrewController.MissingBrews.length">
                  <b>MISSING LCPS</b>
                  <div v-for="brew in item.BrewController.MissingBrews" class="ml-2">
                    <b
                      class="text-accent"
                      v-html="
                        `${brew.LcpName} <span class='text-disabled'>@</span> ${brew.LcpVersion}`
                      " />
                    is missing.
                    <div v-if="brew.Website" class="text-caption">
                      It may be possible to download this pack at:
                      <a target="_blank" :href="brew.Website" v-text="brew.Website" />
                    </div>
                  </div>
                </div>

                <div v-if="item.BrewController.OutdatedBrews.length">
                  <b>OUTDATED LCPS</b>
                  <div v-for="brew in item.BrewController.OutdatedBrews" class="ml-2">
                    <span>
                      <b
                        class="text-accent"
                        v-html="
                          `${brew.LcpName} <span class='text-disabled'>@</span> ${brew.LcpVersion}`
                        " />
                      is outdated.
                    </span>
                    <div v-if="brew.Website" class="text-caption pl-4">
                      It may be possible to download this pack at:
                      <a target="_blank" :href="brew.Website" v-text="brew.Website" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="
                    item.BrewController.IsUnableToLoad &&
                    !item.BrewController.NonfunctionalBrews.length
                  ">
                  <b>MISSING CORE CONTENT</b>
                  <div>
                    <span class="text-caption">
                      COMP/CON is unable to load this item due to missing or non-loadable core
                      content, such as the core rules or GM content pack.
                    </span>
                    <div v-if="item.ItemType === 'Unit'">
                      <b class="text-accent" v-text="`LANCER CORE BOOK`" />
                      <div class="text-caption pl-4">
                        This pack is included in the Lancer Core Book paid content:
                        <a
                          target="_blank"
                          href="https://massif-press.itch.io/corebook-pdf"
                          v-text="`https://massif-press.itch.io/corebook-pdf`" />
                      </div>
                    </div>
                    <div v-else-if="item.ItemType === 'Eidolon'">
                      <b class="text-accent" v-text="`LANCER CORE BOOK`" />
                      <div class="text-caption pl-4">
                        This pack is included in the No Room for a Wallflower: Act 1 paid content:
                        <a
                          target="_blank"
                          href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1"
                          v-text="`https://massif-press.itch.io/no-room-for-a-wallflower-act-1`" />
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="auto" align-self="center">
                <v-tooltip location="top" text="Permanently delete this item from local data">
                  <template #activator="{ props }">
                    <v-btn
                      v-if="item.BrewController.MissingBrews.length"
                      v-bind="props"
                      size="small"
                      variant="plain"
                      icon
                      color="error"
                      @click="deleteItem(item)">
                      <v-icon size="x-large" icon="mdi-delete" />
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip
                  location="top"
                  max-width="300"
                  text="Let COMP/CON fix this item by clearing missing data. Please note that this will modify this item by removing all non-loadable attributes and equipment">
                  <template #activator="{ props }">
                    <v-btn
                      v-if="item.BrewController.MissingBrews.length"
                      v-bind="props"
                      size="small"
                      variant="plain"
                      icon
                      color="secondary"
                      @click="fixMissing(item)">
                      <v-icon size="x-large" icon="mdi-auto-fix" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore, PilotStore, NpcStore } from '@/stores';
import { Pilot, ContentPack } from '@/class';
import { IBrewable } from '@/classes/components/brew/IBrewable';

export default {
  name: 'missing-content-pane',
  computed: {
    missingPacks(): ContentPack[] {
      return CompendiumStore().ContentPacks.filter((x) => x.Missing) as ContentPack[];
    },

    missingLength() {
      return this.allPilots.length + this.allNpcs.length;
    },

    allPilots() {
      return PilotStore().Pilots.filter((x) => x.BrewController.HasError);
    },
    allNpcs() {
      return NpcStore().Npcs.filter((x) => x.BrewController.HasError);
    },
    allItems() {
      return (this.allPilots as any[]).concat(this.allNpcs as any[]);
    },
  },
  methods: {
    deleteItem(item) {
      if (item.ItemType === 'Pilot') PilotStore().DeletePilotPermanent(item);
      else if (item.ItemType === 'npc') NpcStore().DeleteNpcPermanent(item);
    },
    fixMissing(item) {
      item.BrewController.FixMissing();
    },
    getMissingDependencies(pack: ContentPack) {
      return pack.Dependencies.map((dep) => {
        return {
          name: dep.name,
          version: dep.version.includes('=')
            ? dep.version.replace('=', '')
            : dep.version + ' or later',
          link: dep.link,
          installed: CompendiumStore().packAlreadyInstalled(dep.name, dep.version),
        };
      }).filter((x) => !x.installed);
    },
  },
};
</script>
