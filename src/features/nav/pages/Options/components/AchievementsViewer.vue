<template>
  <div class="text-overline mb-n5">DISPLAY:</div>
  <v-row>
    <v-col cols="auto">
      <v-btn-toggle v-model="showRarity" color="accent" multiple density="compact" class="py-1">
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
      <v-btn-toggle v-model="showHidden" color="accent" multiple density="compact" class="py-1">
        <v-btn size="small"> Hidden </v-btn>
      </v-btn-toggle>
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
    <v-row align="center">
      <v-col cols="auto">
        <v-icon size="70" :icon="`cc:achievement_${a.rarity}`" />
      </v-col>
      <v-col v-if="!a.hidden">
        <div class="heading h3">{{ a.name }}</div>
        <div>{{ decode(a.description) }}</div>
      </v-col>
      <v-col v-else>
        <div class="heading h3">[ DATA REDACTED ]</div>
        <div>This achievement is hidden and will be revealed once unlocked</div>
      </v-col>
      <v-col v-if="a.unlocked" cols="auto" class="text-center mx-3">
        <div class="text-caption"><span v-if="a.secret">SECRET ACHIEVEMENT </span>UNLOCKED</div>
        <div class="heading h4">{{ formatDate(a.unlocked) }}</div>
      </v-col>
    </v-row>
  </v-card>
  <div v-if="hiddenAchievements" class="text-right text-caption px-4">
    <i>{{ hiddenAchievements }} achievement{{ hiddenAchievements === 1 ? '' : 's' }} not shown</i>
  </div>

  <v-row class="text-center">
    <v-col cols="auto">
      <v-btn size="small" color="accent" variant="elevated" disabled>
        Create Achievement Backup
      </v-btn>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-btn size="x-small" color="error" variant="elevated" class="mx-6" disabled>
        Load Achievement Backup
      </v-btn>
      <v-btn size="x-small" color="error" variant="elevated" disabled> Reset Achievements </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import * as dict from '@/assets/achievementsDict.json';
import { decrypt } from '@/util/Decode';

export default {
  name: 'AchievementsViewer',
  data: () => ({
    achievements: [] as any[],
    showRarity: [0, 1, 2, 3],
    showLock: [0, 1],
    showHidden: [0],
  }),
  mounted() {
    this.achievements = (dict as any).default;
  },
  computed: {
    shownAchievements() {
      const shown = this.achievements.filter((a) => {
        if (!this.showRarity.includes(a.rarity - 1)) return false;
        if (!this.showLock.includes(a.unlocked ? 1 : 0)) return false;
        if (!this.showHidden.length && a.hidden) return false;

        return true;
      });

      return shown;
    },
    hiddenAchievements() {
      return (
        this.achievements.filter((a) => !a.secret).length -
        this.shownAchievements.filter((a) => !a.secret).length
      );
    },
  },
  methods: {
    getColor(a: any) {
      if (!a.date) {
        return 'grey-darken-2';
      }
      if (a.secret) {
        return '#FFDF00';
      }
      if (a.unlocked) {
        return 'green darken-2';
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
      return new Date(date).toLocaleDateString();
    },
    decode(str: any) {
      return decrypt(str);
    },
  },
};
</script>
