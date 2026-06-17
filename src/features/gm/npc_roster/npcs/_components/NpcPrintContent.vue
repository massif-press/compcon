<template>
  <div>
    <div>
      <v-card flat
        light
        tile
        class="print-main px-6 py-3">
        <v-row density="compact"
          justify="space-between"
          align="start">
          <v-col>
            <span class="heading h3">{{ item.Name }}</span>
            <span v-if="item.Class"
              class="pl-4">
              <span class="heading h6">
                {{ $t('common.tierN', { n: item.Tier }) }}
                <span v-if="hasClass">{{
                  item.NpcClassController.Class.Name
                  }}</span>
                {{item.Templates.map((x) => x.Name).join('/')}}
              </span>
            </span>
          </v-col>
          <v-col cols="auto">
            <v-chip v-html-safe="item.Tag"
              small
              variant="outlined" />
            <cc-divider v-if="item.NarrativeController.Labels.length" />
            <v-chip v-for="(l, i) in item.Labels"
              :key="`label-${i}`"
              v-html-safe="l"
              small
              variant="outlined"
              label />
          </v-col>
          <v-col v-if="hasClass"
            cols="auto"
            class="mt-n4">
            <v-icon size="50">{{ item.SizeIcon }}</v-icon>
          </v-col>
        </v-row>

        <v-row v-if="hasClass"
          align="center"
          class="mt-n4">
          <v-col cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.hull') }}</div>
            <div v-html-safe="item.Stats.Hull"
              class="heading h3" />
          </v-col>
          <v-col cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.agi') }}</div>
            <div v-html-safe="item.Stats.Agility"
              class="heading h3" />
          </v-col>
          <v-col cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.sys') }}</div>
            <div v-html-safe="item.Stats.Systems"
              class="heading h3" />
          </v-col>
          <v-col cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.eng') }}</div>
            <div v-html-safe="item.Stats.Engineering"
              class="heading h3" />
          </v-col>

          <v-spacer />

          <v-col v-show="item.Stats.Structure > 1"
            cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.structure') }}</div>
            <div>
              <v-chip variant="outlined"
                label
                class="px-7" />
              <b v-html-safe="`/${item.Stats.Structure}`"
                class="d-inline-block mb-n2" />
            </div>
          </v-col>
          <v-col cols="auto">
            <v-row density="compact"
              no-gutters
              justify="center">
              <v-col cols="auto"
                class="text-center">
                <div class="small-header overline">{{ $t('stats.hp') }}</div>
                <div>
                  <v-chip variant="outlined"
                    label
                    class="px-7" />
                  <b v-html-safe="`/${item.Stats.HP}`"
                    class="d-inline-block mb-n2" />
                </div>
              </v-col>
              <v-col v-if="item.Stats.Armor"
                cols="auto"
                class="text-center pl-3">
                <div class="small-header overline">{{ $t('stats.armor') }}</div>
                <div class="heading h3">
                  <v-icon icon="mdi-shield" />
                  {{ item.Stats.Armor }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-show="item.Stats.Structure > 1"
            cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.stress') }}</div>
            <div>
              <v-chip variant="outlined"
                label
                class="px-7" />
              <b v-html-safe="`/${item.Stats.Stress}`"
                class="d-inline-block flavor-text font-weight-bold mb-n2" />
            </div>
          </v-col>
          <v-col cols="auto"
            class="text-center">
            <div class="small-header overline">{{ $t('stats.heat') }}</div>
            <div>
              <v-chip variant="outlined"
                label
                class="px-7" />
              <b v-html-safe="`/${item.Stats.HeatCapacity}`"
                class="d-inline-block flavor-text font-weight-bold mb-n2" />
            </div>
          </v-col>
        </v-row>

        <v-row v-if="hasClass"
          density="compact">
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">{{ $t('stats.save') }}</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Save }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">{{ $t('stats.speed') }}</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Speed }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">{{ $t('stats.edef') }}</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.EDefense }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">{{ $t('stats.evasion') }}</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Evade }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">{{ $t('stats.sensors') }}</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Sensor }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">
                {{ $t('gm.npcStats.activations') }}
              </legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Activations }}
              </div>
            </fieldset>
          </v-col>
        </v-row>

        <v-row density="compact"
          justify="center"
          style="page-break-after: always">
          <v-col v-for="i in item.Items"
            :key="i.ID"
            :class="` ${i.HideOnPrint ? 'no-print' : ''}`"
            style="page-break-inside: avoid !important; min-width: 45vw">
            <cc-npc-item-card :item="i"
              printable />
          </v-col>
        </v-row>

        <div v-if="item.NarrativeController.TextItems.length">
          <v-row v-for="(s, i) in item.Sections"
            :key="`section-${i}`"
            density="compact">
            <v-col>
              <v-row no-gutters
                justify="space-between">
                <v-col cols="auto">
                  <div class="heading h3">
                    {{ s.header }}
                  </div>
                </v-col>
                <v-col cols="auto"></v-col>
              </v-row>
              <v-col cols="12">
                <p v-html-safe="s.body" />
              </v-col>
            </v-col>
          </v-row>
        </div>
        <cc-clock v-for="(c, i) in item.NarrativeController.Clocks"
          :key="`clock-${i}`"
          :clock="c"
          class="mx-1 my-2"
          print />
        <div v-if="item.NarrativeController.Tables.length">
          <cc-rollable-table v-for="(t, i) in item.Tables"
            :key="`table-${i}`"
            :table="t"
            class="mx-1 my-2"
            print />
        </div>
        <div v-if="item.Notes">
          <v-divider class="my-2" />
          <div class="caption">{{ $t('gm.gmNotes') }}</div>
          <p v-html-safe="item.Notes" />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  item: object
}>()

const hasClass = computed(() => {
      return !!props.item && !!props.item.NpcClassController.Class;
    })
const items = computed(() => {
      return [...props.item.Items].sort((x: any) => x.IsVisible ? 1 : -1);
    })

function signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`;
    }
</script>

<style scoped>
.caption {
  font-size: 14px;
}

.small-header {
  font-weight: bold;
  line-height: 0px;
  margin-bottom: -6px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}

@media print {

  .no-print,
  .no-print * {
    display: none !important;
  }

  .print-main {
    margin-top: -40px !important;
  }

  .print-main * {
    font-size-adjust: 0.5;
  }
}
</style>
