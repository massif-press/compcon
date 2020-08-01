<template>
  <v-col class="pa-2">
    <div style="height: 100%">
      <v-card flat tile class="clipped-large panel" style="height: 100%">
        <v-card-title
          class="white--text py-0 heading h3 hover-item"
          style="cursor: pointer;"
          @click="$refs.detailDialog.show()"
        >
          <span style="display: flex; width: 100%">
            <slot name="header" />
            <v-spacer />
            <slot name="header-items" />
          </span>
        </v-card-title>
        <v-card-text :id="item ? 'underline-parent' : ''" class="`px-2 py-1 text-center`">
          <div class="underline-slide" style="height: 100%">
            <div v-if="item" class="text-left">
              <slot />
              <!-- <v-row v-if="item.notes">
                <v-col v-for="(n, i) in item.notes" :key="`${item.Name}_n${i}`">
                  <cc-tooltip simple inline :content="n">
                    <v-icon color="active">mdi-note</v-icon>
                  </cc-tooltip>
                </v-col>
              </v-row> -->
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
      <!-- <div v-if="item">
        <v-textarea
          v-model="item.Note"
          outlined
          auto-grow
          rows="2"
          filled
          prepend-icon="mdi-note"
          label="Equipment Notes"
        />
      </div> -->
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
  background-color: var(--v-light-panel);
}

.hover-item {
  background-color: var(--v-pilot-base);
  transition: 0.4s all;
}

.hover-item:hover {
  background-color: var(--v-pilot-lighten1);
}
</style>
