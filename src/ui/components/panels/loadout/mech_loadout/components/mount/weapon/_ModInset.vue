<template>
  <v-col>
    <v-card flat tile color="transparent" class="mx-4 my-2 mod-border">
      <v-card-title
        class="mod darken-1 py-0 pt-n1 heading h3 white--text"
        style="height: 24px!important"
      >
        <v-row class="mt-n1" no-gutters>
          <equipment-options slot="options" :item="mod" />
          {{ mod.Name }}
          <v-spacer />
          <cc-tooltip simple inline content="Remove Mod">
            <v-icon dark class="mt-n1 fadeSelect" @click.stop="$emit('remove-mod')">
              mdi-delete
            </v-icon>
          </cc-tooltip>
        </v-row>
      </v-card-title>
      <div class="mod-border px-2 pt-1">
        <equipment-header
          :item="mod"
          :use-bonus="mech.Pilot.LimitedBonus"
          mod
          interior
          dark
          class="mt-n1"
        />
        <v-alert
          v-if="mod.IsCascading"
          dense
          tile
          color="error"
          class="text-center white--text stat-text"
          style="letter-spacing: 3px;"
        >
          / / NHP IN CASCADE / /
        </v-alert>
        <cc-item-effect-panel :effects="mod.Effect" @click.stop="$refs.detailDialog.show()" />
        <v-row v-if="mod.Tags" dense no-gutters>
          <v-col cols="auto" class="ml-auto mt-n2 mr-4">
            <cc-tags :tags="mod.Tags" color="mod" small />
          </v-col>
        </v-row>
      </div>
      <cc-solo-dialog ref="detailDialog" no-confirm :title="mod.Name" large>
        <cc-item-card :item="mod" />
      </cc-solo-dialog>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentOptions from '../../_EquipmentOptions.vue'
import EquipmentHeader from '../../_EquipmentHeader.vue'

export default Vue.extend({
  name: 'mod-inset',
  components: { EquipmentOptions, EquipmentHeader },
  props: {
    mod: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
.mod-border {
  border: 1px solid darkslategray;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}
.mod-border:hover {
  border-color: black;
}
</style>
