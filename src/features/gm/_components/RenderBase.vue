<template>
  <v-card v-show="item" flat outlined class="mb-8">
    <v-card-text>
      <v-row justify="space-between" align="start">
        <v-col>
          <slot />
        </v-col>
        <v-col cols="3" class="text-center">
          <v-img :src="item.Image" />
        </v-col>
      </v-row>
      <v-divider v-if="item.Sections.length" class="my-2" />
      <div v-if="item.Sections.length">
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
      <!-- <v-divider class="my-2" />
      <v-row class="text-center">
        <v-col v-if="item.Characters.length">
          <div class="caption">ASSOCIATED CHARACTERS</div>
          <cc-relationship-item
            v-for="(c, i) in item.Characters"
            :key="`assc_char_${i}`"
            :relationship="c"
            itemType="Character"
            class="mb-1"
            print
          />
        </v-col>
        <v-col cols="auto" v-if="item.Characters.length && item.Locations.length">
          <v-divider vertical />
        </v-col>
        <v-col v-if="item.Locations.length">
          <div class="caption">ASSOCIATED LOCATIONS</div>
          <cc-relationship-item
            v-for="(c, i) in item.Locations"
            :key="`assc_loc_${i}`"
            :relationship="c"
            itemType="Location"
            class="mb-1"
            print
          />
        </v-col>
        <v-col cols="auto" v-if="item.Factions.length"><v-divider vertical /></v-col>
        <v-col v-if="item.Factions.length">
          <div class="caption">ASSOCIATED FACTIONS</div>
          <cc-relationship-item
            v-for="(c, i) in item.Factions"
            :key="`assc_fact_${i}`"
            :relationship="c"
            itemType="Faction"
            class="mb-1"
            print
          />
        </v-col>
      </v-row> -->
      <v-divider class="my-2" />
      <div v-if="item.Clocks.length" class="caption">{{ typeText }} CLOCKS</div>
      <cc-clock
        v-for="(c, i) in item.Clocks"
        :key="`${item.Name}_clock_${i}`"
        :clock="c"
        class="mx-1 my-2"
        print
      />
      <v-divider class="my-2" />
      <div v-if="item.Tables.length">
        <div class="caption">{{ typeText }} TABLES</div>
        <cc-rollable-table
          v-for="(t, i) in item.Tables"
          :key="`${item.Name}_table_${i}`"
          :table="t"
          class="mx-1 my-2"
          print
        />
      </div>
      <div v-if="item.Notes.length">
        <v-divider class="my-2" />
        <div class="caption">GM NOTES</div>
        <p v-html-safe="item.Notes" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'gm-render-base',
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    typeText() {
      if (!this.item) return 'ERR'
      return this.item.ItemType.toUpperCase()
    },
  },
})
</script>
