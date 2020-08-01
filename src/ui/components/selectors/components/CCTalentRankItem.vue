<template>
  <v-row dense align="center">
    <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="auto" class="text-center">
      <v-icon
        :class="{ 'mr-4': small }"
        :size="small ? 40 : 80"
        :color="lock ? 'light-panel' : color"
        v-html="`cci-rank-${rank}`"
      />
    </v-col>
    <v-col>
      <p class="body-text px-3 ma-0 ml-n2" v-html="talentRank.description" />
      <div style="max-width: calc(100% - 20px)">
        <v-row v-if="actions" dense justify="center" align="center">
          <v-col cols="10">
            <cc-item-action-panel v-for="a in actions" :key="a.name" :action="a" class="mb-1" />
          </v-col>
        </v-row>
        <v-row v-if="item" dense justify="center" align="center">
          <v-col cols="auto">
            <cc-item-modal :item="item" />
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { TalentRank } from '@/class'
export default Vue.extend({
  name: 'cc-talent-rank-item',
  props: {
    rank: {
      type: Number,
      required: true,
    },
    talentRank: {
      type: Object,
      required: true,
    },
    lock: {
      type: Boolean,
      required: false,
    },
    small: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
  },
  computed: {
    item() {
      return TalentRank.Item(this.talentRank)
    },
    actions() {
      return TalentRank.Actions(this.talentRank)
    },
  },
})
</script>
