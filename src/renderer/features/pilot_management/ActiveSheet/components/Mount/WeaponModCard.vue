<template>
  <v-card
    v-if="mod"
    flat
    color="blue-grey darken-3"
    :class="mod.IsDestroyed ? 'destroyed-bg ma-2' : 'ma-2'"
  >
    <v-tooltip left v-if="mod.IsDestroyed">
      <v-btn
        slot="activator"
        fab
        small
        absolute
        bottom
        right
        style="bottom: 0; right:0"
        @click="mod.Repair()"
      >
        <v-icon size="25" color="success">mdi-checkbox-blank</v-icon>
      </v-btn>
      <span>Repair Weapon Mod</span>
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
        @click="mod.Destroy()"
      >
        <v-icon size="25" color="warning" class="hover-opacity">
          mdi-image-broken-variant
        </v-icon>
      </v-btn>
      <span>Mark Weapon Mod as Destroyed</span>
    </v-tooltip>
    <v-card-title
      class="pa-0 minor-title"
      :style="`background-color: ${mod.IsDestroyed ? '#1e1e1e' : '#546E7A'}`"
    >
      <span v-if="mod.IsDestroyed" class="ml-2 red--text">
        <i style="text-decoration: line-through">{{ mod.Name }}</i>
        (DESTROYED)
      </span>
      <span v-else class="ml-2">{{ mod.Name }}</span>
      <v-spacer />
      <span class="caption">WEAPON MOD</span>
    </v-card-title>
    <v-card-text class="pb-0 pt-0">
      <p v-if="mod.Effect" v-html="mod.Effect" class="ma-0 pa-1 pl-1" />
      <div v-if="mod.IsLimited">
        <v-row>
          <v-col xs1>
            <v-divider class="mt-2 mr-3" />
          </v-col>
          <v-col shrink>
            <span class="caption grey--text">USES&nbsp;</span>
            <b class="warning--text">{{ mod.Uses }} / {{ mod.MaxUses + limitedBonus }}</b>
          </v-col>
          <v-col grow>
            <v-divider class="mt-2 ml-3" />
          </v-col>
          <v-col xs1></v-col>
        </v-row>
        <v-row justify-start>
          <limited-bar
            :key="mod.Name + '_tb_' + mod.Uses"
            :current="mod.Uses"
            :max="mod.MaxUses + limitedBonus"
            large
            color="warning"
            bg-color="grey darken-1"
            empty-icon="mdi-hexagon-outline"
            full-icon="mdi-hexagon"
            @update="mod.Uses = $event"
          />
        </v-row>
      </div>
    </v-card-text>
    <v-row class="pb-1">
      <item-tag v-for="(t, index) in mod.Tags" :key="t.id + index" :tag-obj="t" :pilot="pilot" />
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  DamageElement,
  RangeElement,
  LimitedBar,
  ItemTag,
} from '@/features/pilot_management/components/UI'

export default Vue.extend({
  name: 'weapon-mod-card',
  components: {
    DamageElement,
    RangeElement,
    LimitedBar,
    ItemTag,
  },
  props: {
    mod: Object,
    limitedBonus: Number,
  },
  computed: {
    pilot() {
      return this.$store.getters.getPilot
    },
  },
})
</script>
