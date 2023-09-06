<template>
  <v-container>
    <!-- <v-btn @click="adddebug()">add debug achievement</v-btn>
    {{ user.Achievements }} {{ allUnlocked }} -->
    <v-row align="center">
      <v-col cols="auto">
        <v-icon size="70" :icon="`cc:achievement_${aRank}`" />
      </v-col>
      <v-col>
        <v-progress-linear
          :model-value="(allUnlocked.length / nsAchievements.length) * 100"
          height="30"
          rounded="xl"
          color="accent"
        >
          <span class="text-overline"
            >{{ ((allUnlocked.length / nsAchievements.length) * 100).toFixed(2) }}%</span
          >
        </v-progress-linear>
        <div class="text-overline text-right text-disabled">
          {{ allUnlocked.length }} of {{ nsAchievements.length }} unlocked
          <v-btn icon size="x-small" variant="plain" @click="showDetail = !showDetail"
            ><v-icon size="20" :icon="showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          /></v-btn>
          <v-expand-transition>
            <v-card v-if="showDetail" variant="outlined">
              <v-card-text>
                <div class="text-overline text-center font-weight-bold">By Rarity:</div>
                <div v-for="(r, i) in rarities">
                  <v-progress-linear
                    :model-value="(byRarity(i + 1).has / byRarity(i + 1).total) * 100"
                    height="25px"
                    class="my-2"
                    rounded="md"
                    :color="getColor({ unlocked: true, rarity: i + 1 })"
                  >
                    <span style="text-transform: capitalize">{{ r }} </span>
                  </v-progress-linear>
                  <div class="text-caption font-italic mt-n2">
                    {{ byRarity(i + 1).has }} / {{ byRarity(i + 1).total }} ({{
                      ((byRarity(i + 1).has / byRarity(i + 1).total) * 100).toFixed(2)
                    }}%)
                  </div>
                </div>
                <v-divider class="my-2" />
                <div class="text-overline text-center font-weight-bold">By Label:</div>
                <v-row dense>
                  <v-col v-for="l in labels" cols="6">
                    <v-progress-linear
                      :model-value="(byLabel(l).has / byLabel(l).total) * 100"
                      height="20px"
                      color="primary"
                    >
                      {{ l }}
                    </v-progress-linear>
                    <div class="text-caption font-italic">
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
    <v-row>
      <v-col>
        <div class="text-overline mb-n5">DISPLAY:</div>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-btn-toggle
              v-model="showRarity"
              color="accent"
              multiple
              density="compact"
              class="py-1"
            >
              <v-btn size="small"> Common </v-btn>
              <v-btn size="small"> Epic </v-btn>
              <v-btn size="small"> Legendary </v-btn>
              <v-btn size="small"> Mythic </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="auto">
            <v-btn-toggle v-model="showLock" color="accent" multiple density="compact" class="py-1">
              <v-btn size="small"> Locked </v-btn>
              <v-btn size="small"> Unlocked </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="auto">
            <v-btn-toggle
              v-model="showHidden"
              color="accent"
              multiple
              density="compact"
              class="py-1"
            >
              <v-btn size="small"> Hidden </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-select
          v-model="showLabels"
          :items="labels"
          multiple
          density="compact"
          variant="outlined"
          class="mt-2"
        >
          <template #selection="{ item, index }">
            <v-chip size="small" v-if="index < 11">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 11" class="text-grey text-caption align-self-center">
              &emsp;(+{{ showLabels.length - 11 }} others)
            </span>
          </template>

          <template #prepend-item>
            <v-list-item title="Select All">
              <template v-slot:prepend>
                <v-checkbox-btn
                  :model-value="showLabels.length === labels.length"
                  :indeterminate="showLabels.length > 0 && showLabels.length < labels.length"
                  @click="setAllLabels()"
                />
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-select>
      </v-col>
      <v-col class="text-right">
        <div class="text-overline">SORT:</div>
        <v-btn color="primary" size="small" class="mr-3" @click="sort = 'none'"> None </v-btn>
        <v-btn
          color="primary"
          size="small"
          class="mr-3"
          @click="sort = sort === 'name_asc' ? 'name_desc' : 'name_asc'"
        >
          Name
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          class="mr-3"
          @click="sort = sort === 'rarity_asc' ? 'rarity_desc' : 'rarity_asc'"
        >
          Rarity
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          class="mr-3"
          @click="sort = sort === 'date_asc' ? 'date_desc' : 'date_asc'"
        >
          Date Unlocked
        </v-btn>
      </v-col>
    </v-row>
    <v-card
      v-for="a in shownAchievements"
      v-show="!a.secret || a.unlocked"
      variant="tonal"
      :color="getColor(a)"
      rounded="lg"
      class="ma-2"
      style="border: 2px solid"
      :style="a.secret ? `background: linear-gradient(90deg, #991E2A 0%, #673AB7 100%);` : ''"
    >
      <v-row align="center" :style="a.unlocked ? '' : 'opacity: 0.4'">
        <v-col cols="auto">
          <v-icon size="70" :icon="`cc:achievement_${a.rarity}`" />
        </v-col>
        <v-col v-if="!a.hidden">
          <div class="heading h3 text-text">{{ decode(a.name) }}</div>
          <div class="text-text">{{ decode(a.description) }}</div>
        </v-col>
        <v-col v-else>
          <div class="heading h3 text-text">[ DATA REDACTED ]</div>
          <div class="text-text">This achievement is hidden and will be revealed once unlocked</div>
        </v-col>
        <v-col v-if="a.unlocked" cols="auto" class="text-center mx-6">
          <div class="text-caption"><span v-if="a.secret">SECRET ACHIEVEMENT </span>UNLOCKED</div>
          <div class="heading">{{ formatDate(a.unlocked) }}</div>
        </v-col>
      </v-row>
    </v-card>
    <div v-if="hiddenAchievements" class="text-right text-caption px-4">
      <i>{{ hiddenAchievements }} achievement{{ hiddenAchievements === 1 ? '' : 's' }} not shown</i>
    </div>

    <v-row class="text-center">
      <v-col cols="auto">
        <v-btn size="small" color="primary" variant="elevated" @click="exportBackup()">
          Create Achievement Backup
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-dialog v-model="importDialog" width="50%">
          <template #activator="{ props }">
            <v-btn size="x-small" color="error" variant="outlined" class="mx-6" v-bind="props">
              Load Achievement Backup
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="pa-6">
              <p class="text-center">
                This will
                <b class="text-accent">OVERWRITE ALL</b>
                user achievement data.
                <br /><br />
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
                @change="importBackup()"
              />
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="clearDialog" width="50%">
          <template #activator="{ props }">
            <v-btn size="x-small" color="error" variant="outlined" v-bind="props">
              Reset Achievements
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="pa-6">
              <p class="text-center">
                This will
                <b class="text-accent">ERASE ALL</b>
                user achievement data.
                <br /><br />
                This
                <b class="text-accent">cannot</b>
                be undone. It is strongly recommended to create a backup first.
              </p>
              <v-btn color="error" block class="mt-4" @click="clearAchievements()"
                >Reset Achievements</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import * as dict from '@/assets/achievementsDict.json';
