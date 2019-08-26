<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">GLOSSARY</span>
    <v-container class="effect-text">
      <v-layout justify-center row>
        <v-flex shrink>
          <v-card flat color="transparent">
            <v-card-text class="ma-0 pa-0 text-center">
              <span class="display-1 text-uppercase font-weight-light">COMBAT TERMINOLOGY</span>
              <br />
              <v-divider class="mt-2 mb-2" />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <p>
          <strong>Armor</strong>
          - The amount of damage you reduce all incoming sources of kinetic, energy, or explosive
          damage by. For mechs, armor cannot go higher than 4
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Electronic Defense</strong>
          - The number that most electronic warfare attacks must beat to be successful
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Evasion</strong>
          - The number that most melee and ranged attacks must beat in order to hit with an attack
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Grit</strong>
          - 1/2 your level. Added to melee and ranged attacks, system points, and hp
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Heat Capacity</strong>
          - The amount of heat your mech can take before any more heat will cause it to make an
          overheating check.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Hit Points (HP)</strong>
          - The amount of damage you can take as a pilot before going down and out, and the amount
          of damage a mech can take before it takes 1 point of structure damage.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Range</strong>
          - The range of your ranged attack, measured from yourself. Depends on weapon
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Repair Cap</strong>
          - The maximum number of repairs to your mech you can make per mission
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Resistance</strong>
          - Resistance to damage or a type of damage means it is reduced by half, rounded up, after
          armor is applied. You can only have resistance to damage once (it doesn&rsquo;t stack
          multiple times)
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Structure</strong>
          - When a character with structure goes to 0 HP, it makes a structure check, then takes 1
          structure damage. When a target runs out of structure, it either goes into the CRITICAL
          state (player mechs) or is destroyed outright.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Stress</strong>
          - When a character that can take stress overheats, it takes 1 stress then makes an
          overheating check.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Tech Attack</strong>
          - Electronic Warfare attacks, modified by your systems
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Threat</strong>
          - The range of your melee and overwatch attacks with certain weapons, measured from
          yourself. Base threat for all weapons is 1, but it may be greater depending on the weapon.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Sensor Range</strong>
          - The range in which you can make electronic warfare attacks, lock on, and use some
          systems. If a character is in your sensor range, you know about its existence unless it is
          hidden.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Size</strong>
          - The area that a character controls, rounded up for determining space. For example, a
          size 2 mech is an area 2 spaces on each side approximately 2 spaces high. Does not
          necessarily represent exact physical size.
        </p>
      </v-layout>
      <v-layout>
        <p>
          <strong>Speed</strong>
          - How far your mech moves when it moves (in spaces)
        </p>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'reference',
  data: () => ({
    actions: [],
    downtimeActions: [],
  }),
  methods: {
    //TODO: external definitions
    getColor(action: string, hover: boolean): string {
      if (action === 'move') return hover ? 'red' : 'red darken-3'
      else if (action === 'full') return hover ? 'indigo' : 'indigo darken-3'
      else if (action === 'quick') return hover ? 'primary lighten-3' : 'primary'
      else if (action === 'overcharge') return hover ? 'orange lighten-1' : 'orange darken-2'
      else if (action === 'reaction') return hover ? 'purple lighten-1' : 'purple darken-2'
      else if (action === 'free') return hover ? 'green lighten-1' : 'green darken-2'
      else if (action === 'downtime') return hover ? 'blue-grey' : 'blue-grey darken-2'
      else return 'grey'
    },
    getIcon(action: string): string {
      if (action === 'move') return 'mdi-arrow-right-bold-hexagon-outline'
      else if (action === 'full') return 'mdi-hexagon-slice-6'
      else if (action === 'quick') return 'mdi-hexagon-slice-3'
      else if (action === 'reaction') return 'mdi-redo-variant'
      else if (action === 'overcharge') return 'mdi-alert-octagram'
      else if (action === 'free') return 'mdi-axis-arrow'
      else if (action === 'downtime') return 'mdi-weather-sunset-down'
      else return '?'
    },
  },
  created() {
    this.actions = actions.filter(x => x.action_type !== 'downtime' && !x.reserve)
    this.downtimeActions = actions.filter(x => x.action_type === 'downtime')
  },
})
</script>
