<template>
  <v-container>
    <div class="heading h3 py-0 px-2">Pilot Options</div>
    <cc-button block
      size="large"
      color="panel"
      prepend-icon="mdi-printer"
      @click="$router.push(`/print/${pilot.ID}`)">
      Print
      <template #subtitle>
        <span class="text-cc-overline">Print tabletop-ready character and mech sheets</span>
      </template>
    </cc-button>

    <br />

    <cc-modal title="Statblock Generator"
      icon="mdi-code-block-tags">
      <template #activator="{ open }">
        <cc-button block
          size="large"
          color="panel"
          prepend-icon="mdi-file-document-outline"
          @click="open">
          Generate Statblock
          <template #subtitle>
            <span class="text-cc-overline">
              Get a plaintext representation of this character's build
            </span>
          </template>
        </cc-button>
      </template>
      <statblock-dialog :pilot="pilot" />
    </cc-modal>
    <br />

    <cc-button v-if="!pilot.IsRemote"
      block
      size="large"
      color="panel"
      prepend-icon="mdi-download"
      @click="exportPilot()">
      Export Pilot
      <template #subtitle>
        <span class="text-cc-overline">Export this pilot as a JSON file</span>
      </template>
    </cc-button>
    <cc-button v-if="!pilot.IsRemote"
      block
      size="small"
      color="panel"
      prepend-icon="mdi-download"
      @click="exportPilot(true)">
      Export Legacy JSON
      <template #subtitle>
        <span class="text-cc-overline">Export this pilot as a v2 JSON file compatible with VTT
          systems and v2 apps</span>
      </template>
    </cc-button>
    <br />

    <cc-dialog v-if="!pilot.IsRemote"
      title="Share Pilot Data"
      icon="cc:pilot"
      :close-on-click="false">
      <template #activator="{ open }">
        <v-tooltip open-delay="300"
          location="top"
          :text="isAuthed ? 'Share Pilot Data' : 'Requires Cloud Account'">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              block
              size="large"
              color="panel"
              prepend-icon="mdi-code-block-brackets"
              @click="open()">
              Share Pilot
              <template #subtitle>
                <span class="text-cc-overline">Share this pilot's data with other users via a share
                  code</span>
              </template>
            </cc-button>
          </template>
        </v-tooltip>
      </template>
      <share-dialog :item="pilot" />
    </cc-dialog>

    <br />

    <cc-dialog v-if="pilot.IsRemote"
      :close-on-click="false"
      title="convert remote pilot"
      icon="cc:pilot">
      <template #activator="{ open }">
        <cc-button block
          color="panel"
          prepend-icon="mdi-content-copy"
          @click="open">
          Convert to Local
          <template #subtitle>
            <span class="text-cc-overline">
              Convert this Pilot to an editable local data instance
            </span>
          </template>
        </cc-button>
      </template>
      <template #default="{ close }">
        <cc-confirmation full-width
          content="Converting this pilot to local data will allow local editing but remove its
                    remote link to the author's cloud account, and prevent any further updates from
                    being received. To re-enable remote syncing, you will have to re-import this
                    pilot via its share code."
          cancellable
          @confirm="convert()"
          @cancel="close" />
      </template>
    </cc-dialog>

    <cc-modal v-else
      title="Clone Pilot"
      icon="mdi-dna">
      <template #activator="{ open }">
        <cc-button size="large"
          block
          color="panel"
          prepend-icon="mdi-dna"
          @click="open">
          Clone
          <template #subtitle>
            <span class="text-cc-overline">Duplicate or Flash Clone this character</span>
          </template>
        </cc-button>
      </template>
      <template #default="{ close }">
        <clone-dialog :pilot="pilot"
          @close="close" />
      </template>
    </cc-modal>

    <br />
    <cc-modal title="Set LCP Configuration"
      icon="mdi-list-status">
      <template #activator="{ open }">
        <cc-button size="large"
          block
          color="panel"
          prepend-icon="mdi-list-status"
          @click="open">
          Set LCP Configuration
          <template #subtitle>
            <span class="text-cc-overline">
              Manage which content packs are accessible to this pilot
            </span>
          </template>
        </cc-button>
      </template>
      <lcp-config-selector :actor="pilot" />
    </cc-modal>

    <br />

    <cc-button v-if="pilot.IsRemote"
      block
      size="large"
      color="panel"
      :loading="loading"
      :disabled="pilot.CloudController.isSynced"
      prepend-icon="mdi-cloud-sync"
      @click="remoteUpdate()">
      Download Latest Data
      <template #subtitle>
        <span class="text-cc-overline">
          {{
            pilot.CloudController.isSynced
              ? 'Pilot is up to date with remote data'
              : 'Download all remote changes to this pilot, overwriting local data.'
          }}
        </span>
      </template>
    </cc-button>
    <br />

    <cc-dialog :close-on-click="false"
      title="confirm pilot deletion"
      icon="cc:pilot">
      <template #activator="{ open }">
        <cc-button v-if="!pilot.IsRemote"
          block
          size="large"
          color="error"
          prepend-icon="mdi-delete"
          @click="open">
          Delete Pilot
          <template #subtitle>
            <span class="text-cc-overline">Remove this pilot from the roster</span>
          </template>
        </cc-button>
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
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Pilot } from '@/classes/pilot/Pilot'
import CloneDialog from './components/CloneDialog.vue'
import StatblockDialog from './components/StatblockDialog.vue'
import LcpConfigSelector from './components/LcpConfigSelector.vue'
import { useMobile } from '@/composables/useMobile'
import ShareDialog from '@/shared/ShareDialog.vue'
import { usePilotActions } from './usePilotActions'

defineOptions({ name: 'MobileOptionsMenu' })

const props = defineProps<{
  pilot: Pilot
}>()

const emit = defineEmits<{ close: [] }>()

const { mobile, portrait } = useMobile()
const { exportPilot, remoteUpdate, convert } = usePilotActions(props)

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const deleteDialog = ref(false)

function delete_pilot(close?: Function) {
  props.pilot.SaveController.Delete()
  if (close) close()
  if (route.path !== '/pilot_management') router.push('/pilot_management')
}
</script>
