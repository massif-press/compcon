<template>
  <v-slide-item
    v-slot:default="{ active, toggle }"
    :value="actor.ID"
    style="height: 100px"
    class="mt-3"
  >
    <v-card
      :color="defeated ? 'pilot' : complete ? 'grey' : color"
      class="mb-2 mx-1"
      :style="active ? 'margin-top: 2px!important; transition: margin-top 0.2s ease-in-out' : ''"
      height="100%"
      tile
      @click="toggle"
    >
      <div class="text-center white--text flavor-text">
        <div
          :class="active ? 'success darken-1 px-1' : 'px-1'"
          style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; transition: all 0.35s ease-in-out;"
        >
          <v-icon dark class="ml-n1">
            {{ defeated ? 'mdi-skull' : complete ? 'mdi-check' : actor.Icon }}
          </v-icon>
          <b :style="defeated ? 'text-decoration: linethrough' : ''">
            {{ actor.EncounterName }}
          </b>
        </div>
        <v-row dense no-gutters justify="space-around">
          <v-col cols="auto">
            <cc-tooltip
              v-if="actor.MaxStructure > 1"
              inline
              title="Structure"
              :content="`${actor.CurrentStructure} / ${actor.MaxStructure}`"
            >
              <v-icon dark class="mr-n2">cci-structure</v-icon>
              {{ actor.CurrentStructure }}
            </cc-tooltip>
            <cc-tooltip inline title="HP" :content="`${actor.CurrentHP} / ${actor.MaxHP}`">
              <v-icon dark class="mr-n2" size="16" style="margin-top: -2px">mdi-heart</v-icon>
              {{ actor.CurrentHP }}
            </cc-tooltip>
            <br />
            <cc-tooltip
              v-if="actor.MaxStress > 1"
              inline
              title="Reactor Stress"
              :content="`${actor.CurrentStress} / ${actor.MaxStress}`"
            >
              <v-icon dark class="mr-n2 ml-n2">cci-reactor</v-icon>
              {{ actor.CurrentStress }}
            </cc-tooltip>
            <cc-tooltip
              inline
              title="Heat"
              :content="`${actor.CurrentHeat} / ${actor.HeatCapacity}`"
            >
              <v-icon dark class="mr-n2 ml-n1" size="19" style="margin-top: -2px">
                cci-heat
              </v-icon>
              {{ actor.CurrentHeat }}
            </cc-tooltip>
          </v-col>
          <v-col cols="auto">
            <cc-tooltip
              inline
              title="Movement"
              :content="`${actor.CurrentMove} / ${actor.MaxMove}`"
            >
              <v-icon dark class="mr-n2">mdi-arrow-right-bold-hexagon-outline</v-icon>
              {{ actor.CurrentMove }}
            </cc-tooltip>
            <br />
            <cc-tooltip
              inline
              title="Activations"
              :content="`${actor.Activations} Activation remaining this Round`"
            >
              <v-icon dark class="mr-n2">mdi-hexagon-slice-3</v-icon>
              {{ actor.Activations }}
            </cc-tooltip>
          </v-col>
          <v-col cols="auto">
            <cc-tooltip inline title="Evasion" :content="`${actor.Evasion}`">
              <v-icon dark class="mr-n2">cci-evasion</v-icon>
              {{ actor.Evasion }}
            </cc-tooltip>
            <br />
            <cc-tooltip inline title="E-Defense" :content="`${actor.EDefense}`">
              <v-icon dark class="mr-n2">cci-marker</v-icon>
              {{ actor.EDefense }}
            </cc-tooltip>
          </v-col>
        </v-row>
        <v-row class="text-center" justify="space-around" dense no-gutters>
          <v-col>
            <v-menu open-on-hover top offset-y>
              <template v-slot:activator="{ on }">
                <v-icon
                  dark
                  :class="!actor.Statuses.length && !actor.Conditions.length ? 'fadeSelect' : ''"
                  v-on="on"
                >
                  mdi-alert
                </v-icon>
              </template>
              <v-card>
                <v-card-text>
                  <div class="heading h3 accent--text">Statuses/Conditions</div>
                  <v-divider />
                  <div
                    v-if="!actor.Statuses.length && !actor.Conditions.length"
                    class="flavor-text"
                  >
                    None
                  </div>
                  <div v-else class="flavor-text">
                    <div v-for="s in actor.Statuses" :key="s" v-html="s" />
                    <div v-for="c in actor.Conditions" :key="c" v-html="c" />
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu open-on-hover top offset-y>
              <template v-slot:activator="{ on }">
                <v-icon dark :class="!actor.Resistances.length ? 'fadeSelect' : ''" v-on="on">
                  mdi-shield
                </v-icon>
              </template>
              <v-card>
                <v-card-text>
                  <div class="heading h3 accent--text">Resistances</div>
                  <v-divider />
                  <div v-if="!actor.Resistances.length" class="flavor-text">
                    None
                  </div>
                  <div v-else class="flavor-text">
                    <div v-for="r in actor.Resistances" :key="r" v-html="r" />
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu open-on-hover top offset-y>
              <template v-slot:activator="{ on }">
                <v-icon dark :class="!actor.Reactions.length ? 'fadeSelect' : ''" v-on="on">
                  cci-reaction
                </v-icon>
              </template>
              <v-card>
                <v-card-text>
                  <div class="heading h3 accent--text">Prepared Reactions</div>
                  <v-divider />
                  <div v-if="!actor.Reactions.length" class="flavor-text">
                    None
                  </div>
                  <div v-else class="flavor-text">
                    <div v-for="r in actor.Reactions" :key="r" v-html="r" />
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-slide-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { EncounterSide } from '@/class'

export default Vue.extend({
  name: 'slide-item',
  props: {
    actor: {
      type: Object,
      required: true,
    },
    complete: {
      type: Boolean,
    },
    defeated: {
      type: Boolean,
    },
  },
  computed: {
    color() {
      if (this.actor.Frame) return 'secondary'
      if (this.actor.Side === EncounterSide.Ally) return 'blue'
      if (this.actor.Side === EncounterSide.Enemy) return 'primary'
      return 'grey darken-2'
    },
  },
})
</script>
