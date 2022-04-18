<template>
  <div>
    <div>
      <v-card flat light tile class="print-main px-6 py-3">
        <v-row dense justify="space-between" align="start">
          <v-col>
            <span class="heading h3">{{ npc.Name }}</span>
            <span v-if="npc.Class" class="pl-4">
              <span class="heading h6">
                Tier {{ npc.Tier }} {{ npc.Class.Name }}
                {{ npc.Templates.map(x => x.Name).join('/') }}
              </span>
            </span>
          </v-col>
          <v-col cols="auto">
            <v-chip small outlined v-html="npc.Tag" />
            <cc-divider v-if="npc.Labels.length" />
            <v-chip v-for="(l, i) in npc.Labels" :key="l + i" small outlined label v-html="l" />
          </v-col>
          <v-col cols="auto" class="mt-n4">
            <v-icon size="50">{{ npc.SizeIcon }}</v-icon>
          </v-col>
        </v-row>

        <v-row align="center" class="mt-n4">
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">HULL</div>
            <div class="heading h3" v-html="npc.Stats.Hull" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">AGI</div>
            <div class="heading h3" v-html="npc.Stats.Agility" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">SYS</div>
            <div class="heading h3" v-html="npc.Stats.Systems" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">ENG</div>
            <div class="heading h3" v-html="npc.Stats.Engineering" />
          </v-col>

          <v-spacer />

          <v-col v-show="npc.Stats.Structure > 1" cols="auto" class="text-center">
            <div class="small-header overline">STRUCTURE</div>
            <div>
              <v-chip outlined label class="px-7" />
              <b class="d-inline-block mb-n2" v-html="`/${npc.Stats.Structure}`" />
            </div>
          </v-col>
          <v-col cols="auto">
            <v-row dense no-gutters justify="center">
              <v-col cols="auto" class="text-center">
                <div class="small-header overline">HP</div>
                <div>
                  <v-chip outlined label class="px-7" />
                  <b class="d-inline-block mb-n2" v-html="`/${npc.Stats.HP}`" />
                </div>
              </v-col>
              <v-col v-if="npc.Stats.Armor" cols="auto" class="text-center pl-3">
                <div class="small-header overline">ARMOR</div>
                <div class="heading h3">
                  <v-icon>mdi-shield</v-icon>
                  {{ npc.Stats.Armor }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-show="npc.Stats.Structure > 1" cols="auto" class="text-center">
            <div class="small-header overline">STRESS</div>
            <div>
              <v-chip outlined label class="px-7" />
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-html="`/${npc.Stats.Stress}`"
              />
            </div>
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">HEAT</div>
            <div>
              <v-chip outlined label class="px-7" />
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-html="`/${npc.Stats.HeatCapacity}`"
              />
            </div>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">SAVE</legend>
              <div class="heading h3 text-center pb-2">{{ npc.Stats.Save }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">SPEED</legend>
              <div class="heading h3 text-center pb-2">{{ npc.Stats.Speed }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">E-DEF</legend>
              <div class="heading h3 text-center pb-2">{{ npc.Stats.EDefense }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">EVASION</legend>
              <div class="heading h3 text-center pb-2">{{ npc.Stats.Evade }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">SENSORS</legend>
              <div class="heading h3 text-center pb-2">{{ npc.Stats.Sensor }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">ACTIVATIONS/ROUND</legend>
              <div class="heading h3 text-center pb-2">{{ npc.Stats.Activations }}</div>
            </fieldset>
          </v-col>
        </v-row>

        <v-row dense justify="center" style="page-break-after: always;">
          <v-col
            v-for="(item, i) in npc.Items"
            :key="item.ID"
            :cols="i === npc.Items.length - 1 ? 'auto' : '6'"
            style="page-break-inside: avoid !important;"
          >
            <cc-npc-item-card :item="item" full-height printable />
          </v-col>
        </v-row>

        <div v-if="npc.Sections.length">
          <v-row v-for="(s, i) in npc.Sections" :key="`section_${i}`" dense>
            <v-col>
              <v-row no-gutters justify="space-between">
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
        <cc-clock
          v-for="(c, i) in npc.Clocks"
          :key="`${npc.Name}_clock_${i}`"
          :clock="c"
          class="mx-1 my-2"
          print
        />
        <div v-if="npc.Tables.length">
          <cc-rollable-table
            v-for="(t, i) in npc.Tables"
            :key="`${npc.Name}_table_${i}`"
            :table="t"
            class="mx-1 my-2"
            print
          />
        </div>
        <div v-if="npc.Notes.length">
          <v-divider class="my-2" />
          <div class="caption">GM NOTES</div>
          <p v-html-safe="npc.Notes" />
        </div>
      </v-card>
    </div>
    <v-bottom-navigation fixed grow horizontal color="primary" class="no-print">
      <v-btn @click="$router.go(-1)">
        <span>Close Preview</span>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn disabled>
        <span>Options</span>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
      <v-btn @click="print()">
        <span>Print</span>
        <v-icon>print</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'

export default Vue.extend({
  name: 'npc-print-base',
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    printWindow: false,
  }),
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`
    },
    print() {
      // this.printWindow = true
      window.print()
    },
  },
  computed: {
    npc() {
      return getModule(NpcStore, this.$store).Npcs.find(x => x.ID === this.id)
    },
    options() {
      return {
        margin: [1, 10],
        filename: `${this.npc.Name}.pdf`,
      }
    },
    typeText() {
      if (!this.item) return 'ERR'
      return this.npc.ItemType.toUpperCase()
    },
    items() {
      return this.npc.Items.sort(x => x.IsVisible)
    },
  },
})
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

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}

.oc-border {
  border: 1px solid;
  border-color: darkgrey;
  border-radius: 2px;
}

.bordered-block {
  border: 1px solid grey;
  border-radius: 2px;
  padding: 4px;
  height: 100%;
  position: relative;
  padding-bottom: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  display: block;
  page-break-inside: avoid !important;
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
