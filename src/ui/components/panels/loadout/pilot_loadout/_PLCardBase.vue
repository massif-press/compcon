<template>
  <v-col>
    <div style="height: 100%">
      <v-card flat tile class="clipped-large panel" style="height: 100%">
        <v-card-title class="pilot white--text py-0 heading h3" style="height: 28px">
          {{ title }}
          <cc-tooltip v-if="extended" simple inline content="Extended Harness">
            <v-icon dark right small class="mt-n1">mdi-alpha-e-box-outline</v-icon>
          </cc-tooltip>
          <v-spacer />
          <div v-if="!readonly" class="text-right">
            <v-btn v-if="item" icon dark @click="$emit('remove')">
              <v-icon class="fadeSelect">delete</v-icon>
            </v-btn>
            <v-btn icon dark @click="$refs.selectorDialog.show()">
              <v-icon class="fadeSelect" v-html="item ? 'mdi-swap-vertical-variant' : 'add'" />
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text
          :id="item ? 'underline-parent' : ''"
          class="`px-2 py-1 text-center`"
          style="height: calc(100% - 28px)"
        >
          <div class="underline-slide" style="height: 100%">
            <slot v-if="item" @click="$refs.detailDialog.show()" />
            <div
              v-else
              class="py-3 text-center fadeSelect"
              style="cursor: pointer; height: 100%"
              @click="$refs.selectorDialog.show()"
            >
              <v-row style="height: 100%">
                <span class="heading h2 grey--text my-auto" style="width: 100%; ">// EMPTY //</span>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <cc-solo-dialog ref="selectorDialog" no-confirm :title="`Equip ${title}`" fullscreen no-pad>
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
  name: 'pl-pilot-card-base',
  props: {
    title: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
    extended: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
  methods: {
    closeSelector() {
      this.$refs.selectorDialog.hide()
    },
    openDetail() {
      this.$refs.detailDialog.show()
    },
  },
})
</script>

<style scoped>
#underline-parent {
  background-color: var(--v-panel-darken1);
  transition: background-color 0.4s ease-in-out;
}

#underline-parent:hover {
  background-color: var(--v-panel-base);
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 10;
  background-color: var(--v-secondary-base);
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

#underline-parent:hover > .underline-slide::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}
</style>
