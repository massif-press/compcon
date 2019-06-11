<template>
  <v-card flat :color="tableItem ? '' : '#373737'">
    <v-card-text class="pb-0 pt-0">
      <div class="pt-2">
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
        v-if="itemData.Description"
        v-html="itemData.Description"
        class="fluff-text"
      />
      <p class="effect-text font-weight-bold">
        {{ itemData.Type }} ({{ itemData.sp }} SP)
      </p>
      <p
        v-if="itemData.Effect"
        v-html="itemData.Effect"
        class="pl-2 effect-text"
      />
      <v-layout class="pb-2">
        <item-tag
          v-for="t in itemData.Tags"
          :key="t.id"
          :tagObj="t"
          :pilot="!tableItem ? pilot : null"
        />
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemTag from './ItemTag.vue'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'system-card',
  props: {
    itemData: Object,
    tableItem: Boolean,
  },
  components: { ItemTag },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
  },
})
</script>
