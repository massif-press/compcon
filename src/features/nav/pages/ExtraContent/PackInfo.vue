<template>
  <v-card>
    <v-list-item class="primary" style="flex-grow: 0; flex-basis: auto;">
      <v-list-item-icon>
        <v-icon dark x-large>mdi-package</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="headline white--text">
          {{ pack.manifest.name }}
          <v-chip outlined dark label>{{ pack.manifest.version }}</v-chip>
        </v-list-item-title>
        <v-list-item-subtitle class="white--text text--darken-1">
          by {{ pack.manifest.author }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <v-row>
        <v-col>
          <p class="body-text text--text light-panel pa-2 mb-1">
            <span v-if="pack.manifest.description">
              {{ pack.manifest.description }}
            </span>
            <span v-else>
              No description given.
            </span>
          </p>
          <div>
            <h4>Content</h4>
            <div>
              <v-chip
                v-for="item in packContents"
                :key="item.name"
                outlined
                color="secondary"
                class="mr-2 mb-1 caption"
              >
                <v-avatar class="secondary white--text" left>
                  <b>{{ item.count }}</b>
                </v-avatar>
                {{ item.name }}
              </v-chip>
            </div>
          </div>
          <div v-if="pack.manifest.website" class="mt-2">
            <v-divider class="ma-1" />
            <v-btn
              v-extlink="pack.manifest.website"
              :href="pack.manifest.website"
              text
              color="secondary"
            >
              <v-icon prepend class="mr-1">open_in_new</v-icon>
              &nbsp;Website
            </v-btn>
          </div>
        </v-col>
        <v-col cols="4">
          <v-img :src="pack.manifest.image_url" alt="Pack image" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import _ from 'lodash'

@Component({
  props: {
    pack: { type: Object, required: true },
  },
})
export default class PackInfo extends Vue {
  private humanReadableMap = {
    manufacturers: ['manufacturer', 'manufacturers'],
    coreBonuses: ['core bonus', 'core bonuses'],
    frames: ['frame', 'frames'],
    weapons: ['weapon', 'weapons'],
    systems: ['system', 'systems'],
    mods: ['weapon mod', 'weapon mods'],
    pilotGear: ['pilot gear item', 'pilot gear items'],
    talents: ['pilot talent', 'pilot talents'],
    tags: ['equipment tag', 'equipment tags'],
    npcClasses: ['NPC class', 'NPC classes'],
    npcFeatures: ['NPC feature', 'NPC features'],
    npcTemplates: ['NPC template', 'NPC templates'],
  }

  get packContents() {
    return _.toPairs(this.$props.pack.data)
      .map(([key, value]: [string, object[]]) => {
        const count = value.length
        return [key, count]
      })
      .filter(([, count]) => count > 0)
      .map(([key, count]) => {
        const pair = this.humanReadableMap[key]
        if (!pair) return { count, name: `${key}--NOT--HUMANIZED` }
        const [singular, plural]: [string, string] = pair
        return { count, name: count > 1 ? plural : singular }
      })
  }
}
</script>

<style scoped>
.packImage {
  display: block;
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  margin: 0 auto;
}
</style>
