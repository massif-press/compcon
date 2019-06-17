<template>
  <v-card flat>
    <v-card-title v-if="!popup">
      <strong class="title">{{ itemData.name }}</strong>
    </v-card-title>
    <v-card-text :class="{ 'pb-0 pt-0': popup }">
      <!-- Weapon -->
      <div v-if="itemData.ItemType === 'MechWeapon'">
        <p v-html="'Weapon'" class="pa-0 ma-0 mb-2 title" />
        <p
          v-if="itemData.Description"
          class="fluff-text"
          v-html="itemData.Description"
        />
        <p class="pa-0 ma-0 mb-2 title">
          {{ itemData.Size }} {{ itemData.Type }}
        </p>
        <p
          v-if="itemData.SP"
          v-html="`${itemData.SP} SP`"
          class="pa-0 ma-0 mb-2 title"
        />
        <damage-element :dmg="itemData.Damage" />
        <range-element :range="itemData.Range" />
        <p
          v-if="itemData.Effect"
          v-html="itemData.Effect"
          class="effect-text"
        />
      </div>
      <!-- System -->
      <div
        v-else-if="
          itemData.ItemType === 'MechSystem' ||
            itemData.ItemType === 'WeaponMod'
        "
      >
        <p
          v-if="itemData.Type"
          v-html="itemData.Type"
          class="pa-0 ma-0 mb-2 title"
        />
        <p
          v-if="itemData.Description"
          class="fluff-text"
          v-html="itemData.Description"
        />
        <p
          v-if="itemData.SP"
          v-html="`${itemData.SP} SP`"
          class="pa-0 ma-0 mb-2 title"
        />
        <p
          v-if="itemData.Effect"
          v-html="`${itemData.Effect}`"
          class="effect-text"
        />
      </div>
      <!-- Frame -->
      <div v-else>
        <b class="ml-3">
          {{ itemData.Source }} {{ itemData.MechTypeString }} Frame
        </b>
        <frame-statblock :frame="itemData" />
      </div>
      <v-layout>
        <item-tag v-for="t in itemData.Tags" :key="t.id" :tag-obj="t" />
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import RangeElement from './RangeElement.vue'
import DamageElement from './DamageElement.vue'
import FrameStatblock from './FrameStatblock.vue'
import ItemTag from './ItemTag.vue'

export default Vue.extend({
  name: 'item-card',
  props: {
    itemData: Object,
    popup: Boolean,
  },
  components: { DamageElement, RangeElement, FrameStatblock, ItemTag },
  computed: {
    pilot: function() {
      return this.$store.getters['getPilot']
    },
  },
})
</script>
