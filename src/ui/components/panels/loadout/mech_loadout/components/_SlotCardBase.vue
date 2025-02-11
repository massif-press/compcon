<template>
  <v-col>
    <div style="height: 100%">
      <v-card class="clipped-large panel" style="height: 100%">
        <v-row
          dense
          align="center"
          class="bg-pilot heading h3 pa-1"
          density="compact"
          style="cursor: pointer"
          @click="empty ? '' : ($refs as any).detailDialog.show()">
          <v-col cols="auto">
            <slot name="header" />
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <slot name="header-items" />
          </v-col>
        </v-row>
        <v-card-text class="px-2 py-0">
          <v-card v-if="item && item.FlavorDescription" variant="tonal" class="mx-1 py-1 my-2 px-2">
            <p v-if="item.FlavorDescription.length < 600" v-html-safe="item.FlavorDescription" />
            <div v-else>
              <div :style="`max-height: ${showAllFlavor ? '' : '60px'}`">
                <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
              </div>
              <div class="text-right">
                <v-btn
                  @click.stop="showAllFlavor = !showAllFlavor"
                  icon
                  color="accent"
                  class="fade-select"
                  size="x-small">
                  <v-icon
                    size="30"
                    :icon="showAllFlavor ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'" />
                </v-btn>
              </div>
            </div>
          </v-card>

          <div>
            <slot />
            <div v-if="item">
              <div v-if="item.Effect">
                <div class="text-overline text-disabled">
                  <v-icon :icon="item.Icon" start />
                  EQUIPMENT EFFECT
                </div>
                <p v-html-safe="item.Effect" class="text-text mb-1" />
              </div>
              <v-row class="text-left" density="compact" align="end">
                <v-col>
                  <v-row justify="space-around" density="compact">
                    <v-col v-if="item.Actions && item.Actions.length" cols="auto">
                      <div class="text-overline ml-n2 text-disabled">
                        <v-icon size="small" icon="cc:activate" />
                        EQUIPMENT ACTIONS
                      </div>
                      <v-row no-gutters justify="center">
                        <v-col v-for="a in item.Actions">
                          <cc-action :action="a" panel class="ma-2" />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-if="item.Deployables.length">
                      <div class="text-overline ml-n2 text-disabled">
                        <v-icon size="small" icon="cc:drone" />
                        EQUIPMENT DEPLOYABLES
                      </div>
                      <v-row no-gutters justify="center">
                        <v-col v-for="d in item.Deployables">
                          <cc-deployable-info
                            :deployable="d"
                            panel
                            :name-override="item.Name"
                            class="ma-2" />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row dense align="center">
                <v-col cols="auto">
                  <cc-tags
                    v-if="item.Tags"
                    small
                    :tags="item.Tags"
                    :color="color"
                    :bonus="mech.Pilot.LimitedBonus" />
                </v-col>
                <v-col
                  v-show="item.Profiles.length > 1"
                  v-for="p in item.Profiles"
                  class="mr-4"
                  cols="auto">
                  <div v-if="p.Tags.length">
                    <div class="text-overline my-n1" v-text="p.Name" />
                    <cc-tags
                      v-if="p.Tags"
                      small
                      :tags="p.Tags"
                      :color="color"
                      :bonus="mech.Pilot.LimitedBonus" />
                  </div>
                </v-col>
                <v-col cols="auto">
                  <cc-tags
                    v-if="item.Mod"
                    small
                    :tags="item.Mod.AddedTags"
                    color="mod darken-2"
                    :bonus="mech.Pilot.LimitedBonus" />
                </v-col>
                <v-col cols="auto" class="ml-auto mr-4 pb-2">
                  <cc-bonus-display :item="item" />
                  <cc-synergy-display :item="item" :location="synergyLocation" :mech="mech" large />
                </v-col>
              </v-row>
            </div>
            <div
              v-else
              class="py-3 text-center fade-select"
              style="height: 100%; cursor: pointer"
              @click="($refs as any).selectorDialog.show()">
              <v-row style="height: 100%">
                <div class="heading h2 text-disabled my-auto py-5" style="width: 100%">
                  // EMPTY //
                </div>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <cc-solo-dialog ref="selectorDialog" no-actions title="SELECT EQUIPMENT" fullscreen no-pad>
      <slot name="selector" />
    </cc-solo-dialog>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
      <v-container>
        <cc-item-card :item="item" notes />
        <slot name="detail" />
      </v-container>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import { ItemType } from '@/class';

export default {
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
  data: () => ({
    showAllFlavor: false,
  }),
  computed: {
    small() {
      return this.$vuetify.display.mdAndDown;
    },
    synergyLocation() {
      if (!this.item) return 'none';
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system';
    },
  },
};
</script>
