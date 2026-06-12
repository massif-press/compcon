<template>
  <square-map-editor v-if="gridType === 'Square'"
    ref="mapCanvas"
    :size-x="Number(sizeX)"
    :size-y="Number(sizeY)"
    :cell-type="spaceType"
    :cell-subtype="subtype"
    :map="encounter.Map"
    @save-as-image="saveAsImage($event)" />
  <hex-map-horizontal-editor v-else-if="gridType === 'HexH'"
    ref="mapCanvas"
    :size-x="Number(sizeX)"
    :size-y="Number(sizeY)"
    :cell-type="spaceType"
    :cell-subtype="subtype"
    :map="encounter.Map"
    @save-as-image="saveAsImage($event)" />
  <hex-map-vertical-editor v-else
    ref="mapCanvas"
    :size-x="Number(sizeX)"
    :size-y="Number(sizeY)"
    :cell-type="spaceType"
    :cell-subtype="subtype"
    :map="encounter.Map"
    @save-as-image="saveAsImage($event)" />
  <v-row class="px-3 mt-n6"
    justify="space-between">
    <v-col cols="auto"
      class="text-center text-caption">
      <v-row>
        <!-- <v-col cols="auto">
          <v-icon size="small" icon="mdi-mouse-left-click-outline" class="mr-1" />Paint
        </v-col> -->
        <v-col cols="auto">
          <v-icon icon="mdi-mouse-left-click-outline"
            class="mr-1" />
          {{ $t('gm.map.pan') }}
        </v-col>
        <v-col cols="auto">
          <v-icon icon="mdi-mouse-scroll-wheel"
            class="mr-1" />
          {{ $t('gm.map.zoom') }}
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="auto">
      <v-btn color="accent"
        size="x-small"
        variant="outlined"
        @click="$refs.mapCanvas.resetView()">
        {{ $t('gm.map.resetView') }}
      </v-btn>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="accent"
            size="x-small"
            variant="outlined">
            <v-icon size="small"
              icon="mdi-upload"
              start />
            {{ $t('common.import') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-file-input accept="text/json"
              variant="outlined"
              label="Select Data File"
              prepend-icon="mdi-paperclip"
              density="compact"
              clearable
              @change="stageImport" />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="accent"
              text
              @click="showImportDialog = false">{{ $t('common.cancel') }}</v-btn>
            <v-spacer />
            <v-btn color="success"
              text
              :disabled="!stagedMap?.MapType"
              @click="importStagedMap()">
              {{ $t('common.import') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-col>
    <v-col cols="auto">
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="accent"
            size="x-small"
            variant="outlined">
            <v-icon size="small"
              icon="mdi-download"
              start />
            {{ $t('common.export') }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item title="Save as Image"
            @click="saveAsImage" />
          <v-list-item title="Export Data"
            @click="exportMap" />
        </v-list>
      </v-menu>
    </v-col>
  </v-row>

  <div class="pa-3">
    <v-row align="center">
      <v-col>
        <v-select placeholder="Select Map"
          density="compact"
          hide-details />
      </v-col>
      <v-col>
        <v-btn variant="tonal"
          color="accent">{{ $t('gm.map.load') }}</v-btn>
      </v-col>
      <v-col v-if="!showEditor"
        cols="auto">
        <v-dialog v-model="showEditorDialog"
          persistent
          max-width="800">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              color="primary"
              text>{{ $t('gm.map.openEditor') }}</v-btn>
          </template>
          <v-card>
            <v-toolbar density="compact"
              color="warning">
              <v-toolbar-title>{{ $t('common.warning') }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert icon="mdi-alert"
                prominent
                variant="outlined">
                {{ $t('gm.map.experimentalWarning') }}
              </v-alert>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn color="accent"
                text
                @click="showEditorDialog = false">{{ $t('common.cancel') }}</v-btn>
              <v-spacer />
              <v-btn color="success"
                text
                @click="allowEditor()">{{ $t('common.continue') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>

  <div v-if="showEditor"
    class="pa-3">
    <v-row>
      <v-col>
        <v-btn-toggle v-model="gridType"
          density="compact"
          divided
          color="primary"
          mandatory>
          <v-btn value="Square">
            <v-icon start
              icon="mdi-square-outline" />
            {{ $t('gm.map.square') }}
          </v-btn>
          <v-btn value="HexV">
            <v-icon start
              icon="mdi-hexagon-outline" />
            {{ $t('gm.map.hexV') }}
          </v-btn>
          <v-btn value="HexH">
            <v-icon start
              icon="mdi-hexagon-outline"
              class="mdi-rotate-90" />
            {{ $t('gm.map.hexH') }}
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col cols="2">
        <v-text-field v-model="sizeX"
          density="compact"
          hide-details
          label="Size X"
          dense
          type="number" />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="sizeY"
          density="compact"
          hide-details
          label="Size Y"
          dense
          type="number" />
      </v-col>

      <v-col cols="auto"
        align-self="end">
        <v-btn color="error"
          size="x-small"
          variant="tonal"
          fade-select
          @click="clear">
          {{ $t('gm.map.clearMap') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <v-row>
      <v-col>
        <div class="text-caption">{{ $t('gm.map.palette') }}</div>
        <v-btn-toggle v-model="spaceType"
          density="compact"
          variant="outlined"
          color="accent"
          mandatory>
          <v-btn value="deployment">
            <v-icon icon="mdi-square"
              color="red"
              start />
            {{ $t('gm.map.deployment') }}
          </v-btn>
          <v-btn value="ingress">
            <v-icon icon="mdi-square"
              color="blue"
              start />
            {{ $t('gm.map.ingress') }}
          </v-btn>
          <v-btn value="egress">
            <v-icon icon="mdi-square"
              color="green"
              start />
            {{ $t('gm.map.egress') }}
          </v-btn>
          <v-btn value="objective">
            <v-icon icon="mdi-square"
              color="amber"
              start />
            {{ $t('gm.map.objective') }}
          </v-btn>
          <v-divider vertical />
          <v-btn value="obstruction">
            <v-icon icon="mdi-square"
              color="grey"
              start />
            {{ $t('gm.map.obstruction') }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col>
        <div class="text-caption">{{ $t('gm.map.type') }}</div>
        <v-btn-toggle v-model="subtype"
          density="compact"
          variant="outlined"
          color="accent"
          :disabled="disableSubtype"
          multiple>
          <v-btn value="player">
            <v-icon start
              icon="cc:pilot" />
            {{ $t('gm.map.player') }}
          </v-btn>
          <v-btn value="enemy">
            <v-icon start
              icon="cc:encounter" />
            {{ $t('gm.map.enemy') }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </div>

  <v-footer border
    app>
    <v-spacer />
    <v-btn variant="tonal"
      color="accent"
      prepend-icon="mdi-content-save"
      @click="saveAndExit">
      {{ $t('common.saveAndExit') }}
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import SquareMapEditor from './SquareMap.vue'
import HexMapHorizontalEditor from './HexMapHorizontal.vue'
import HexMapVerticalEditor from './HexMapVertical.vue'
import { EncounterMap } from '@/classes/encounter/EncounterMap'
import { UserStore } from '@/stores'
import { ImportData } from '@/io/Data'
import logger from '@/user/logger'

const props = withDefaults(defineProps<{ encounter?: Record<string, any> }>(), {})
const emit = defineEmits<{ exit: [] }>()

const mapCanvas = ref<any>(null)

const sizeX = ref(30)
const sizeY = ref(12)
const gridType = ref('Square')
const spaceType = ref('deployment')
const subtype = ref<any[]>([])
const showEditorDialog = ref(false)
const showEditor = ref(false)
const stagedMap = ref<any>(null)

const mapData = computed(() => mapCanvas.value?.mapData)
const disableSubtype = computed(() => ['obstruction', 'difficult', 'dangerous'].includes(spaceType.value))

watch(disableSubtype, (disabled) => { if (disabled) subtype.value = [] })
watch(showEditor, (val) => { if (!val) return; UserStore().User.SetView('ShowMapEditor', val) })
watch(sizeX, (val) => { if (val && mapData.value) mapData.value.SizeX = val })
watch(sizeY, (val) => { if (val && mapData.value) mapData.value.SizeY = val })
watch(gridType, (val) => { if (val && mapData.value) mapData.value.MapType = val })

onMounted(() => {
  const user = UserStore().User
  if (user?.View) showEditor.value = user.View('ShowMapEditor', false)
  if (props.encounter?.Map) {
    sizeX.value = props.encounter.Map.SizeX
    sizeY.value = props.encounter.Map.SizeY
    gridType.value = props.encounter.Map.MapType
  }
})

function clear() {
  mapData.value?.Clear()
  mapCanvas.value?.DrawGrid()
}
function allowEditor() {
  showEditorDialog.value = false
  showEditor.value = true
}
function saveAsImage() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const imageName = `${props.encounter?.Name}_map`
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.setAttribute('download', imageName + '.png')
  link.setAttribute('href', canvas.toDataURL().replace('image/png', 'image/octet-stream'))
  link.click()
}
function exportMap() {
  const map = EncounterMap.Serialize(mapCanvas.value?.mapData)
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(map))}`
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.setAttribute('download', `${props.encounter?.Name}_map.json`)
  link.setAttribute('href', dataStr)
  link.click()
}
async function stageImport(file: any) {
  if (!file) return
  const data = await ImportData(file.target.files[0])
  try {
    stagedMap.value = EncounterMap.Deserialize(data)
  } catch (e) {
    logger.error(`Error parsing map data: ${e}`, null)
  }
}
function importStagedMap() {
  spaceType.value = stagedMap.value.MapType
  sizeX.value = stagedMap.value.SizeX
  sizeY.value = stagedMap.value.SizeY
  mapCanvas.value.mapData = stagedMap.value
  mapCanvas.value?.DrawGrid()
}
function saveAndExit() {
  if (props.encounter) {
    props.encounter.Map = mapCanvas.value?.mapData
    props.encounter.save()
  }
  emit('exit')
}
</script>
