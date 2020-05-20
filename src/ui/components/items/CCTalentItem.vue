<template>
  <cc-titled-panel :title="talent.Name" :icon="`cci-rank-${rank}`" :color="color" dense>
    <v-icon slot="items" class="fadeSelect mt-n5" @click="$refs.dialog.show()">
      mdi-information-outline
    </v-icon>
    <cc-solo-dialog ref="dialog" large icon="cci-trait" no-confirm :title="talent.Name">
      <cc-talent-info :talent="talent" />
    </cc-solo-dialog>
    <cc-talent-rank-item
      v-for="(tr, i) in ranks()"
      :key="tr.name"
      :lock="i + 1 > rank"
      :rank="i + 1"
      :description="tr.description"
      small
      :color="itemColor"
    />
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talent-item',
  props: {
    talent: {
      type: Object,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    hideLocked: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    itemColor: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  methods: {
    ranks() {
      if (this.hideLocked) return this.talent.Ranks.slice(0, this.rank)
      return this.talent.Ranks
    },
  },
})
</script>
