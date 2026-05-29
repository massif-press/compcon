<template>
  <v-container>
    <div class="heading h2 mb-1">{{ cr.lancerBy }}</div>
    <v-row>
      <dev-badge v-for="(c, cIdx) in credits.writers"
        :key="`writer-${cIdx}`"
        :info="c" />
    </v-row>
    <div class="heading h2 mt-4 mb-1">{{ cr.compconBy }}</div>
    <v-row>
      <dev-badge v-for="(c, cIdx) in credits.lead_devs"
        :key="`lead-${cIdx}`"
        :info="c" />
    </v-row>
    <div class="heading h3 mt-4 mb-1">{{ cr.with }}</div>
    <v-row dense>
      <dev-badge v-for="(c, cIdx) in credits.devs1"
        :key="`dev1-${cIdx}`"
        :info="c" />
    </v-row>
    <v-row dense>
      <dev-badge v-for="(c, cIdx) in credits.devs2"
        :key="`dev2-${cIdx}`"
        :info="c" />
    </v-row>
    <div class="heading h2 mt-4 mb-1">{{ cr.graphicDesignBy }}</div>
    <v-row dense>
      <dev-badge v-for="(c, cIdx) in credits.graphics"
        :key="`graphic-${cIdx}`"
        :info="c" />
    </v-row>
    <div class="heading h2 mt-4 mb-1">{{ cr.additionalArtBy }}</div>
    <v-row dense>
      <dev-badge v-for="(c, cIdx) in credits.art"
        :key="`art-${cIdx}`"
        :info="c" />
    </v-row>
    <div class="text-center mt-8">
      <span class="heading h3">
        {{ cr.patronThanks }}
        <a v-html-safe="'support'"
          target="_blank"
          href="https://www.patreon.com/compcon" />
        {{ cr.supportOf }}
      </span>
    </div>

    <div v-if="loading"
      class="text-center">
      <v-progress-circular :size="80"
        :width="5"
        color="primary"
        indeterminate />
    </div>
    <div v-else>
      <div v-for="t in tiers"
        :key="t"
        class="mb-6">
        <cc-title small
          class="my-2">{{ t.toUpperCase() }} {{ cr.tier }}</cc-title>
        <v-row align="center"
          justify="space-around"
          dense>
          <v-col
            v-for="(p, pIdx) in patrons.filter((x) => x.tier.toLowerCase().includes(t.toLowerCase()))"
            :key="`patron-${pIdx}`"
            cols="12"
            :md="getCols(t)">
            <v-chip border
              class="heading h3 rounded-e-0 cc-panel-clip"
              :class="t.toLowerCase()"
              :size="!mobile ? 'x-large' : 'default'"
              color="background"
              variant="elevated"
              style="width: 100%">
              <v-avatar :color="getColor(t)"
                start>
                <v-icon :icon="`cc:${t.toLowerCase()}`"
                  :size="mobile ? 32 : 40" />
              </v-avatar>
              {{ cleanName(p) }}
            </v-chip>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import creditsData from './credits.json'
import DevBadge from './SupporterBadges/Dev.vue'
import { getPatreonSubscribers } from '@/user/oauth'
import { NAV_STRINGS } from '@/features/nav/strings'

const { smAndDown: mobile } = useDisplay()
const cr = NAV_STRINGS.credits

const credits = creditsData
const patrons = ref<any[]>([])
const tiers = ['MONIST', 'NHP', 'Lancer', 'Cosmopolitan', 'Diasporan']
const loading = ref(true)

onMounted(async () => {
  try {
    patrons.value = await getPatreonSubscribers()
  } catch {
    // subscriber list unavailable (e.g. not logged in)
  }
  loading.value = false
})

function cleanName(patron: any) {
  if (patron.display_name && patron.display_name !== 'N/A') return patron.display_name.trim()
  if (!patron.name) return cr.anonymousPatron
  const name = patron.name.trim()
  if (name === 'John Barker') return 'The Upgrade Factory'

  if (name.includes(' ')) {
    const arr = name.split(' ')
    return arr.map((x: string, i: number) => i === arr.length - 1 ? x.substring(0, 1) + '.' : x).join(' ')
  }
  return name
}

function getColor(tier: string) {
  switch (tier) {
    case 'MONIST': return 'exotic'
    case 'NHP': return 'secondary'
    case 'Lancer': return 'primary'
    case 'Cosmopolitan': return 'info'
    case 'Diasporan': return 'success'
    default: return 'grey'
  }
}

function getCols(tier: string) {
  switch (tier) {
    case 'MONIST': return 12
    case 'NHP':
    case 'Lancer': return 6
    case 'Cosmopolitan': return 4
    default: return 4
  }
}
</script>

<style scoped>
.monist {
  background: linear-gradient(to right,
      rgb(var(--v-theme-exotic)) 0%,
      rgb(var(--v-theme-surface)) 99%);
}

.nhp {
  background: linear-gradient(to right,
      rgb(var(--v-theme-secondary)) 0%,
      rgb(var(--v-theme-surface)) 99%);
}

.lancer {
  background: linear-gradient(to right,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-surface)) 99%);
}

.cosmopolitan {
  background: linear-gradient(to right,
      rgb(var(--v-theme-info)) 0%,
      rgb(var(--v-theme-surface)) 99%);
}

.diasporan {
  background: linear-gradient(to right,
      rgb(var(--v-theme-success)) 0%,
      rgb(var(--v-theme-surface)) 99%);
}
</style>
