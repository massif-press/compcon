<template>
  <v-flex xs6>
    <v-card dark class="ma-1" height="100%" :class="system.IsDestroyed ? 'destroyed-bg' : ''">
      <v-tooltip left v-if="system.IsDestroyed">
        <v-btn
          slot="activator"
          fab
          small
          absolute
          bottom
          right
          style="bottom: 0; right:0"
          @click="system.Repair()"
        >
          <v-icon size="25" color="success">mdi-checkbox-blank</v-icon>
        </v-btn>
        <span>Repair Equipment</span>
      </v-tooltip>
      <v-tooltip left v-else>
        <v-btn
          slot="activator"
          fab
          small
          absolute
          bottom
          right
          icon
          style="bottom: 0; right:0"
          @click="system.Destroy()"
        >
          <v-icon size="25" color="warning" class="hover-opacity">mdi-image-broken-variant</v-icon>
        </v-btn>
        <span>Mark equipment as Destroyed</span>
      </v-tooltip>
      <v-card-title
        class="pa-0 minor-title"
        :style="`background-color: ${system.IsDestroyed ? '#1e1e1e' : color.mechsystem.dark}`"
      >
        <span v-if="system.IsDestroyed" class="ml-2 red--text">
          <i style="text-decoration: line-through">{{ system.Name }}</i> (DESTROYED)
        </span>
        <span v-else class="ml-2">{{ system.Name }}</span>
        <v-spacer/>
        <span class="caption">{{system.Source}} {{system.Type}}&nbsp;</span>
      </v-card-title>
      <v-card-text class="pa-1">
        <p class="pa-0 ml-3 mr-3 mb-0" v-html="system.Effect"/>

        <v-layout>
          <item-tag
            v-for="(t, index) in system.Tags"
            :key="t.id + index"
            :tagObj="t"
            :pilot="pilot"
          />
        </v-layout>
        <div v-if="system.IsLimited">
          <v-layout>
            <v-flex xs1>
              <v-divider class="mt-2 mr-3"/>
            </v-flex>
            <v-flex shrink>
              <span class="caption grey--text">USES&nbsp;</span>
              <b class="warning--text">{{ system.Uses }} / {{ system.MaxUses + pilot.LimitedBonus }}</b>
            </v-flex>
            <v-flex grow>
              <v-divider class="mt-2 ml-3"/>
            </v-flex>
            <v-flex xs1></v-flex>
          </v-layout>
          <v-layout justify-start>
            <limited-bar
              :key="system.Name + '_tb_' + system.Uses"
              :current="system.Uses"
              :max="system.MaxUses + pilot.LimitedBonus"
              large
              color="warning"
              bg-color="grey darken-1"
              empty-icon="mdi-hexagon-outline"
              full-icon="mdi-hexagon"
              @update="system.Uses = $event"
            />
          </v-layout>
        </div>
        <div v-if="system.Notes.length">
          <v-layout>
            <v-flex xs1>
              <v-divider class="mt-2 mr-3"/>
            </v-flex>
            <v-flex shrink>
              <span class="caption grey--text">NOTES</span>
            </v-flex>
            <v-flex grow>
              <v-divider class="mt-2 ml-3"/>
            </v-flex>
            <v-flex xs1></v-flex>
          </v-layout>
          <ul>
            <li v-for="(n, idx) in system.Notes" :key="`${system.Name}_note_${idx}`">{{n}}</li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import colors from '@/features/_shared/UI/CCColors'
import { Pilot, Mech, MechLoadout } from '@/class'
import { LimitedBar, ItemTag } from '@/features/pilot_management/components/UI'

export default Vue.extend({
  name: 'mech-system-card',
  components: { LimitedBar, ItemTag },
  props: {
    system: Object,
    width: Number,
  },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
    mech(): Mech {
      return this.pilot.ActiveMech
    },
    color(): any {
      return colors
    },
  },
  methods: {},
})
</script>



<style>
.hover-opacity {
  opacity: 0.5;
  transition: opacity 0.3s;
}
.hover-opacity:hover {
  opacity: 1;
}
</style>
