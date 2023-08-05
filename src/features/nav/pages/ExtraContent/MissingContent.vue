<template>
  <div>
    <v-row density="compact" class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">DATA ANALYSIS</v-col>
    </v-row>
    <v-slide-x-reverse-transition>
      <v-expansion-panels v-if="!loading" class="mt-2">
        <v-expansion-panel :disabled="!missingLength && !missingPacks.length">
          <v-expansion-panel-title v-if="!missingLength && !missingPacks.length" class="heading h4">
            <span>
              <v-icon color="success" class="mt-n1">mdi-check-bold</v-icon>
              No Issues Detected
            </span>
          </v-expansion-panel-title>
          <v-expansion-panel-title v-else class="heading h3 text-stark">
            <span>
              <span class="text-error">{{ missingLength }}</span>
              {{ missingLength > 1 ? 'issues' : 'issue' }} detected
            </span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="body-text">
              COMP/CON has determined the following items cannot be loaded, and require Lancer
              Content Packs that are not installed or not activated:
            </p>
            <v-container v-if="missingPacks.length">
              <div v-for="pack in missingPacks">
                Lancer Content Pack <b>{{ pack.Name }}</b> cannot be loaded because it is missing
                the following dependencies:
                <ul class="py-2 pl-8">
                  <li v-for="dep in getMissingDependencies(pack)">
                    <b>{{ dep.name }}</b> at version <b>{{ dep.version }}</b>
                    <a v-if="dep.link" :href="dep.link" target="_blank" class="pl-2">[link]</a>
                  </li>
                </ul>
              </div>
            </v-container>
            <div v-for="key in Object.keys(missing)">
              <v-card variant="outlined" v-for="item in missing[key]">
                <v-card-title v-if="key === 'pilots'" class="heading h3 mb-n4">
                  Pilot Data:
                  <span class="text-primary">
                    {{ item.callsign }}
                    <cc-slashes />
                    {{ item.name }}
                  </span>
                </v-card-title>
                <v-card-title v-if="key === 'npcs'" class="heading h3 mb-n4">
                  NPC Data:
                  <span class="text-primary">
                    {{ item.class }}
                    <cc-slashes />
                    {{ item.name }}
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div v-if="notActive(item.brews).length">
                        <div class="caption">DEACTIVATED LCPS</div>
                        <div v-for="pack in notActive(item.brews)" class="ml-2">
                          <span class="body-text">
                            LCP
                            <b v-text="pack" />
                            is installed but deactivated.
                          </span>
                        </div>
                      </div>
                      <div v-if="notInstalled(item.brews).length">
                        <div v-if="item.brews[0].LcpName">
                          <div class="caption mt-2">MISSING LCPS</div>
                          <div v-for="brew in notInstalled(item.brews)" class="ml-2">
                            <span class="body-text">
                              LCP
                              <b v-text="`${brew.LcpName} @ ${brew.LcpVersion}`" />
                              is missing.
                            </span>
                            <div v-if="brew.Website">
                              It may be possible to download this pack at:
                              <a target="_blank" :href="brew.Website" v-text="brew.Website" />
                            </div>
                            <auto-updater :brew="brew" @update="forceUpdate(item, key)" />
                          </div>
                        </div>
                        <div v-else>
                          <div v-for="brew in notInstalled(item.brews)" class="ml-2">
                            <span class="body-text">
                              LCP
                              <b v-text="brew" />
                              is missing.
                            </span>
                            <div>This data was saved with an older version of COMP/CON.</div>
                            <auto-updater :brew="brew" @update="forceUpdate(item, key)" />
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="auto" align-self="center">
                      <cc-tooltip
                        inline
                        title="Delete Item"
                        content="Delete this item from local data"
                      >
                        <v-btn icon color="error" @click="deleteItem(item, key)">
                          <v-icon icon="mdi-delete" />
                        </v-btn>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        title="Force Load"
                        content="Force COMP/CON to load this data. This is useful if you have outdated (but loadable) data, or COMP/CON has made a mistake in analyzing LCP content."
                      >
                        <v-btn icon color="secondary" @click="forceItem(item, key)">
                          <v-icon icon="mdi-download-box" />
                        </v-btn>
                      </cc-tooltip>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import { CompendiumStore, PilotStore, NpcStore } from '@/stores';
import { Pilot, ContentPack } from '@/class';
import AutoUpdater from './components/AutoUpdater.vue';

export default {
  name: 'missing-content-pane',
  components: { AutoUpdater },
  data: () => ({
    loading: false,
  }),
  computed: {
    missing() {
      return CompendiumStore().MissingContent;
    },

    missingPacks(): ContentPack[] {
      return CompendiumStore().ContentPacks.filter((x) => x.Missing) as ContentPack[];
    },

    missingLength() {
      if (!this.missing && !this.missingPacks) return 0;
      return (
        (this.missing.pilots?.length || 0) +
        (this.missing.npcs?.length || 0) +
        this.missingPacks.length
      );
    },
  },
  methods: {
    notActive(itemBrews) {
      return CompendiumStore()
        .ContentPacks.filter((x) => itemBrews.some((y) => y.LcpId === x.ID))
        .map((p) => `${p.Name} @ ${p.Version}`);
    },
    notInstalled(itemBrews) {
      return itemBrews.filter((x) => CompendiumStore().ContentPacks.some((y) => y.ID === x.LcpId));
    },
    deleteItem(item, key) {
      if (key === 'pilots') {
        PilotStore().DeleteMissingPilot(item);
      } else if (key === 'npcs') {
        NpcStore().DeleteMissingNpc(item);
      }
    },
    forceItem(item, key) {
      if (key === 'pilots') {
        Pilot.AddNew(item);
        PilotStore().DeleteMissingPilot(item);
      } else if (key === 'npcs') {
        NpcStore().DeleteMissingNpc(item);
      }
    },
    forceUpdate(item, key) {
      item.brews.splice(0, item.brews.length);
      this.forceItem(item, key);
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
