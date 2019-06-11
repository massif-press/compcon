<template>
  <v-flex shrink>
    <v-tooltip top offset-y>
      <v-chip
        class="px-1 py-2"
        slot="activator"
        :color="tagObj.err ? 'deep-orange' : 'primary'"
        dark
        small
      >
        <v-avatar>
          <v-icon small v-if="tagObj.err">label_off</v-icon>
          <v-icon small v-else>label</v-icon>
        </v-avatar>
        <span v-if="tagObj.err">MISSING DATA</span>
        <span v-else>
          {{ pilot ? tagObj.Name(pilot.LimitedBonus) : tagObj.Name() }}
        </span>
      </v-chip>
      <v-card-text v-if="tagObj.err">
        Tag data not found. This is likely due to a missing content pack, or
        malformed item data.
      </v-card-text>
      <template v-else>
        <v-card-title class="subheading pb-2 mb-2 pt-2 mt-2">
          {{ pilot ? tagObj.Name(pilot.LimitedBonus) : tagObj.Name() }}
        </v-card-title>
        <v-card-text
          v-if="tagObj.ID === 'limited' && pilot && pilot.LimitedBonus"
          class="pb-2 mb-2 pt-0 mt-0"
        >
          {{ tagObj.Description(pilot.LimitedBonus) }}
          <br />
          <em v-if="pilot.LimitedBonus">
            (Includes +{{ pilot.LimitedBonus }} Limited Systems bonus)
          </em>
        </v-card-text>
        <v-card-text v-else class="pb-2 mb-2 pt-0 mt-0">
          {{ tagObj.Description() }}
        </v-card-text>
      </template>
    </v-tooltip>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, Tag } from '@/class'

export default Vue.extend({
  name: 'item-tag',
  props: {
    tagObj: Object,
    pilot: Pilot,
  },
})
</script>
