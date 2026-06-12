<template>
  <div>
    <v-alert v-if="pilot.Status === 'KIA' || pilot.IsDead"
      prominent
      density="compact"
      variant="outlined"
      color="error"
      class="mx-4 mb-4">
      <template #prepend>
        <v-icon size="80"
          icon="mdi-skull" />
      </template>
      <div class="heading h1 text-center">{{ $t('pm.sheet.killedINACTION') }}</div>
      <div v-if="!pilot.IsRemote"
        style="position: relative"
        class="mb-4">
        <div style="position: absolute; bottom: -16px; right: -8px">
          <v-menu offset-y
            offset-x>
            <template #activator="{ props }">
              <v-btn color="secondary"
                size="x-small"
                variant="text"
                v-bind="props">
                {{ $t('pm.sheet.flashClonePilot') }}
              </v-btn>
            </template>
            <cc-confirmation
              content="This will clone the selected pilot. Cloned characters can’t join a mission in progress, and cloned characters receive a random quirk. Additional cloning and subjectivity imprinting adds further quirks."
              @confirm="setQuirk" />
          </v-menu>
          <v-menu offset-y
            offset-x>
            <template #activator="{ props }">
              <v-btn color="accent"
                size="x-small"
                variant="plain"
                class="ml-6"
                v-bind="props">
                {{ $t('pm.sheet.revert') }}
              </v-btn>
            </template>
            <cc-confirmation
              content="This will restore the selected pilot and clear the KIA status."
              @confirm="pilot.Status = 'Active'" />
          </v-menu>
        </div>
      </div>
    </v-alert>
    <div v-if="pilot.Quirks.length && !hideQuirks"
      class="mb-3">
      <section-header title="Clone Quirks" />

      <v-row v-for="(q, i) in pilot.Quirks"
        :key="`quirk_${i}`"
        dense
        align="start"
        class="my-1">
        <v-col>
          <v-alert icon="mdi-dna"
            prominent
            density="compact"
            color="primary"
            class="rounded-s-0">
            <v-textarea v-model="pilot.Quirks[i]"
              density="compact"
              hide-details
              rows="1"
              auto-grow
              variant="solo-filled"
              :readonly="readonly"
              @blur="pilot.SaveController.save()" />
          </v-alert>
        </v-col>
        <v-col cols="auto">
          <v-tooltip text="Remove Clone Quirk">
            <template #activator="{ props }">
              <v-btn icon
                v-bind="props"
                color="error"
                size="x-small"
                variant="plain"
                @click="pilot.RemoveQuirk(i)">
                <v-icon size="large">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { CompendiumStore } from '@/stores';
import SectionHeader from '../../components/SectionHeader.vue';
import * as _ from 'lodash-es';

defineOptions({ name: 'clone-block' })

const props = defineProps<{
  hideQuirks?: boolean
  readonly?: boolean
  pilot: Pilot
}>()

function setQuirk() {
      if (!props.pilot.Callsign.includes('※')) props.pilot.Callsign += '※';
      if (!props.pilot.Callsign.includes('※')) props.pilot.Name += '※';
      const compendium = CompendiumStore();
      props.pilot.AddQuirk(_.sample(compendium.Tables.quirks));
    }
function updateQuirk(index, str) {
      props.pilot.Quirks[index] = str;
    }
</script>
