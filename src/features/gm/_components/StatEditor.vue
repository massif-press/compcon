<template>
  <div class="px-2">
    <v-card flat
      tile
      class="pa-1">
      <v-row v-if="item.StatController.DisplayKeys.length"
        dense>
        <v-col v-for="kvp in displayKeys.filter((x) => !hiddenKeys.includes(x.key))"
          v-show="kvp.key !== 'sizes'"
          :key="item.ID + '_' + kvp.key"
          :style="`min-width: ${mobile ? 'fit-content' : '12vw'}`">
          <editable-attribute :readonly="readonly || !editing"
            :stat="kvp"
            :selections="item.StatController.StatSelections(kvp.key)"
            :val="item.StatController.MaxStats[kvp.key]"
            :deletable="!mandatoryStats.includes(kvp.key)"
            :bonuses="getBonuses(kvp.key)"
            :edited="!!editedKeys[kvp.key]"
            @set="setStat(kvp.key, $event)"
            @remove="item.StatController.RemoveStat($event)" />
        </v-col>
      </v-row>
      <div v-else
        class="text-center text-disabled text-caption pa-2">
        <i>{{ $t('gm.stats.noStats') }}</i>
      </div>
    </v-card>
    <v-row v-if="!readonly"
      dense
      class="mt-2 mb-1">
      <v-col cols="auto">
        <cc-button :color="editing ? 'success' : 'primary'"
          size="small"
          :prepend-icon="editing ? 'mdi-check' : 'mdi-pencil'"
          @click="toggleEditing()">
          {{ editing ? $t('common.done') : $t('common.edit') }}
        </cc-button>
      </v-col>

      <v-col v-if="controller"
        cols="auto"
        class="ml-auto">
        <v-menu v-model="resetMenu"
          :close-on-content-click="false">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              size="small"
              color="error"
              prepend-icon="mdi-undo-variant">
              {{ $t('common.reset') }}
            </cc-button>
          </template>
          <v-card max-width="300px">
            <v-card-text>
              {{ $t('gm.stats.resetConfirm', { tier: controller.Tier, name: controller.Class ? controller.Class.Name : controller.Layer.Name }) }}
            </v-card-text>
            <cc-button block
              size="small"
              class="px-4 mb-2"
              color="error"
              @click="
                controller.ResetStats();
              resetMenu = false;
              ">
              {{ $t('gm.stats.confirmResetStats') }}
            </cc-button>
          </v-card>
        </v-menu>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              size="small"
              color="primary"
              prepend-icon="cc:compendium">
              {{ $t('gm.stats.addStat') }}
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
              <v-tab>{{ $t('gm.stats.core') }}</v-tab>
              <v-tab>{{ $t('gm.stats.custom') }}</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="menuTab">
                <v-window-item>
                  <v-select v-model="statsToAdd"
                    :items="availableCoreStats"
                    item-value="key"
                    multiple
                    clearable
                    density="compact"
                    hide-details
                    chips />
                  <cc-button block
                    class="my-2"
                    color="primary"
                    size="small"
                    :disabled="!statsToAdd.length"
                    @click="addCoreStats()">
                    {{ $t('common.add') }}
                    <span v-if="statsToAdd.length">{{ $t('gm.stats.statCountSuffix', { n: statsToAdd.length }) }}</span>
                  </cc-button>
                </v-window-item>
                <v-window-item>
                  <v-text-field v-model="customTitle"
                    clearable
                    density="compact"
                    label="Stat Name"
                    hide-details />
                  <cc-button block
                    color="primary"
                    class="my-2"
                    size="small"
                    @click="addCustomStat()">
                    {{ $t('common.add') }}
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
import { Stats } from '@/classes/components/combat/stats/Stats';
import EditableAttribute from './_subcomponents/EditableAttribute.vue';
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
'heatcap',
'armor',
'evasion',
'edef',
'attackBonus',
'techAttack',
'saveTarget',
'grapple',
'ram',
];

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  item: object
  controller?: object
  bonuses?: Bonus[]
  prefix?: string
  readonly?: boolean
  tierOverride?: number
}>(), {
  bonuses: () => [],
  prefix: '',
  readonly: false,
  tierOverride: 0
})

const statsToAdd = ref([])
const menuTab = ref(0)
const customTitle = ref('')
const resetMenu = ref(false)
const editing = ref(false)
const hiddenKeys = ref([
      'overcharge',
      'overshield',
      'attackBonus',
      'limitedBonus',
      'repairCapacity',
      'saveBonus',
      'heat',
    ])

const coreStats = computed(() => {
      return StatController.CoreStats;
    })
const availableCoreStats = computed(() => {
      return StatController.CoreStats.filter(
        (x) => !props.item.StatController.DisplayKeys.some((y) => y.key === x.key)
      ).filter((x) => x.key !== 'sizes');
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
const editedKeys = computed(() => {
      if (!props.controller?.getClassStats) return {}
      const maxStats = props.item.StatController.MaxStats
      const result: Record<string, boolean> = {}
      props.controller.getClassStats().forEach(({ key, val }) => {
        if (maxStats[key] !== undefined && maxStats[key] !== val) {
          result[key] = true
        }
      })
      return result
    })

function getBonuses(key: string) {
      const tier: number = props.tierOverride || (props.item as any).CombatController?.Tier || 1;
      return (props.bonuses as Bonus[])
        .filter((x) => Stats.cleanKey(x.ID) === key)
        .map((b) => {
          let resolved: number | null = null;
          if (Array.isArray(b.Value)) {
            resolved = Number(b.Value[Math.min(tier - 1, b.Value.length - 1)]);
          } else if (typeof b.Value === 'string' && b.Value.includes('/')) {
            const parts = b.Value.split('/');
            resolved = Number(parts[Math.min(tier - 1, parts.length - 1)]);
          }
          if (resolved === null) return b;
          const icon = b.Overwrite || b.Replace
            ? 'mdi-tooltip-edit-outline'
            : resolved > 0 ? 'mdi-tooltip-plus-outline'
              : resolved < 0 ? 'mdi-tooltip-minus-outline'
                : 'mdi-tooltip-check-outline';
          const originalValStr = Array.isArray(b.Value) ? b.Value.join(', ') : String(b.Value);
          const detail = String(b.Detail).replace(originalValStr, String(resolved));
          return { ...b, Value: resolved, Icon: icon, Detail: detail };
        });
    }
function addCoreStats() {
      statsToAdd.value.forEach((x) => props.item.StatController.AddCoreStat(x));
      statsToAdd.value = [];
    }
function addCustomStat() {
      props.item.StatController.AddCustomStat(customTitle.value);
      customTitle.value = '';
    }
function setStat(key: string, event: { value: any }) {
      props.item.StatController.setMax(key, event.value)
      props.item.SaveController.markModified()
      props.item.SaveController.save()
    }
function toggleEditing() {
      editing.value = !editing.value;
      if (!editing.value) {
        props.item.SaveController.save();
      }
    }
</script>
