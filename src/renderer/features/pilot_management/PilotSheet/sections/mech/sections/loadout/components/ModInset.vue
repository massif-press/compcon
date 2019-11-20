<template>
  <v-card flat tile color="transparent" class="mx-4 my-2 mod-border">
    <v-card-title class="mod darken-1 py-0 heading h3 white--text" style="height: 28px">
      <span>
        <equipment-options :item="mod" />
        <span v-if="!mod.IsDestroyed">{{ mod.Name }}&nbsp;</span>
        <span v-else class="error--text" style="text-decoration: line-through">
          {{ mod.Name }}
        </span>
      </span>
      <cc-tooltip v-if="mod.SP && !mod.IsDestroyed" simple inline :content="`${mod.SP} SP`">
        <v-icon v-for="n in mod.SP" :key="`sp_${mod.ID}-${n}`" dark size="16">
          mdi-flash
        </v-icon>
      </cc-tooltip>
      <v-spacer />
      <cc-tooltip simple inline content="Remove Mod">
        <v-icon dark class="mt-n1 fadeSelect" @click.stop="$emit('remove-mod')">mdi-delete</v-icon>
      </cc-tooltip>
    </v-card-title>
    <div class="mod-border">
      <p
        class="mb-0 px-2 py-1 flavor-text text--text"
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
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentOptions from './EquipmentOptions.vue'

export default Vue.extend({
  name: 'mod-inset',
  components: { EquipmentOptions },
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
