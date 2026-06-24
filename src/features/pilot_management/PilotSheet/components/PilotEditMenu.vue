<template>
  <div>
    <v-btn icon
      :size="size"
      variant="plain"
      @click.native.stop>
      <v-icon icon="mdi-cog"
        color="white"
        size="large" />
      <v-menu v-model="menu"
        activator="parent">
        <v-card tile
          border>
          <v-toolbar density="compact"
            color="primary"
            height="46">
            <div v-if="!dense"
              class="heading h3 py-0 px-2">
              {{ $t('pm.sheet.pilotOptions') }}
            </div>
          </v-toolbar>
          <v-list :lines="mobile ? 'one' : 'two'"
            subheader
            color="panel"
            density="compact"
            slim>
            <v-list-item :title="$t('common.print')"
              prepend-icon="mdi-printer"
              :subtitle="$t('pm.sheet.printTabletopReadyCharacterAndMech')"
              @click="$router.push(`/print/${pilot.ID}`)" />
            <cc-modal :title="$t('pm.titles.statblockGenerator')"
              icon="mdi-code-block-tags">
              <template #activator="{ open }">
                <v-list-item prepend-icon="mdi-file-document-outline"
                  :title="$t('pm.sheet.generateStatblock')"
                  :subtitle="$t('pm.sheet.getAPlaintextRepresentationOfThis')"
                  @click.stop="open" />
              </template>
              <statblock-dialog :pilot="pilot" />
            </cc-modal>
            <v-list-item v-if="!pilot.IsRemote"
              prepend-icon="mdi-export-variant"
              :title="$t('pm.sheet.exportPilot')"
              :subtitle="$t('pm.sheet.exportThisPilotAsAJSON')"
              @click="exportPilot()" />

            <v-list-item v-if="!pilot.IsRemote"
              prepend-icon="mdi-export-variant"
              :title="$t('pm.titles.exportV2Json')"
              :subtitle="$t('pm.subtitles.exportALegacyFormatFor')"
              @click="exportPilot(true)" />


            <cc-dialog v-if="pilot.IsRemote"
              :close-on-click="false"
              :title="$t('pm.titles.convertRemotePilot')"
              icon="cc:pilot">
              <template #activator="{ open }">
                <v-list-item prepend-icon="mdi-content-copy"
                  :title="$t('common.convertToLocal')"
                  :subtitle="$t('pm.subtitles.convertThisPilotToAn')"
                  @click.stop="open" />
              </template>
              <template #default="{ close }">
                <cc-confirmation content="Converting this pilot to local data will allow local editing but remove its
                    remote link to the author's cloud account, and prevent any further updates from
                    being received. To re-enable remote syncing, you will have to re-import this
                    pilot via its share code."
                  cancellable
                  @confirm="convert()"
                  @cancel="close" />
              </template>
            </cc-dialog>

            <cc-modal v-else
              :title="$t('pm.titles.clonePilot')"
              icon="mdi-dna">
              <template #activator="{ open }">
                <v-list-item prepend-icon="mdi-dna"
                  :title="$t('pm.sheet.clone')"
                  :subtitle="$t('pm.sheet.duplicateOrFlashCloneThisCharacter')"
                  @click.stop="open" />
              </template>
              <template #default="{ close }">
                <clone-dialog :pilot="pilot"
                  @close="close" />
              </template>
            </cc-modal>

            <cc-dialog :title="$t('pm.sheet.setLCPConfiguration')"
              :close-on-click="false"
              icon="mdi-list-status">
              <template #activator="{ open }">
                <v-list-item v-if="!pilot.IsRemote"
                  prepend-icon="mdi-list-status"
                  :title="$t('pm.sheet.setLCPConfiguration')"
                  :subtitle="$t('pm.sheet.manageWhichContentPacksAreAccessible')"
                  @click.stop="open" />
              </template>
              <lcp-config-selector :actor="pilot" />
            </cc-dialog>

            <v-list-item v-if="pilot.IsRemote"
              :loading="loading"
              :disabled="pilot.CloudController.isSynced"
              prepend-icon="mdi-cloud-sync"
              :title="$t('pm.sheet.downloadLatestData')"
              :subtitle="pilot.CloudController.isSynced
                ? 'Pilot is up to date with remote data'
                : 'Download all remote changes to this pilot, overwriting local data.'
                "
              @click="remoteUpdate()" />

            <v-divider />
            <cc-dialog :close-on-click="false"
              :title="$t('pm.titles.confirmPilotDeletion')"
              icon="cc:pilot">
              <template #activator="{ open }">
                <v-list-item :title="$t('common.deletePilot')"
                  :subtitle="$t('pm.sheet.removeThisPilotFromTheRoster')"
                  @click.stop="open">
                  <template #prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                </v-list-item>
              </template>
              <template #default="{ close }">
                <cc-confirmation full-width
                  :content="`Lancer, please confirm deletion of Pilot Registration Information for:<br/>
          <span class='text-accent'>
            ${pilot.Callsign} (${pilot.Name}, LL${pilot.Level})
          </span>`"
                  cancellable
                  @confirm="delete_pilot(close)"
                  @cancel="close" />
              </template>
            </cc-dialog>
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CloneDialog from './CloneDialog.vue'
import StatblockDialog from './StatblockDialog.vue'
import LcpConfigSelector from './LcpConfigSelector.vue'
import { useDisplay } from 'vuetify'
import { usePilotActions } from '../usePilotActions'

defineOptions({ name: 'EditMenu' })

const props = withDefaults(defineProps<{
  pilot: Pilot
  light?: boolean
  dense?: boolean
  size?: string
}>(), {
  size: 'small',
})

defineEmits<{ close: [] }>()

const { smAndDown: mobile, xs: portrait } = useDisplay()
const { exportPilot, remoteUpdate, convert } = usePilotActions(props)

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const deleteDialog = ref(false)
const menu = ref(false)

function delete_pilot(close?: Function) {
  menu.value = false
  ;(props.pilot as any).SaveController.Delete()
  if (close) close()
  if (route.path !== '/pilot_management') router.push('/pilot_management')
}
</script>
