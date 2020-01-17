<template>
  <v-col>
    <v-card flat tile color="transparent" class="mx-4 my-2 mod-border">
      <v-card-title class="mod darken-1 py-0 heading h3 white--text" style="height: 24px!important">
        <equipment-header :item="mod" interior dark class="mt-n2">
          <equipment-options slot="options" :item="mod" />
          <cc-tooltip simple inline content="Remove Mod">
            <v-icon dark class="mt-n1 fadeSelect" @click.stop="$emit('remove-mod')">
              mdi-delete
            </v-icon>
          </cc-tooltip>
        </equipment-header>
      </v-card-title>
      <div class="mod-border">
        <v-alert
          v-if="mod.IsUnshackled"
          dense
          tile
          color="error"
          class="text-center white--text stat-text"
          style="letter-spacing: 3px;"
        >
          / / NHP UNSHACKLED / /
        </v-alert>
        <p
          class="mb-0 px-2 pt-1 effect-text text--text"
          @click.stop="$refs.detailDialog.show()"
          v-html="mod.Effect"
        />
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
  background-color: white;
}
</style>
