<template>
  <v-card flat class="pt-0">
    <v-card-text class="pt-0">
      <v-layout row>
        <v-flex xs4 :class="{ locked: rank && rank < 1 }">
          <p class="text-xs-center pt-2 subheading font-weight-bold">
            <span v-if="rank && rank < 1" class="grey-text">
              RANK I &nbsp;
              <v-icon>mdi-lock-outline</v-icon>
            </span>
            <span v-else-if="rank && rank >= 1">
              RANK I &nbsp;
              <v-icon>mdi-lock-open-outline</v-icon>
            </span>
            <span v-else>RANK I</span>
          </p>
          <div v-for="i in license.Unlocks[0]" :key="i.id" class="mr-4 ml-4">
            <item-badge :item="i" />
          </div>
        </v-flex>
        <v-flex xs4 :class="{ locked: rank && rank < 2 }">
          <p class="text-xs-center pt-2 subheading font-weight-bold">
            <span v-if="rank && rank < 2" class="grey-text">
              RANK II &nbsp;
              <v-icon>mdi-lock-outline</v-icon>
            </span>
            <span v-else-if="rank && rank >= 2">
              RANK II &nbsp;
              <v-icon>mdi-lock-open-outline</v-icon>
            </span>
            <span v-else>RANK II</span>
          </p>
          <div v-for="i in license.Unlocks[1]" :key="i.id" class="mr-4 ml-4">
            <item-badge :item="i" />
          </div>
        </v-flex>
        <v-flex xs4 :class="{ locked: rank && rank < 3 }">
          <p class="text-xs-center pt-2 subheading font-weight-bold">
            <span v-if="rank && rank < 3" class="grey-text">
              RANK III &nbsp;
              <v-icon>mdi-lock-outline</v-icon>
            </span>
            <span v-else-if="rank && rank >= 3">
              RANK III &nbsp;
              <v-icon>mdi-lock-open-outline</v-icon>
            </span>
            <span v-else>RANK III</span>
          </p>
          <div v-for="i in license.Unlocks[2]" :key="i.id" class="mr-4 ml-4">
            <item-badge :item="i" />
          </div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemBadge from './ItemBadge.vue'

export default Vue.extend({
  name: 'license-card',
  props: {
    license: Object,
    rank: Number,
  },
  components: { 'item-badge': ItemBadge },
})
</script>

<style scoped>
.locked {
  background-color: #e0e0e0;
}
</style>
