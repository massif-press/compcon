<template>
  <div>
    <div>
      <v-card flat light tile class="print-main px-6 py-3">
        <v-row dense justify="space-between" align="start">
          <v-col>
            <span class="heading h3">{{ item.Name }}</span>
            <span v-if="item.Class" class="pl-4">
              <span class="heading h6">
                Tier {{ item.Tier }}
                <span v-if="hasClass">{{
                  item.NpcClassController.Class.Name
                }}</span>
                {{ item.Templates.map((x) => x.Name).join('/') }}
              </span>
            </span>
          </v-col>
          <v-col cols="auto">
            <v-chip small variant="outlined" v-html="item.Tag" />
            <cc-divider v-if="item.NarrativeController.Labels.length" />
            <v-chip
              v-for="(l, i) in item.Labels"
              :key="l + i"
              small
              variant="outlined"
              label
              v-html="l"
            />
          </v-col>
          <v-col v-if="hasClass" cols="auto" class="mt-n4">
            <v-icon size="50">{{ item.SizeIcon }}</v-icon>
          </v-col>
        </v-row>

        <v-row v-if="hasClass" align="center" class="mt-n4">
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">HULL</div>
            <div class="heading h3" v-html="item.Stats.Hull" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">AGI</div>
            <div class="heading h3" v-html="item.Stats.Agility" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">SYS</div>
            <div class="heading h3" v-html="item.Stats.Systems" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">ENG</div>
            <div class="heading h3" v-html="item.Stats.Engineering" />
          </v-col>

          <v-spacer />

          <v-col
            v-show="item.Stats.Structure > 1"
            cols="auto"
            class="text-center"
          >
            <div class="small-header overline">STRUCTURE</div>
            <div>
              <v-chip variant="outlined" label class="px-7" />
              <b
                class="d-inline-block mb-n2"
                v-html="`/${item.Stats.Structure}`"
              />
            </div>
          </v-col>
          <v-col cols="auto">
            <v-row dense no-gutters justify="center">
              <v-col cols="auto" class="text-center">
                <div class="small-header overline">HP</div>
                <div>
                  <v-chip variant="outlined" label class="px-7" />
                  <b
                    class="d-inline-block mb-n2"
                    v-html="`/${item.Stats.HP}`"
                  />
                </div>
              </v-col>
              <v-col
                v-if="item.Stats.Armor"
                cols="auto"
                class="text-center pl-3"
              >
                <div class="small-header overline">ARMOR</div>
                <div class="heading h3">
                  <v-icon>mdi-shield</v-icon>
                  {{ item.Stats.Armor }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-show="item.Stats.Structure > 1"
            cols="auto"
            class="text-center"
          >
            <div class="small-header overline">STRESS</div>
            <div>
              <v-chip variant="outlined" label class="px-7" />
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-html="`/${item.Stats.Stress}`"
              />
            </div>
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="small-header overline">HEAT</div>
            <div>
              <v-chip variant="outlined" label class="px-7" />
              <b
                class="d-inline-block flavor-text font-weight-bold mb-n2"
                v-html="`/${item.Stats.HeatCapacity}`"
              />
            </div>
          </v-col>
        </v-row>

        <v-row v-if="hasClass" dense>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">SAVE</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Save }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">SPEED</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Speed }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">E-DEF</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.EDefense }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">EVASION</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Evade }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">SENSORS</legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Sensor }}
              </div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="caption font-weight-bold px-1">
                ACTIVATIONS/ROUND
              </legend>
              <div class="heading h3 text-center pb-2">
                {{ item.Stats.Activations }}
              </div>
            </fieldset>
          </v-col>
        </v-row>

        <v-row dense justify="center" style="page-break-after: always">
          <v-col
            v-for="item in item.Items"
            :key="item.ID"
            :class="` ${item.HideOnPrint ? 'no-print' : ''}`"
            style="page-break-inside: avoid !important; min-width: 45vw"
          >
            <cc-npc-item-card :item="item" printable />
          </v-col>
        </v-row>

        <div v-if="item.NarrativeController.TextItems.length">
          <v-row v-for="(s, i) in item.Sections" :key="`section_${i}`" dense>
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
          v-for="(c, i) in item.NarrativeController.Clocks"
          :key="`${item.Name}_clock_${i}`"
          :clock="c"
          class="mx-1 my-2"
          print
        />
        <div v-if="item.NarrativeController.Tables.length">
          <cc-rollable-table
            v-for="(t, i) in item.Tables"
            :key="`${item.Name}_table_${i}`"
            :table="t"
            class="mx-1 my-2"
            print
          />
        </div>
        <div v-if="item.Notes">
          <v-divider class="my-2" />
          <div class="caption">GM NOTES</div>
          <p v-html-safe="item.Notes" />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'npc-print-content',
  props: { item: { type: Object, required: true } },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`;
    },
  },
  computed: {
    hasClass() {
      return !!this.item && !!this.item.NpcClassController.Class;
    },

    items() {
      return this.item.Items.sort((x) => x.IsVisible);
    },
  },
};
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
