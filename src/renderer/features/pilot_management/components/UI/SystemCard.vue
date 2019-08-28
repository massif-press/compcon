<template>
  <v-card
    flat
    :color="tableItem ? '' : '#e0e0e0'"
    :class="itemData.IsDestroyed ? 'destroyed-bg' : ''"
  >
    <v-card-text class="pb-0 pt-0">
      <div v-if="!integrated && !tableItem">
        <v-tooltip left v-if="itemData.IsDestroyed">
          <v-btn slot="activator" fab absolute right style="top: 5px" @click="ToggleDestroy()">
            <v-icon large color="success">mdi-checkbox-blank</v-icon>
          </v-btn>
          <span>Repair Equipment</span>
        </v-tooltip>
        <v-tooltip left v-else>
          <v-btn slot="activator" fab absolute right icon style="top: 5px" @click="ToggleDestroy()">
            <v-icon large color="warning" class="hover-opacity">
              mdi-image-broken-variant
            </v-icon>
          </v-btn>
          <span>Mark equipment as Destroyed</span>
        </v-tooltip>
      </div>
      <div v-if="!integrated" class="pt-2">
        <em v-if="!itemData.License">
          {{ itemData.Source }}
          <br />
        </em>
        <em v-else>
          {{ itemData.Source }} {{ itemData.License }}, RANK
          <span v-for="n in itemData.LicenseLevel" :key="n">I</span>
          <br />
        </em>
      </div>
      <p
        v-if="itemData.Description && tableItem"
        v-html="itemData.Description"
        class="fluff-text"
      />
      <p v-if="!integrated" class="effect-text font-weight-bold">
        {{ itemData.Type }} ({{ itemData.sp }} SP)
      </p>
      <p v-if="itemData.Effect" v-html="itemData.Effect" class="pl-2 effect-text" />
      <v-row class="pb-2">
        <item-tag
          v-for="t in itemData.Tags"
          :key="t.id"
          :tagObj="t"
          :pilot="!tableItem ? pilot : null"
        />
      </v-row>
      <div v-if="!tableItem && pilot && itemData.IsLimited">
        <v-row>
          <v-col xs1>
            <v-divider class="mt-2 mr-3" />
          </v-col>
          <v-col shrink>
            <span class="caption grey--text text--darken-2">USES</span>
            <b class="primary--text">
              {{ itemData.Uses }} /
              {{ itemData.MaxUses + pilot.LimitedBonus }}
            </b>
          </v-col>
          <v-col grow>
            <v-divider class="mt-2 ml-3" />
          </v-col>
          <v-col xs1></v-col>
        </v-row>
        <v-row justify-start>
          <limited-bar
            :key="itemData.Name + '_tb_' + itemData.Uses"
            :current="itemData.Uses"
            :max="itemData.MaxUses + pilot.LimitedBonus"
            large
            color="primary"
            bg-color="grey darken-1"
            empty-icon="mdi-hexagon-outline"
            full-icon="mdi-hexagon"
            @update="itemData.Uses = $event"
          />
        </v-row>
      </div>
      <div v-if="!tableItem" class="pb-4">
        <v-row>
          <v-col xs1>
            <v-divider class="mt-2 mr-3" />
          </v-col>
          <v-col shrink>
            <span class="caption grey--text text--darken-2">ITEM NOTES</span>
          </v-col>
          <v-col grow>
            <v-divider class="mt-2 ml-3" />
          </v-col>
          <v-col xs1></v-col>
        </v-row>
        <v-row
          v-for="(n, idx) in itemData.Notes"
          :key="`${itemData.Name}_note_${idx}`"
          class="mt-1"
        >
          <v-col xs11>
            <item-note :content="n" @update="updateNote(idx, $event)" />
          </v-col>
          <v-col xs1>
            <v-tooltip top>
              <v-btn slot="activator" outline color="error" icon small @click="removeNote(idx)">
                <v-icon>close</v-icon>
              </v-btn>
              <span>Delete Note</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-tooltip top>
          <v-btn
            slot="activator"
            outline
            color="primary"
            icon
            small
            absolute
            bottom
            right
            style="bottom: 10px"
            @click="addNote"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <span>Add Note</span>
        </v-tooltip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemTag from './ItemTag.vue'
import ItemNote from './ItemNote.vue'
import LimitedBar from './LimitedBar.vue'
import { Pilot, MechSystem } from '@/class'

export default Vue.extend({
  name: 'system-card',
  props: {
    itemData: MechSystem,
    tableItem: Boolean,
    integrated: Boolean,
  },
  components: { ItemTag, ItemNote, LimitedBar },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
  },
  methods: {
    addNote() {
      this.itemData.AddNote('')
    },
    updateNote(index: number, note: string) {
      this.itemData.UpdateNote(index, note)
    },
    removeNote(index: number) {
      this.itemData.DeleteNote(index)
    },
    ToggleDestroy() {
      if (this.itemData.IsDestroyed) this.itemData.Repair()
      else this.itemData.Destroy()
    },
  },
})
</script>

<style scoped>
.hover-opacity {
  opacity: 0.5;
  transition: opacity 0.3s;
}
.hover-opacity:hover {
  opacity: 1;
}
</style>
