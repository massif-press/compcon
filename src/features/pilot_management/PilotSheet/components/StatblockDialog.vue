<template>
  <v-card-text>
    <v-row :class="mobile && 'pt-2'"
      class="mb-4"
      align="center">
      <v-col cols="12"
        md="">
        <cc-select v-model="genRadios"
          :items="genItems"
          label="Generate" />
      </v-col>
      <v-col cols="auto">
        <cc-switch v-model="discordEmoji"
          on-icon="mdi-check"
          off-icon="mdi-cancel" />
      </v-col>
      <v-col cols="auto">
        <div>
          {{ $t('pm.sheet.includePilotNETDiscordEmoji') }}
          <div class="text-caption"
            style="line-height: 8px">
            {{ $t('pm.sheet.doesnTWorkInCodeBlock') }}
          </div>
        </div>
      </v-col>
    </v-row>

    <v-expand-transition>
      <cc-select v-if="genRadios != 'pilotBuild'"
        v-model="selected_mech"
        :items="pilot.Mechs"
        placeholder="N/A"
        density="compact"
        item-title="Name"
        item-value="ID"
        label="Select Mech"
        variant="outlined"
        class="mb-4"
        hide-details />
    </v-expand-transition>

    <v-textarea :value="statblock"
      auto-grow
      readonly
      hide-details
      :rows="mobile ? 14 : 24"
      variant="solo-filled"
      class="flavor-text" />
    <v-tooltip text="Copy stat block to clipboard">
      <template #activator="{ props }">
        <cc-button v-bind="props"
          prepend-icon="mdi-clipboard-text-outline"
          color="primary"
          block
          @click="copy()">
          {{ $t('common.copyToClipboard') }}
        </cc-button>
      </template>
    </v-tooltip>
  </v-card-text>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { notify } from '@/util/notify'
import { Mech } from '@/classes/mech/Mech'
import { Pilot } from '@/classes/pilot/Pilot'
import Statblock from '@/classes/Statblock';
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()
const route = useRoute()

const props = defineProps<{
  pilot: Pilot
  mechID?: string
}>()

const selected_mech = ref(null as any)
const discordEmoji = ref(false)
const genRadios = ref('full')
const genItems = ref([
      { title: 'Full', value: 'full' },
      { title: 'Pilot Only', value: 'pilotBuild' },
      { title: 'Mech Only', value: 'mechBuild' },
    ])

const defaultMechID = computed(() => {
      if (route.name === 'mech-sheet') {
        return props.mechID;
      } else return props.pilot.Mechs[props.pilot.Mechs.length - 1]?.ID;
    })

if (defaultMechID.value === null) genRadios.value = 'pilotBuild';
selected_mech.value = defaultMechID.value;

const mechSelect = computed(() => {
      return selected_mech.value ?? defaultMechID.value;
    })
const mech = computed(() => {
      return mechSelect.value ? props.pilot.Mechs.find((x) => x.ID === mechSelect.value) : null;
    })
const statblock = computed(() => {
      if (genRadios.value != 'mechBuild') {
        return Statblock.Generate(props.pilot, mech.value as Mech, discordEmoji.value, genRadios.value);
      } else
        return Statblock.GenerateBuildSummary(props.pilot, mech.value as Mech, discordEmoji.value);
    })

function clearSelected() {
      selected_mech.value = null;
    }
function show() {
      (dialog.value as any).show();
    }
function hide() {
      (dialog.value as any).hide();
    }
function copy() {
      navigator.clipboard
        .writeText(statblock.value)
        .then(() =>
          notify({
            title: t('notify.statblock.copiedTitle'),
            text: t('notify.statblock.copiedText'),
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          notify({
            title: t('notify.common.error'),
            text: t('notify.statblock.errorText'),
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    }
</script>
