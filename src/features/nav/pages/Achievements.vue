<template>
  <v-card-text>
    <!-- <v-btn @click="adddebug()">add debug achievement</v-btn>
    {{ user.Achievements }} {{ allUnlocked }} -->
    <v-row align="center">
      <v-col v-if="!showDetail" cols="auto">
        <v-icon size="70" :icon="`cc:achievement_${aRank}`" />
      </v-col>
      <v-col>
        <v-progress-linear
          :model-value="(allUnlocked.length / nsAchievements.length) * 100"
          height="30"
          tile
          color="accent"
          @click="showDetail = !showDetail">
          <span class="text-cc-overline">
            {{ ((allUnlocked.length / nsAchievements.length) * 100).toFixed(2) }}%
          </span>
        </v-progress-linear>

        <div class="text-cc-overline text-right text-disabled">
          {{ allUnlocked.length }} of {{ nsAchievements.length }} unlocked
          <v-btn icon size="x-small" variant="plain" @click="showDetail = !showDetail">
            <v-icon size="20" :icon="showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </v-btn>
          <v-expand-transition>
            <v-card v-if="showDetail" variant="outlined" flat tile>
              <v-card-text>
                <div class="text-cc-overline text-center font-weight-bold">By Rarity:</div>
                <div v-for="(r, i) in rarities">
                  <v-progress-linear
                    :model-value="(byRarity(i + 1).has / byRarity(i + 1).total) * 100"
                    height="25px"
                    class="my-2"
                    tile
                    :color="rarityColors[i]">
                    <span style="text-transform: capitalize">{{ r }}</span>
                  </v-progress-linear>
                  <div v-if="!mobile" class="text-caption font-italic mt-n2">
                    {{ byRarity(i + 1).has }} / {{ byRarity(i + 1).total }} ({{
                      ((byRarity(i + 1).has / byRarity(i + 1).total) * 100).toFixed(2)
                    }}%)
                  </div>
                </div>
                <v-divider class="my-2" />
                <div class="text-cc-overline text-center font-weight-bold">By Label:</div>
                <v-row dense>
                  <v-col v-for="l in labels" cols="6">
                    <v-progress-linear
                      :model-value="(byLabel(l).has / byLabel(l).total) * 100"
                      height="20px"
                      color="primary">
                      {{ l }}
                    </v-progress-linear>
                    <div v-if="!mobile" class="text-caption font-italic">
                      {{ byLabel(l).has }} / {{ byLabel(l).total }} ({{
                        ((byLabel(l).has / byLabel(l).total) * 100).toFixed(2)
                      }}%)
                    </div>
                  </v-col>
                  <v-col v-if="allUnlockedSecret.length > 0" cols="6">
                    <v-progress-linear :model-value="100" height="20px" color="deep-purple">
                      Secret Achievements
                    </v-progress-linear>
                    <div class="text-caption font-italic">
                      {{ allUnlockedSecret.length }} Discovered
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <div class="text-cc-overline ml-n2">DISPLAY:</div>
        <v-row justify="space-between" dense>
          <v-col>
            <v-btn-toggle
              v-model="showRarity"
              color="primary"
              multiple
              flat
              tile
              density="compact"
              class="py-1">
              <v-btn size="small">Common</v-btn>
              <v-btn size="small">Epic</v-btn>
              <v-btn size="small">Legendary</v-btn>
              <v-btn size="small">Mythic</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-btn-toggle
              v-model="showLock"
              color="primary"
              flat
              tile
              multiple
              density="compact"
              class="py-1">
              <v-btn size="small">Locked</v-btn>
              <v-btn size="small">Unlocked</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="auto">
            <v-btn-toggle
              v-model="showHidden"
              color="primary"
              multiple
              flat
              tile
              density="compact"
              class="py-1">
              <v-btn size="small">Hidden</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-select
          v-model="showLabels"
          :items="labels"
          multiple
          flat
          tile
          density="compact"
          variant="outlined"
          class="mt-2">
          <template #selection="{ item, index }">
            <v-chip size="small" v-if="index < (mobile ? 7 : 11)">
              <span>{{ item.title }}</span>
            </v-chip>
            <span
              v-if="index === (mobile ? 7 : 11)"
              class="text-grey text-caption align-self-center">
              &emsp;(+{{ showLabels.length - (mobile ? 7 : 11) }} others)
            </span>
          </template>

          <template #prepend-item>
            <v-list-item title="Select All">
              <template v-slot:prepend>
                <v-checkbox-btn
                  :model-value="showLabels.length === labels.length"
                  :indeterminate="showLabels.length > 0 && showLabels.length < labels.length"
                  @click="setAllLabels()" />
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-select>
      </v-col>
      <v-col cols="12">
        <div class="text-cc-overline ml-n2">SORT:</div>
        <v-btn color="primary" size="x-small" flat tile @click="sort = 'none'">None</v-btn>
        <v-btn
          color="primary"
          size="x-small"
          flat
          tile
          @click="sort = sort === 'name_asc' ? 'name_desc' : 'name_asc'">
          Name
        </v-btn>
        <v-btn
          color="primary"
          size="x-small"
          flat
          tile
          @click="sort = sort === 'rarity_asc' ? 'rarity_desc' : 'rarity_asc'">
          Rarity
        </v-btn>
        <v-btn
          color="primary"
          size="x-small"
          flat
          tile
          @click="sort = sort === 'date_asc' ? 'date_desc' : 'date_asc'">
          Date Unlocked
        </v-btn>
        <div class="pt-2">
          <cc-text-field
            v-model="search"
            color="primary"
            clearable
            :width="mobile ? 320 : 480"
            variant="outlined"
            icon="mdi-magnify" />
        </div>
      </v-col>
    </v-row>
    <v-container class="pt-1" :class="mobile && 'px-0'">
      <achievement-item v-for="a in shownAchievements" :item="a" />
      <div v-if="hiddenAchievements > 0" class="text-right text-caption px-4">
        <i>
          {{ hiddenAchievements }} achievement{{ hiddenAchievements === 1 ? '' : 's' }} not shown
        </i>
      </div>
    </v-container>

    <v-row class="text-center">
      <v-col cols="auto">
        <cc-button size="small" color="primary" variant="elevated" @click="exportBackup()">
          Create Achievement Backup
        </cc-button>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <cc-dialog v-model="importDialog" :close-on-click="false">
          <template #activator="{ open }">
            <cc-button size="x-small" color="primary" class="mx-3" @click="open">
              Load Achievement Backup
            </cc-button>
          </template>
          <v-card-text class="pa-6">
            <p class="text-center">
              This will
              <b class="text-accent">OVERWRITE ALL</b>
              user achievement data.
              <br />
              <br />
              This
              <b class="text-accent">cannot</b>
              be undone. It is strongly recommended to create a backup first.
            </p>
            <br />
            <v-file-input
              v-model="fileValue"
              accept=".json"
              variant="outlined"
              density="compact"
              hide-details
              autofocus
              label="Select COMP/CON Achievement Export File"
              prepend-icon="mdi-paperclip"
              @change="importBackup()" />
          </v-card-text>
        </cc-dialog>
      </v-col>
      <v-col cols="auto">
        <cc-dialog :close-on-click="false" title="reset achievements">
          <template #activator="{ open }">
            <cc-button size="x-small" color="error" variant="outlined" @click="open()">
              Reset Achievements
            </cc-button>
          </template>
          <template #default="{ close }">
            <v-card-text class="pa-6">
              <p class="text-center">
                This will
                <b class="text-accent">ERASE ALL</b>
                user achievement data.
                <br />
                This
                <b class="text-accent">cannot</b>
                be undone. It is strongly recommended to create a backup first.
              </p>
              <cc-button color="error" block class="mt-4" @click="clearAchievements(close)">
                Reset Achievements
                <template #info>
                  <v-icon icon="mdi-alert" />
                </template>
              </cc-button>
            </v-card-text>
          </template>
        </cc-dialog>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import _ from 'lodash';
