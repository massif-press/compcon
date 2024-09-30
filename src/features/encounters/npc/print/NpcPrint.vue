<template>
  <v-card tile flat light class="printable" style="margin-left: auto; margin-right: auto">
    <v-container fluid>
      <v-row dense>
        <v-col cols="auto">
          <v-row dense align="top">
            <v-col cols="auto">
              <div class="overline my-n2 grey--text">
                Tier {{ this.npc.Tier }}
                {{ this.npc.Templates.map(template => template.Name).join(' ') }}
                {{ this.npc.Class.Name }}
              </div>
              <div class="heading h2 mt-n4 font-weight-bolder">{{ this.npc.Name }}</div>
            </v-col>
          </v-row>

          <v-row dense align="center" justify="space-around" class="mt-n5 mb-1">
            <v-col cols="auto">
              <span class="font-weight-bold overline pr-3">HULL</span>
              <div class="ml-4 mt-n3" style="position: relative; width: max-content">
                <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
                <div class="heading h2 icon-overlap" v-html="this.npc.Stats.Hull" />
              </div>
            </v-col>
            <v-col cols="auto">
              <span class="font-weight-bold overline pr-3">AGI</span>
              <div class="ml-4 mt-n3" style="position: relative; width: max-content">
                <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
                <div class="heading h2 icon-overlap" v-html="this.npc.Stats.Agility" />
              </div>
            </v-col>

            <v-col cols="auto">
              <span class="font-weight-bold overline pr-3">SYS</span>
              <div class="ml-4 mt-n3" style="position: relative; width: max-content">
                <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
                <div class="heading h2 icon-overlap" v-html="this.npc.Stats.Systems" />
              </div>
            </v-col>
            <v-col cols="auto">
              <span class="font-weight-bold overline pr-3">ENG</span>
              <div class="ml-4 mt-n3" style="position: relative; width: max-content">
                <v-icon x-large style="margin-right: -3px !important">mdi-hexagon-outline</v-icon>
                <div class="heading h2 icon-overlap" v-html="this.npc.Stats.Engineering" />
              </div>
            </v-col>

            <v-col cols="auto" class="mt-4 ml-4">
              <v-icon size="40">{{ this.npc.SizeIcon }}</v-icon>
            </v-col>
          </v-row>
        </v-col>
        <v-spacer />

        <v-col cols="auto">
          <v-row dense align="center" justify="space-around" class="mt-5 mr-3">
            <v-row dense justify="space-between" align="start" class="mt-n4">
              <v-col cols="auto">
                <v-row dense no-gutters justify="center">
                  <v-col cols="auto" class="text-center">
                    <div style="line-height: 0" class="overline mb-4 mr-6">HP</div>
                    <div>
                      <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">
                        mdi-hexagon-outline
                      </v-icon>
                      <b
                        class="d-inline-block flavor-text font-weight-bold mb-n2"
                        v-html="`/${this.npc.Stats.HP}`"
                      />
                    </div>
                  </v-col>
                  <v-col
                    v-if="this.npc.Stats.Armor"
                    cols="auto"
                    class="text-center mb-1"
                    align-self="end"
                  >
                    <div style="line-height: 0" class="overline mb-4 ml-2">ARMOR</div>
                    <div class="heading h2 mt-n4 mr-n2">
                      <v-icon class="mt-n1 mr-n1">mdi-shield</v-icon>
                      {{ this.npc.Stats.Armor }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="text-center">
                <div style="line-height: 0" class="overline mb-4">STRUCTURE</div>
                <div>
                  <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">
                    cci-structure
                  </v-icon>
                  <b
                    class="d-inline-block flavor-text font-weight-bold mb-n2"
                    v-html="`/${this.npc.Stats.Structure}`"
                  />
                </div>
              </v-col>
              <v-col class="text-center">
                <div style="line-height: 0" class="overline mb-4 mr-6">HEAT</div>
                <div>
                  <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">mdi-fire</v-icon>
                  <b
                    class="d-inline-block flavor-text font-weight-bold mb-n2"
                    v-html="`/${this.npc.Stats.HeatCapacity}`"
                  />
                </div>
              </v-col>
              <v-col class="text-center">
                <div style="line-height: 0" class="overline mb-4 mr-2">STRESS</div>
                <div>
                  <v-icon size="60" color="grey lighten-3" class="mr-n3 mt-n6">cci-reactor</v-icon>
                  <b
                    class="d-inline-block flavor-text font-weight-bold mb-n2"
                    v-html="`/${this.npc.Stats.Stress}`"
                  />
                </div>
              </v-col>
            </v-row>
          </v-row>
        </v-col>
      </v-row>

      <!-- TODO: How does override and bonus work? Should this be coded in here? -->
      <v-row dense>
        <v-col>
          <fieldset>
            <legend class="caption font-weight-bold px-1">ACTIVATIONS</legend>
            <div class="heading h2 text-center mt-n2">{{ this.npc.Stats.Activations }}</div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset>
            <legend class="caption font-weight-bold px-1">SAVE TARGET</legend>
            <div class="heading h2 text-center mt-n2">{{ this.npc.Stats.Save }}</div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset>
            <legend class="caption font-weight-bold px-1">SPEED</legend>
            <div class="heading h2 text-center mt-n2">{{ this.npc.Stats.Speed }}</div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset>
            <legend class="caption font-weight-bold px-1">E-DEF</legend>
            <div class="heading h2 text-center mt-n2">{{ this.npc.Stats.EDefense }}</div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset>
            <legend class="caption font-weight-bold px-1">EVASION</legend>
            <div class="heading h2 text-center mt-n2">{{ this.npc.Stats.Evade }}</div>
          </fieldset>
        </v-col>
        <v-col>
          <fieldset>
            <legend class="caption font-weight-bold px-1">SENSORS</legend>
            <div class="heading h2 text-center mt-n2">{{ this.npc.Stats.Sensor }}</div>
          </fieldset>
        </v-col>
      </v-row>

      <div class="overline mb-n2">FEATURES</div>
      <fieldset
        v-for="(item, i) in this.npc.Items"
        :key="`ftr_${i}`"
        style="position: relative; page-break-inside: avoid"
      >
        <legend class="heading ml-1 px-2 mb-n2">
          {{ item.Name }} ({{ 'I'.repeat(item.Tier) }})
        </legend>
        <div class="d-inline-block overline ml-2 my-n2">
          {{
            `//${item.Feature.OriginClass} - ${item.Feature.OriginSet} ${item.Feature.FeatureType}`
          }}
        </div>
        <v-spacer />
        <p v-if="item.Feature.FeatureType == 'Weapon'" class="d-inline-block overline ml-2 my-n2">
          {{
            `${item.Feature.WeaponType} | ${item.Feature.Range.map(r => r.Text).join(
              ' '
            )} | ATK: ${item.Feature.AttackSummary(item.Tier)} | ${item.Feature.Damage(item.Tier)
              .map(d => d.Text)
              .join(' ')}`
          }}
        </p>
        <p v-if="item.Feature.FeatureType == 'Tech'" class="d-inline-block overline ml-2 my-n2">
          {{ `SENSORS: ${npc.Stats.Sensor} | ATK: ${item.Feature.AttackSummary(item.Tier)}` }}
        </p>
        <p v-html-safe="item.Feature.EffectByTier(item.Tier)" class="mx-1 mb-1" />
        <div class="text-right" style="position: absolute; top: 0; left: 0; right: 0">
          <cc-tags :tags="item.Feature.Tags" print />
        </div>
      </fieldset>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'

export default Vue.extend({
  name: 'combined-print',
  components: {},
  props: {
    npcId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    npc: null,
    blank: false,
  }),
  created() {
    if (this.npcId === 'blank') this.blank = true
    this.npc = getModule(NpcStore, this.$store).Npcs.find(npc => npc.ID === this.npcId)
  },
})
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style scoped>
.printable {
  background-color: white !important;
  width: 210mm;
}

.caption {
  font-size: 14px;
}

.icon-overlap {
  position: absolute;
  top: 1.5px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: center;
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

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    max-height: 100%;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white;
  }

  .printable {
    /* zoom: 75%; */
    width: 100% !important;
    max-width: 100% !important;

    margin: 0 !important;
    padding: 0 !important;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
  .caption {
    line-height: normal;
  }
  fieldset {
    padding: 0px;
    border-style: solid;
  }
}
</style>
