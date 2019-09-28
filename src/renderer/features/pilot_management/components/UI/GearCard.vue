<template>
  <div>
    <v-card flat :color="tableItem ? 'grey lighten-4' : ''">
      <v-card-text class="pa-0 pb-2 pl-2">
        <p
          class="pa-0 pt-2 ml-3 mr-3 mt-1 mb-2 fluff-text"
          v-if="itemData.description"
          v-html="itemData.description"
        />
        <!-- Armor -->
        <div v-if="itemData.ItemType === 'PilotArmor'">
          <v-card color="grey lighten-2" class="mt-3 pt-1 pb-1 mb-2" flat>
            <v-row class="effect-text text-center">
              <v-col v-if="itemData.HPBonus">HP Bonus</v-col>
              <v-col>Armor</v-col>
              <v-col>Evasion</v-col>
              <v-col v-if="itemData.evasion_bonus">Evasion Bonus</v-col>
              <v-col>E-Defense</v-col>
              <v-col>Speed</v-col>
              <v-col v-if="itemData.speed_bonus">Speed Bonus</v-col>
            </v-row>
          </v-card>
          <v-row class="title text-center pa-0 ma-0 mb-2">
            <v-col v-if="itemData.HPBonus">+{{ itemData.hp_bonus }}</v-col>
            <v-col>+{{ itemData.Armor || 0 }}</v-col>
            <v-col>{{ itemData.Evasion || 'N/A' }}</v-col>
            <v-col v-if="itemData.EvasionBonus">+{{ itemData.EvasionBonus }}</v-col>
            <v-col>{{ itemData.Edefense || 'N/A' }}</v-col>
            <v-col>{{ itemData.Speed }}</v-col>
            <v-col v-if="itemData.SpeedBonus">{itemData.SpeedBonus}}</v-col>
          </v-row>
        </div>
        <!-- Weapon -->
        <div v-else-if="itemData.ItemType === 'PilotWeapon'">
          <v-row class="ml-2">
            <v-col>
              <damage-element :dmg="itemData.Damage" />
              <range-element :range="itemData.Range" />
            </v-col>
          </v-row>
        </div>
        <!-- Gear -->
        <div v-else>
          <p v-if="itemData.Uses" class="ml-2 effect-text" v-html="`${itemData.Uses} Uses`" />
        </div>
        <p v-if="itemData.Effect" class="ml-2 effect-text" v-html="itemData.Effect" />
        <v-row class="ml-2">
          <item-tag v-for="t in itemData.Tags" :key="t.id" :tag-obj="t" />
        </v-row>
        <div v-if="!tableItem" class="pb-4">
          <v-row>
            <v-col cols="1">
              <v-divider class="mt-2 mr-3" />
            </v-col>
            <v-col shrink>
              <span class="caption grey--text">ITEM NOTES</span>
            </v-col>
            <v-col grow>
              <v-divider class="mt-2 ml-3" />
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
          <v-row
            v-for="(n, idx) in itemData.Notes"
            :key="`${itemData.Name}_note_${idx}`"
            class="mt-1"
          >
            <v-col cols="11">
              <item-note :content="n" light @update="updateNote(idx, $event)" />
            </v-col>
            <v-col cols="1">
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  outline
                  color="error"
                  icon
                  dark
                  small
                  @click="removeNote(idx)"
                >
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
              color="warning"
              icon
              dark
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement } from './'
import ItemTag from './ItemTag.vue'
import ItemNote from './ItemNote.vue'
import { Pilot } from '@/class'
export default Vue.extend({
  name: 'gear-card',
  components: { DamageElement, RangeElement, ItemTag, ItemNote },
  props: {
    itemData: Object,
    tableItem: Boolean,
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
  },
})
</script>