import AchievementItem from './_components/AchievementItem.vue';

import { UserStore } from '@/stores';
import { AchievementManager } from '@/user/achievements/AchievementManager';

export default {
  name: 'AchievementsViewer',
  components: {
    AchievementItem,
  },
  data: () => ({
    showRarity: [0, 1, 2, 3],
    showLock: [0, 1],
    showHidden: [0],
    showLabels: [] as string[],
    sort: 'date_desc',
    showDetail: false,
    rarities: ['Common', 'Epic', 'Legendary', 'Mythic'],
    importDialog: false,
    fileValue: null as any,
    search: '',
    rarityColors: [
      'blue-accent-4',
      'purple-darken-2',
      'deep-orange-accent-4',
      '#d4af37',
      'red-accent-4',
    ],
  }),
  emits: ['close'],
  mounted() {
    this.showLabels = this.labels;
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    user() {
      return UserStore().User;
    },
    userAchievements() {
      return AchievementManager.Instance.UserUnlockedAchievements;
    },
    achievements() {
      return AchievementManager.Instance.Achievements;
    },
    aRank() {
      const pct = this.allUnlocked.length / this.nsAchievements.length;
      if (pct > 0.75) {
        return '3';
      } else if (pct > 0.5) {
        return '2';
      }
      return '1';
    },
    shownAchievements() {
      let shown = this.achievements.filter((a) => {
        if (!this.showRarity.includes(a.Rarity - 1)) return false;
        if (!this.showLock.includes(a.Unlocked ? 1 : 0)) return false;
        if (!this.showHidden.length && a.Hidden) return false;

        if (this.search) {
          if (a.Hidden && !a.Unlocked) return false;
          const s = this.search.toLowerCase();
          if (!a.Name.toLowerCase().includes(s) && !a.Description.toLowerCase().includes(s)) {
            return false;
          }
        }

        return true;
      });

      shown = shown.filter((a) => a.Labels.some((l) => this.showLabels.includes(l)));

      switch (this.sort) {
        case 'name_asc':
          return _.orderBy(shown, (a) => a.Name.toLowerCase(), 'asc');
        case 'name_desc':
          return _.orderBy(shown, (a) => a.Name.toLowerCase(), 'desc');
        case 'rarity_asc':
          return _.orderBy(shown, (a) => a.Rarity, 'asc');
        case 'rarity_desc':
          return _.orderBy(shown, (a) => a.Rarity, 'desc');
        case 'date_asc':
          return _.orderBy(shown, (a) => a.Date || Infinity, 'asc');
        case 'date_desc':
          return _.orderBy(shown, (a) => a.Date || -1, 'desc');
        default:
          return shown;
      }
    },
    hiddenAchievements() {
      return this.nsAchievements.length - this.shownAchievements.length - this.extras;
    },
    extras() {
      return this.achievements.filter((a) => a.Secret && !a.Unlocked).length;
    },
    nsAchievements() {
      return this.achievements.filter((a) => !a.Secret);
    },
    labels() {
      return _.uniq(this.achievements.flatMap((a) => a.Labels));
    },
    allUnlocked() {
      return this.achievements.filter((x) => x.Unlocked);
    },
    allUnlockedSecret() {
      return this.achievements.filter((x) => x.Unlocked && x.Secret);
    },
  },
  methods: {
    setAllLabels() {
      if (this.showLabels.length === this.labels.length) {
        this.showLabels = [];
      } else {
        this.showLabels = this.labels;
      }
    },
    byRarity(rarity: number) {
      return {
        has: this.achievements.filter((a) => a.Rarity === rarity).filter((a) => a.Unlocked).length,
        total: this.nsAchievements.filter((a) => a.Rarity === rarity).length,
      };
    },
    byLabel(label: string) {
      return {
        has: this.achievements.filter((a) => a.Labels.includes(label)).filter((a) => a.Unlocked)
          .length,
        total: this.nsAchievements.filter((a) => a.Labels.includes(label)).length,
      };
    },
    exportBackup() {
      const jsonBlob = new Blob([JSON.stringify(this.user.AchievementUnlocks)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(jsonBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cc_achievement_archive.json');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    async importBackup() {
      if (!this.fileValue) return;
      const file = this.fileValue[0];
      const json = await file.text();
      const data = JSON.parse(json);
      this.user.AchievementUnlocks = data;
      this.importDialog = false;
    },
    async clearAchievements(close) {
      console.log('clearing achievements');
      this.user.AchievementUnlocks = [];
      await this.user.save();
      if (UserStore().IsLoggedIn && UserStore().SyncSettings.includeSettings) {
        await UserStore().setUserMetadata();
      }
      window.location.reload();
    },
  },
};
</script>
