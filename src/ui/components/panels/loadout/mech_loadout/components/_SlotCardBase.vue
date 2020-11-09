<template>
  <v-col class="pa-2">
    <div style="height: 100%">
      <v-card flat tile class="clipped-large panel" style="height: 100%">
        <v-card-title
          class="white--text py-0 heading h3 hover-item"
          style="cursor: pointer;"
          @click="empty ? '' : $refs.detailDialog.show()"
        >
          <span style="display: flex; width: 100%">
            <slot name="header" />
            <v-spacer />
            <slot name="header-items" />
          </span>
        </v-card-title>
        <v-card-text :id="item ? 'underline-parent' : ''" class="`px-2 py-0 text-center`">
          <div class="underline-slide">
            <slot />
            <div v-if="item">
              <v-row class="text-left" dense align="end">
                <v-col>
                  <v-row justify="space-around" dense>
                    <v-col v-if="item.Actions && item.Actions.length" cols="auto">
                      <div v-if="!readonly" class="overline ml-n2 my-n3">EQUIPMENT ACTIONS</div>
                      <v-row no-gutters justify="center">
                        <v-col
                          v-for="(a, i) in item.Actions"
                          :key="`${item.Name}_action_${i}`"
                          cols="auto"
                        >
                          <cc-action
                            :action="a"
                            :panel="!readonly && $vuetify.breakpoint.lgAndUp"
                            class="ma-2"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-if="item.Deployables.length" cols="auto">
                      <div v-if="!readonly" class="overline ml-n2 my-n3">EQUIPMENT DEPLOYABLES</div>
                      <v-row no-gutters justify="center">
                        <v-col
                          v-for="(d, i) in item.Deployables"
                          :key="`${item.Name}_deployable_${i}`"
                          cols="auto"
                        >
                          <cc-deployable-info
                            :deployable="d"
                            :panel="!readonly && $vuetify.breakpoint.lgAndUp"
                            :name-override="item.Name"
                            class="ma-2"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters class="mr-3 mt-n2">
                <v-col cols="auto">
                  <cc-tags
                    small
                    :tags="item.Tags"
                    :color="color"
                    :bonus="mech.Pilot.LimitedBonus"
                  />
                  <cc-tags
                    v-if="item.Mod"
                    small
                    :tags="item.Mod.AddedTags"
                    color="mod darken-2"
                    :bonus="mech.Pilot.LimitedBonus"
                  />
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                  <cc-bonus-display :item="item" />
                </v-col>
                <v-col cols="auto">
                  <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large />
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
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import { ItemType } from '@/class'
import Vue from 'vue'

export default Vue.extend({
  name: 'slot-card-base',
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    empty: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    synergyLocation() {
      if (!this.item) return 'none'
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system'
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
