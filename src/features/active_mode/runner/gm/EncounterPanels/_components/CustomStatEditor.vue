<template>
  <div>
    <v-row dense
      class="mb-1">
      <v-spacer />
      <v-col cols="auto">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              size="x-small"
              color="primary"
              prepend-icon="cc:compendium">
              {{ $t('active.customStat.editStats') }}
            </cc-button>
          </template>

          <v-card width="300px"
            flat
            tile
            border>
            <v-tabs v-model="menuTab"
              height="24"
              bg-color="primary"
              density="compact">
              <v-tab>{{ $t('active.customStat.trackable') }}</v-tab>
              <v-tab>{{ $t('active.customStat.static') }}</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="menuTab">
                <v-window-item>
                  <v-select v-model="trackableStat"
                    :items="availableTrackableStats"
                    item-value="key"
                    density="compact"
                    hide-details
                    class="mb-2"
                    chips />
                  <v-text-field v-model.number="trackableValue"
                    clearable
                    density="compact"
                    :label="$t('active.fields.statValue')"
                    hide-details />
                  <cc-button block
                    class="my-2"
                    :color="hasStat(trackableStat) ? 'success' : 'primary'"
                    size="small"
                    :disabled="!trackableStat"
                    @click="addTrackableStat()">
                    {{ hasStat(trackableStat) ? $t('common.save') : $t('common.add') }}
                  </cc-button>
                  <cc-button v-if="
                    trackableStat &&
                    isCoreStat(trackableStat) &&
                    hasStat(trackableStat)
                  "
                    block
                    class="my-2"
                    color="error"
                    size="x-small"
                    @click="removeStat(trackableStat.title)">
                    {{ $t('active.customStat.removeStat') }}
                  </cc-button>
                </v-window-item>

                <v-window-item>
                  <v-select v-model="staticStat"
                    :items="availableStaticStats"
                    item-value="key"
                    density="compact"
                    hide-details
                    class="mb-2"
                    chips />
                  <v-text-field v-model.number="staticValue"
                    clearable
                    density="compact"
                    :label="$t('active.fields.statValue')"
                    hide-details />
                  <cc-button block
                    class="my-2"
                    :color="hasStat(staticStat || '') ? 'success' : 'primary'"
                    size="small"
                    :disabled="!staticStat"
                    @click="addStaticStat()">
                    {{ hasStat(staticStat || '') ? $t('common.save') : $t('common.add') }}
                  </cc-button>
                  <cc-button v-if="staticStat && isCoreStat(staticStat) && hasStat(staticStat)"
                    block
                    class="my-2"
                    color="error"
                    size="x-small"
                    @click="removeStat(staticStat)">
                    {{ $t('active.customStat.removeStat') }}
                  </cc-button>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MandatoryStats, StatController } from '@/classes/components/combat/stats/StatController';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';
import { useDisplay } from 'vuetify';
const npcStatOrder = [
'hull',
'agi',
'sys',
'eng',
'size',
'sizes',
'activations',
'structure',
'stress',
'hp',
'speed',
'sensorRange',
'heat',
'armor',
'evasion',
'edef',
'attackBonus',
'techAttack',
'saveTarget',
'grapple',
'ram',
];
const trackable = [
{ title: 'HP', key: 'hp' },
{ title: 'Reactor', key: 'stress' },
{ title: 'Heat Capacity', key: 'heatcap' },
{ title: 'Structure', key: 'structure' },
{ title: 'Repair Capacity', key: 'repairCapacity' },
{ title: 'Overcharge', key: 'overcharge' },
{ title: 'Activations', key: 'activations' },
{ title: 'Speed', key: 'speed' },
];
const statics = [
{ title: 'Hull', key: 'hull' },
{ title: 'Agility', key: 'agi' },
{ title: 'Systems', key: 'sys' },
{ title: 'Engineering', key: 'eng' },
{ title: 'Size', key: 'size' },
{ title: 'Sensor Range', key: 'sensorRange' },
{ title: 'Evasion', key: 'evasion' },
{ title: 'E-Defense', key: 'edef' },
{ title: 'Attack Bonus', key: 'attackBonus' },
{ title: 'Tech Attack', key: 'techAttack' },
{ title: 'Save Target', key: 'saveTarget' },
{ title: 'Grapple', key: 'grapple' },
{ title: 'Ram', key: 'ram' },
];

defineOptions({ name: 'StatEditor' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  item: object
  bonuses?: Bonus[]
  allowCore?: boolean
}>(), {
  bonuses: () => [],
  allowCore: false
})

const trackableStat = ref(undefined)
const trackableValue = ref(0)
const staticStat = ref(undefined)
const staticValue = ref(0)
const menuTab = ref(0)
const hiddenKeys = ref([
      'overcharge',
      'overshield',
      'attackBonus',
      'limitedBonus',
      'heatcap',
      'repairCapacity',
      'saveBonus',
      'resist'
    ])

const controller = computed(() => {
      return props.item.StatController;
    })
const coreStats = computed(() => {
      return StatController.CoreStats;
    })
const availableCoreStats = computed(() => {
      return StatController.CoreStats.filter((x) => x.key !== 'sizes');
    })
const displayKeys = computed(() => {
      const omit = ['overshield', 'overcharge', 'burn'];
      return props.item.StatController.DisplayKeys.filter(
        (x) => !omit.includes(x.key.toLowerCase())
      ).sort((a, b) => npcStatOrder.indexOf(a.key) - npcStatOrder.indexOf(b.key));
    })
const mandatoryStats = computed(() => {
      return MandatoryStats;
    })
const customStats = computed(() => {
      return Object.keys(props.item.StatController.MaxStats).filter(
        (x) => !mandatoryStats.value.includes(x) && !hiddenKeys.value.includes(x.toLowerCase())
      );
    })
const hasStat = computed(() => {
      return (key) => Object.keys(props.item.StatController.MaxStats).includes(key);
    })
const availableTrackableStats = computed(() => {
      return props.allowCore ? trackable : trackable.filter((x) => !isCoreStat(x.title));
    })
const availableStaticStats = computed(() => {
      return props.allowCore ? statics : statics.filter((x) => !isCoreStat(x.title));
    })

function isCoreStat(key) {
      return coreStats.value.map((x) => x.key).includes(key);
    }
function addTrackableStat() {
      if (!trackableStat.value) return;
      const val = Number(trackableValue.value) || 0;
      props.item.StatController.setMax(trackableStat.value, val);
      props.item.StatController.CurrentStats[trackableStat.value] = val;
      props.item.SaveController.save();
      trackableStat.value = undefined;
      trackableValue.value = 0;
    }
function addStaticStat() {
      if (!staticStat.value) return;
      const val = Number(staticValue.value) || 0;
      props.item.StatController.setMax(staticStat.value, val);
      props.item.StatController.CurrentStats[staticStat.value] = val;
      props.item.SaveController.save();
      staticStat.value = undefined;
      staticValue.value = 0;
    }
function removeStat(key) {
      if (!hasStat(key)) return;
      delete props.item.StatController.MaxStats[key];
      delete props.item.StatController.CurrentStats[key];
      props.item.SaveController.save();
    }
</script>
