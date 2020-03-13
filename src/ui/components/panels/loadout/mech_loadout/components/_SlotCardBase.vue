<template>
  <v-col class="pa-2">
    <div style="height: 100%">
      <v-card flat tile class="clipped-large panel" style="height: 100%">
        <v-card-title class="pilot white--text py-0 heading h3" style="height: 24px">
          <span class="mt-n1" style="display: flex; width: 100%">
            <slot name="header" />
            <v-spacer />
            <slot name="header-items" />
          </span>
        </v-card-title>
        <v-card-text
          :id="item ? 'underline-parent' : ''"
          class="`px-2 py-1 text-center`"
          style="height: calc(100% - 28px)"
        >
          <div class="underline-slide" style="height: 100%">
            <div
              v-if="item"
              class="text-left"
              style="cursor: pointer!important"
              @click="$refs.detailDialog.show()"
            >
              <slot />
              <v-row v-if="item.notes">
                <v-col v-for="(n, i) in item.notes" :key="`${item.Name}_n${i}`">
                  <cc-tooltip simple inline :content="n">
                    <v-icon color="active">mdi-note</v-icon>
                  </cc-tooltip>
                </v-col>
              </v-row>
            </div>
            <div
              v-else
              class="py-3 text-center fadeSelect"
              style="height: 100%"
              :style="{
                cursor: readonly ? 'inherit' : 'pointer',
              }"
              @click="if (!readonly) $refs.selectorDialog.show()"
            >
              <v-row style="height: 100%">
                <span class="heading h2 subtle--text my-auto" style="width: 100%; ">
                  // EMPTY //
                </span>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <cc-solo-dialog ref="selectorDialog" no-confirm title="SELECT EQUIPMENT" fullscreen no-pad>
      <slot name="selector" />
    </cc-solo-dialog>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
      <cc-item-card :item="item" />
      <slot name="detail" />
      <div v-if="item">
        <v-textarea
          v-model="item.Note"
          outlined
          auto-grow
          rows="2"
          filled
          prepend-icon="mdi-note"
          label="Equipment Notes"
        />
      </div>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'slot-card-base',
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
#underline-parent {
  background-color: var(--v-light-panel-darken1);
  transition: background-color 0.4s ease-in-out;
}

#underline-parent:hover {
  background-color: var(--v-light-panel-base);
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 10;
  background-color: var(--v-grey-base);
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

#underline-parent:hover > .underline-slide::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}
</style>
