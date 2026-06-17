<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-progress-check"
        @click="props.onClick($event)">
        {{ $t('active.endEnc.endEncounter') }}
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end"
              class="mt-n1 ml-2"
              start />
            {{ $t('active.endEnc.confirmEndEncounter') }}
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">// {{ $t('active.encMgr.afterActionReport') }}</div>
          <v-card color="background"
            class="mt-1 mb-4">
            <v-card-text class="pa-2">
              <v-row v-for="c in actionReport"
                :key="c.id"
                dense
                align="center">
                <v-col><cc-chip :bg-color="c.pilotStatus ? 'info' : 'primary'"
                    size="large"
                    flat
                    tile><span class="heading h3 text-text pr-3">{{ c.name
                    }}</span></cc-chip></v-col>
                <v-col cols="auto"
                  v-if="c.status"><v-combobox v-model="c.status"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="npcStatusTypes" /></v-col>
                <v-col cols="auto"
                  v-if="c.pilotStatus"><v-combobox v-model="c.pilotStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="pilotStatusTypes" /></v-col>
                <v-col cols="auto"
                  v-if="c.mechStatus"><v-combobox v-model="c.mechStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="mechStatusTypes" /></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="text-cc-overline">// {{ $t('common.result') }}</div>
          <v-row>
            <v-col>
              <v-combobox v-model="result"
                :items="['PC VICTORY', 'ENEMY VICTORY', 'STALEMATE']"
                variant="outlined"
                density="compact" />
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          <v-slide-y-reverse-transition>
            <cc-alert v-if="confirm"
              color="warning"
              variant="outlined"
              :title="$t('active.titles.confirmEndEncounter')"
              icon="mdi-alert-outline"
              class="mb-4">
              <p class="text-text">{{ confirmMessage }}</p>
            </cc-alert>
          </v-slide-y-reverse-transition>
          <v-row>
            <v-col>
              <cc-button block
                v-if="!confirm"
                size="small"
                color="primary"
                @click="confirm = true">{{ $t('active.endEnc.endEncounterLower') }}</cc-button>
              <cc-button block
                v-else
                size="small"
                color="warning"
                @click="$emit('end', result)">{{ $t('active.endEnc.confirmEndEncounterLower')
                }}</cc-button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  actionReport: any[]
  confirmMessage: string
}>()

defineEmits<{
  'end': [result: string]
}>()

const confirm = ref(false)
const result = ref('PC VICTORY')
const pilotStatusTypes = ref([
  'COMBAT EFFECTIVE',
  'INJURED',
  'KIA',
  'MIA',
  'ESCAPED',
  'DISENGAGED',
])
const npcStatusTypes = ref([
  'OPERATIONAL',
  'DESTROYED',
  'ESCAPED',
  'DISENGAGED',
])
const mechStatusTypes = ref([
  'OPERATIONAL',
  'DESTROYED',
  'DESTROYED - REACTOR MELTDOWN',
])
</script>
