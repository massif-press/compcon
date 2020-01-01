<template>
  <v-card tile elevation="1" style="display: flex; flex-direction: column;">
    <v-list-item class="primary" style="flex-grow: 0; flex-basis: auto;">
      <v-list-item-icon>
        <v-icon dark>mdi-package</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="headline white--text">
          {{ pack.manifest.name }}
          <v-chip small outlined dark label>{{ pack.manifest.version }}</v-chip>
        </v-list-item-title>
        <v-list-item-subtitle class="white--text text--darken-1">
          by {{ pack.manifest.author }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!-- <v-img position="center" contain height="250" :src="pack.manifest.image_url"></v-img> -->
    <v-card-text style="flex-grow: 1">
      <div style="height: 100%; display: flex; flex-direction: column">
        <div>
          <v-list-item-avatar
            v-if="pack.manifest.image_url"
            style="float: right; margin-right: 0"
            tile
            size="200"
          >
            <img
              style="height: 100%; width: auto;"
              :src="pack.manifest.image_url"
              alt="Pack image"
            />
          </v-list-item-avatar>
          <span v-if="pack.manifest.description">
            {{ pack.manifest.description }}
          </span>
          <span v-else class="font-italic grey--text text--darken-1">
            No description given.
          </span>
        </div>
        <div class="mt-auto">
          <h4 class="subtitle-2 mb-2">Content</h4>
          <div>
            <v-chip
              v-for="item in packContents"
              :key="item.name"
              outlined
              color="secondary"
              class="mr-2 mb-1 caption"
            >
              <v-avatar class="secondary white--text" left>{{ item.count }}</v-avatar>
              {{ item.name }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <div v-if="pack.manifest.website" class="mt-auto" style="flex-grow: 0;">
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
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import _ from 'lodash'

@Component({
  props: {
    pack: { type: Object, required: true }
  }
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
    return _.toPairs(this.$props.pack.data).map( ([key, value]: [string, object[]]) => {
      const count = value.length
      return [key, count]
    } )
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