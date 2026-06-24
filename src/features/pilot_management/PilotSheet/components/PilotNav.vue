<template>
  <!-- Mobile nav -->
  <v-bottom-navigation v-if="mobile"
    :height="xs ? 20 : 40"
    style="border-radius: 12px; left: 12px; right: 12px; width: auto; bottom: calc(env(safe-area-inset-bottom, 0px) + 8px); box-shadow: 0 4px 16px rgba(0,0,0,0.4);">
    <v-tabs grow
      center
      density="compact"
      :height="xs ? 20 : 40"
      bg-color="primary"
      show-arrows
      center-active
      hide-slider>
      <v-tab variant="text"
        :class="selected === 1 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 1"
        @click="$emit('to', 1)">
        {{ $t('pm.sheet.narrative') }}
      </v-tab>
      <v-tab v-if="hasBonds"
        variant="text"
        :size="xs ? 'small' : ''"
        :class="selected === 2 ? 'bg-white' : ''"
        :selected="selected === 2"
        @click="$emit('to', 2)">
        {{ $t('pm.sheet.bonds') }}
      </v-tab>
      <v-tab variant="text"
        :class="selected === 3 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 3"
        @click="$emit('to', 3)">
        {{ $t('pm.sheet.tactical') }}
      </v-tab>
      <v-tab variant="text"
        :class="selected === 4 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 4"
        @click="$emit('to', 4)">
        {{ $t('pm.sheet.hangar') }}
      </v-tab>
      <v-tab variant="text"
        :class="selected === 5 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 5"
        @click="$emit('to', 5)">
        {{ $t('common.options') }}
      </v-tab>
    </v-tabs>
  </v-bottom-navigation>

  <!-- Desktop nav -->
  <div v-else
    class="nav-body elevation-8">
    <div id="cap" />
    <div class="d-inline">
      <nav-item :selected="selected === 1"
        @click="$emit('to', 1)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pm.actions.pilotSkillTriggersReservesAnd')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pm.sheet.narrativePROFILE') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item v-if="hasBonds"
        :selected="selected === 2"
        @click="$emit('to', 2)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('common.pilotBonds')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pm.sheet.bonds') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item :selected="selected === 3"
        @click="$emit('to', 3)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pm.actions.pilotLicensesMechSkillsCore')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pm.sheet.tacticalPROFILE') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
      <nav-item :selected="selected === 4"
        @click="$emit('to', 4)">
        <v-tooltip open-delay="300"
          location="top"
          :text="$t('pm.actions.createAndModifyMechsAndTheirLoadouts')">
          <template #activator="{ props }">
            <span v-bind="props">{{ $t('pm.sheet.mechHangar') }}</span>
          </template>
        </v-tooltip>
      </nav-item>
    </div>

    <div id="divider" />

    <v-tooltip v-if="pilot.IsRemote"
      open-delay="300"
      location="top"
      :text="isAuthed
        ? pilot.CloudController.isSynced
          ? 'Pilot is up to date with remote data'
          : 'Download all remote changes to this pilot, overwriting local data.'
        : 'Must be logged in to update'">
      <template #activator="{ props }">
        <v-btn icon
          variant="text"
          size="x-small"
          class="unskew ml-3"
          :disabled="!isAuthed"
          :loading="loading"
          v-bind="props"
          @click="remoteUpdate()">
          <v-icon :icon="pilot.CloudController.isSynced ? 'mdi-cloud-check-variant' : 'mdi-cloud-refresh'" />
        </v-btn>
      </template>
    </v-tooltip>

    <cc-dialog v-else
      :title="$t('pm.titles.sharePilotData')"
      icon="cc:pilot"
      :close-on-click="false">
      <template #activator="{ open }">
        <v-tooltip open-delay="300"
          location="top"
          :text="isAuthed ? 'Share Pilot Data' : 'Requires Cloud Account'">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-btn icon
                variant="plain"
                size="x-small"
                class="unskew ml-6"
                :disabled="!isAuthed"
                @click="open">
                <v-icon color="white">mdi-broadcast</v-icon>
              </v-btn>
            </span>
          </template>
        </v-tooltip>
      </template>
      <share-dialog :item="pilot" />
    </cc-dialog>

    <v-tooltip open-delay="300"
      location="top"
      :text="$t('pm.sheet.pilotOptions')">
      <template #activator="{ props }">
        <edit-menu :pilot="pilot"
          class="unskew"
          size="x-small"
          v-bind="props"
          style="display: inline-block" />
      </template>
    </v-tooltip>

    <div id="end-cap"
      :class="bondClass" />
  </div>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { notify } from '@/util/notify'
import EditMenu from './PilotEditMenu.vue'
import ShareDialog from '@/shared/ShareDialog.vue'
import { Pilot } from '@/classes/pilot/Pilot'
import { CompendiumStore, UserStore } from '@/stores'
import NavItem from '../../_components/NavItem.vue'
import { CloudController } from '@/classes/components/cloud/CloudController'

const router = useRouter()
const _display = useDisplay()
const { smAndDown: mobile } = useDisplay()

defineOptions({ name: 'PilotNav' })

const props = defineProps<{
  pilot: Pilot
  selected: number
}>()

const emit = defineEmits<{
  'to': []
}>()

const loading = ref(false)

const xs = computed(() => _display.smAndDown.value)
const bondClass = computed(() => hasBonds.value ? 'bonds' : 'nobonds')
const isAuthed = computed(() => UserStore().IsLoggedIn)
const hasBonds = computed(() => CompendiumStore().Bonds.length > 0)

function delete_pilot() {
  props.pilot.SaveController.Delete()
  router.push('/pilot_management')
}

async function remoteUpdate() {
  if (!isAuthed.value) return
  if (!props.pilot.CloudController.isSynced) {
    notify({
      title: t('notify.pilot.upToDateTitle'),
      text: t('notify.pilot.upToDateText', { callsign: props.pilot.Callsign, name: props.pilot.Name }),
      data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
    })
  } else {
    try {
      await CloudController.UpdateRemote(props.pilot)
      await UserStore().refreshDbData()
      notify({
        title: t('notify.share.syncCompleteTitle'),
        text: t('notify.pilot.syncedText', { callsign: props.pilot.Callsign, name: props.pilot.Name }),
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      notify({
        title: t('notify.share.syncFailedTitle'),
        text: t('notify.pilot.syncFailedText', { callsign: props.pilot.Callsign, name: props.pilot.Name, err }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }
}
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  left: 12px;
  min-height: 19px;
  padding-left: 20px;
  padding-right: 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  z-index: 10;
}

#cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 70px;
  height: 30px;
  left: -50px;
  top: 0;
  z-index: 9;
}

#end-cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 5px;
  height: 32px;
  top: 0;
  z-index: 9;
  transition: background-color 0.2s ease-in-out;
}

#end-cap.bonds { left: 650px; }
#end-cap.nobonds { left: 580px; }

#divider {
  width: 2px;
  min-width: 2px;
  height: 32px;
  right: 95px;
  top: 0;
  z-index: 11;
  background-color: white;
  position: absolute;
}

.unskew { transform: translateZ(0) skew(0.65rad); }

.nav-body:hover #end-cap { background-color: rgb(var(--v-theme-accent)); }
</style>
