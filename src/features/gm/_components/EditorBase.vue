<template>
  <div v-show="item">
    <v-card class="rounded-0 pb-12 elevation-0"
      color="transparent">
      <v-container style="position: relative">
        <div style="position: absolute; top: 0; right: 0">
          <cc-config-tip v-if="item.LcpConfig"
            :actor="item" />
          <cc-brew-info v-else-if="item.BrewController"
            :controller="item.BrewController" />
        </div>
        <v-row>
          <v-col cols="12"
            md="9">
            <slot name="builder" />
            <div v-if="!readonly || (readonly && item.Description?.length > 0)">
              <div class="text-cc-overline">{{ $t('gm.editorBase.descriptionHeading', { type: typeText }) }}</div>
              <cc-rich-text-area :key="item.ID"
                v-model="item.Description"
                :readonly="readonly" />
            </div>
            <slot name="stats" />
          </v-col>
          <v-col cols="12"
            md="3"
            class="ml-auto pt-4">
            <v-row dense>
              <v-col cols="6"
                md="12">
                <gm-folder-editor v-if="!item.IsInstance"
                  :readonly="readonly"
                  :item="item"
                  class="mb-1" />
                <gm-label-editor v-if="!item.IsInstance"
                  :readonly="readonly"
                  :item="item"
                  class="mb-1" />
                <cc-dialog v-if="!isNarrativeItem"
                  :close-on-click="false">
                  <template #activator="{ open }">
                    <cc-button size="x-small"
                      block
                      :disabled="readonly"
                      prepend-icon="mdi-list-status"
                      class="mb-3"
                      color="primary"
                      @click="open">
                      {{ $t('gm.editorBase.setLcpConfig') }}
                    </cc-button>
                  </template>
                  <lcp-config-selector :actor="item" />
                </cc-dialog>
              </v-col>
              <v-col cols="6"
                md="12">
                <cc-img :src="item.PortraitController.Image" />
                <cc-modal v-if="!readonly"
                  :title="$t('gm.titles.selectImage')">
                  <template #activator="{ open }">
                    <cc-button size="x-small"
                      block
                      prepend-icon="mdi-image-edit"
                      color="primary"
                      @click="open">
                      {{ $t('common.changeImage') }}
                    </cc-button>
                  </template>
                  <cc-image-selector ref="imageSelector"
                    :item="item"
                    type="doodad"
                    @set="item.PortraitController.Image = $event" />
                </cc-modal>
              </v-col>
              <v-col v-if="!readonly || (readonly && item.Note.length)"
                cols="12">
                <v-divider v-if="!mobile"
                  class="my-3" />
                <cc-text-area v-model="item.Note"
                  :readonly="readonly"
                  color="primary"
                  variant="outlined"
                  :label="$t('gm.gmNotes').toLowerCase()" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <slot />
      </v-container>
    </v-card>
  </div>

  <editor-footer v-if="!hideFooter"
    :item="item"
    @print="routePrint($event)"
    @export="$emit('export', $event)"
    @exit="$emit('exit')"
    @convert="convert()">
    <template #footer>
      <slot name="footer" />
    </template>
  </editor-footer>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@/util/notify'
import GmLabelEditor from './_subcomponents/GMLabelEditor.vue'
import GmFolderEditor from './_subcomponents/GMFolderEditor.vue'
import EditorFooter from './_subcomponents/EditorFooter.vue'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { UserStore } from '@/stores'
import LcpConfigSelector from '@/features/pilot_management/PilotSheet/components/LcpConfigSelector.vue'
import { useDisplay } from 'vuetify';

defineOptions({ name: 'GmEditorBase' })

const { smAndDown: mobile, xs: portrait } = useDisplay()
const router = useRouter()

const props = withDefaults(defineProps<{
  showDescription?: boolean
  item: object
  readonly?: boolean
  hideToolbar?: boolean
  hideFooter?: boolean
  footerOffset?: boolean
}>(), {
  readonly: false,
  hideToolbar: false,
  hideFooter: false,
  footerOffset: false
})

const emit = defineEmits<{
  'exit': []
  'save': []
  'add-new': []
  'copy': []
  'delete': []
  'export': [payload: any]
}>()

const imageSelector = ref<any>(null)

const printDialog = ref(false)
const dupeMenu = ref(false)
const deleteMenu = ref(false)
const convertMenu = ref(false)
const loading = ref(false)

const typeText = computed(() => {
      if (!props.item) return 'ERR'
      return props.item.ItemType.toUpperCase()
    })
const isAuthed = computed(() => {
      return UserStore().IsLoggedIn
    })
const isNarrativeItem = computed(() => {
      const narrativeTypes = ['character', 'location', 'faction']
      return narrativeTypes.includes(props.item.ItemType.toLowerCase())
    })

function deleteItem() {
      emit('delete')
    }
function copy() {
      emit('copy')
      emit('exit')
    }
function routePrint(id: string) {
      const narrativeTypes = ['character', 'location', 'faction']
      if (narrativeTypes.includes(props.item.ItemType.toLowerCase()))
        router.push(`/gm/print/narrative/${JSON.stringify([id])}`)
      else router.push(`/gm/print/npcs/${JSON.stringify([id])}`)
    }
async function remoteUpdate() {
      try {
        await CloudController.UpdateRemote(props.item)
        await UserStore().refreshDbData()
        notify({
          title: t('notify.share.syncCompleteTitle'),
          text: t('notify.transfer.itemSynced', { type: props.item.ItemType, name: props.item.Name }),
          icon: 'mdi-cloud-check-variant', color: 'success-darken-2',
        })
      } catch (err) {
        notify({
          title: t('notify.share.syncFailedTitle'),
          text: t('notify.transfer.itemSyncFailed', { type: props.item.ItemType, name: props.item.Name, err }),
          icon: 'mdi-alert', color: 'error',
        })
      }
    }
async function convert() {
      loading.value = true
      UserStore().deleteRemoteItem(props.item.SaveController.RemoteCode)
      props.item.CloudController.GenerateMetadata()
      props.item.SaveController.ClearRemote()
      await UserStore().refreshDbData()
      loading.value = false
    }
function copyCode() {
      navigator.clipboard.writeText(props.item.CloudController.ShareCode)
      notify({
        title: t('notify.common.copied'),
        text: t('notify.shareCode.copiedText'),
        icon: 'mdi-clipboard-check', color: 'success',
      })
    }
</script>