import { decrypt, encrypt } from '@/util/Decode';

import { UserStore } from '@/stores';

export default {
  name: 'AchievementsViewer',
  data: () => ({
    achievements: [] as any[],
    showRarity: [0, 1, 2, 3],
    showLock: [0, 1],
    showHidden: [0],
    showLabels: [] as string[],
    sort: 'none',
    showDetail: false,
    rarities: ['Common', 'Epic', 'Legendary', 'Mythic'],
    importDialog: false,
    clearDialog: false,
    fileValue: null as any,
  }),
  watch: {
    userAchievements: {
      handler() {
        this.updateAchievements();
      },
      deep: true,
    },
  },
  mounted() {
    this.updateAchievements();
  },
  computed: {
    user() {
      return UserStore().UserProfile;
    },
    userAchievements() {
      return this.user.Achievements;
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
        if (!this.showRarity.includes(a.rarity - 1)) return false;
        if (!this.showLock.includes(a.unlocked ? 1 : 0)) return false;
        if (!this.showHidden.length && a.hidden) return false;

        return true;
      });

      shown = shown.filter((a) => a.labels.some((l) => this.showLabels.includes(l)));

      switch (this.sort) {
        case 'name_asc':
          return _.orderBy(shown, (a) => decrypt(a.name).toLowerCase(), 'asc');
        case 'name_desc':
          return _.orderBy(shown, (a) => decrypt(a.name).toLowerCase(), 'desc');
        case 'rarity_asc':
          return _.orderBy(shown, (a) => a.rarity, 'asc');
        case 'rarity_desc':
          return _.orderBy(shown, (a) => a.rarity, 'desc');
        case 'date_asc':
          return _.orderBy(shown, (a) => a.unlocked, 'asc');
        case 'date_desc':
          return _.orderBy(shown, (a) => a.unlocked, 'desc');
        default:
          return shown;
      }
    },
    hiddenAchievements() {
      return this.nsAchievements.length - this.shownAchievements.length;
    },
    nsAchievements() {
      return this.achievements.filter((a) => !a.secret);
    },
    labels() {
      return _.uniq(this.achievements.flatMap((a) => a.labels));
    },
    allUnlocked() {
      return this.achievements.filter((x) => x.unlocked);
    },
    allUnlockedSecret() {
      return this.achievements.filter((x) => x.unlocked && x.secret);
    },
  },
  methods: {
    updateAchievements() {
      this.achievements = (dict as any).default;

      this.userAchievements.forEach((ua) => {
        const idx = this.achievements.findIndex((a) => a.id === encrypt(ua.id));
        console.log(idx);
        if (idx !== -1) {
          this.achievements[idx].unlocked = ua.unlocked;
        }
      });

      this.showLabels = this.labels;
    },
    getColor(a: any) {
      if (!a.unlocked) {
        return 'grey-darken-2';
      }
      if (a.secret) {
        return '#FFDF00';
      }
      switch (a.rarity) {
        case 1:
          return 'blue-accent-4';
        case 2:
          return 'purple-darken-2';
        case 3:
          return 'deep-orange-accent-4';
        case 4:
          return 'red-accent-4';

        default:
          return 'primary';
      }
    },
    formatDate(date: number) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Date(date).toLocaleString(undefined, options as any);
    },
    decode(str: any) {
      return decrypt(str);
    },
    setAllLabels() {
      if (this.showLabels.length === this.labels.length) {
        this.showLabels = [];
      } else {
        this.showLabels = this.labels;
      }
    },
    adddebug() {
      this.user.AddAchievement('9999999999999999');
    },
    byRarity(rarity: number) {
      return {
        has: this.achievements.filter((a) => a.rarity === rarity).filter((a) => a.unlocked).length,
        total: this.nsAchievements.filter((a) => a.rarity === rarity).length,
      };
    },
    byLabel(label: string) {
      return {
        has: this.achievements.filter((a) => a.labels.includes(label)).filter((a) => a.unlocked)
          .length,
        total: this.nsAchievements.filter((a) => a.labels.includes(label)).length,
      };
    },
    exportBackup() {
      const jsonBlob = new Blob([JSON.stringify(this.user.Achievements)], {
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
      this.user.Achievements = data;
      this.updateAchievements();
      this.importDialog = false;
    },
    clearAchievements() {
      this.user.Achievements = [];
      this.updateAchievements();
      this.clearDialog = false;
    },
  },
};
</script>
