<template>
  <cc-compendium-browser :items="filteredFrames"
    item-type="Frame"
    :options="options"
    :manufacturers="manufacturers"
    view-key="sel-new-mech-frame"
    equippable
    @equip="select($event)">
    <template #header>
      <div class="heading h4 text-center text-accent">{{ $t('pm.sheet.selectNewFrame') }}</div>
    </template>

    <template #top>
      <v-row justify="end">
        <v-col cols="auto">
          <cc-switch v-model="showAll"
            :label="$t('pm.fields.showAllFrames')"
            color="error" />
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>

  <cc-modal v-model="nameDialog"
    shrink
    :title="$t('pm.titles.registerNewMech')"
    icon="cc:frame">
    <v-row justify="center">
      <v-col cols="11"
        md="8">
        <span class="text-overline">{{ $t('pm.sheet.xk401REGISTERMECHNAME') }}</span>
        <v-text-field v-model="mechName"
          variant="outlined"
          :label="$t('pm.fields.name')"
          hide-details
          tile>
          <template #prepend>
            <v-tooltip :text="$t('pm.tooltips.generateRandomName2')"
              location="top">
              <template #activator="{ props }">
                <cc-button v-bind="props"
                  color="accent"
                  icon="mdi-dice-multiple"
                  variant="outlined"
                  @click="randomName()"></cc-button>
              </template>
            </v-tooltip>
          </template>
          <template #append>
            <v-icon v-if="!mechName"
              color="error">
              mdi-alert
            </v-icon>
            <v-icon v-else
              color="success">
              mdi-check-circle-outline
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <div class="py-4">
      <cc-button block
        color="accent"
        size="small"
        prepend-icon="cc:frame"
        append-icon="mdi-check"
        class="px-10"
        :disabled="!mechName"
        @click="addMech()">
        {{ $t('pm.sheet.registerNewMech') }}
      </cc-button>
    </div>
  </cc-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es'
import { CompendiumStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { Frame } from '@/classes/mech/components/frame/Frame'
import { Mech } from '@/classes/mech/Mech'
import { ItemType } from '@/classes/enums'
import { mechname } from '@/io/Generators'
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent'

const props = defineProps<{
  pilot: Pilot
}>()

const emit = defineEmits<{
  'close': []
}>()

const nameDialog = ref(false)
const mechName = ref('')
const showAll = ref(false)
const selectedFrame = ref(null as any)
const options = ref({
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'cards',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
    })
const headers = ref([
      { title: 'Manufacturer', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'Size' },
      { title: 'Armor', key: 'Armor' },
      { title: 'HP', key: 'HP' },
      { title: 'Evasion', key: 'Evasion' },
      { title: 'EDef', key: 'EDefense' },
      { title: 'HeatCap', key: 'HeatCap' },
      { title: 'RepCap', key: 'RepCap' },
      { title: 'Sensors', key: 'SensorRange' },
      { title: 'TechAtk', key: 'TechAttack' },
      { title: 'Save', key: 'SaveTarget' },
      { title: 'Speed', key: 'Speed' },
      { title: 'SP', key: 'SP' },
    ])

const manufacturers = computed(() => {
      return CompendiumStore().Manufacturers;
    })
const allFrames = computed(() => {
      if (!props.pilot.LcpConfig) return CompendiumStore().Frames
      return CompendiumStore().Frames.filter(
        x => {
          if (!x.InLcp) return true
          let target = x
          if (x.Variant) {
            const baseFrame = CompendiumStore().Frames.find(y => y.Name === x.Variant)
            if (baseFrame) target = baseFrame
          }
          return props.pilot.LcpConfig?.packList.some(y => y.packID === target.Brew?.LcpId) ||
            props.pilot.LcpConfig?.packList.some(y => y.packName === target.Brew?.LcpName)
        }

      )
    })
const filteredFrames = computed(() => {
      if (showAll.value) return allFrames.value.filter(x => !x.IsHidden)

      return props.pilot.LicenseController.AllowedItems(ItemType.Frame)
    })

function select(frame: Frame) {
      nameDialog.value = true
      selectedFrame.value = frame
    }
async function randomName() {
      mechName.value = await mechname()
    }
function addMech() {
      const newMech = new Mech(selectedFrame.value, props.pilot)
      newMech.Name = mechName.value
      props.pilot.AddMech(newMech)
      AchievementEventSystem.emit('add_mech')
      mechName.value = ''
      selectedFrame.value = null
      showAll.value = false
      nameDialog.value = false
      emit('close')
    }
</script>
