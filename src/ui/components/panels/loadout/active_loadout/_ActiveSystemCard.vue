<template>
  <v-col cols="12" lg="6" class="pa-2">
    <div style="height: 100%">
      <v-card
        flat
        tile
        :class="hide ? 'panel' : 'clipped-large panel'"
        :style="!hide ? 'height: 100%; min-height: 100px' : ''"
      >
        <v-card-title
          class="white--text py-0 heading h3 hover-item"
          style="cursor: pointer;"
          @click="empty ? '' : $refs.detailDialog.show()"
        >
          <span style="display: flex; width: 100%">
            <span v-if="item">
              <equipment-options :item="item" readonly active />
              <span v-if="!item.Destroyed" class="ml-n2">
                {{ item.Name }}
                <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
                <span class="caption subtle--text ml-1">
                  <b>{{ item.Size }}</b>
                  {{ item.Type }}
                </span>
              </span>
              <span v-else class="py-1 error" style="letter-spacing: 3px">
                &nbsp;//
                <strike>{{ item.Name }}</strike>
                //&nbsp;
              </span>
            </span>
            <v-spacer />
            <div style="display: inline-block">
              <span class="heading h2">{{ item.SP }}</span>
              <span class="heading h3">SP</span>
            </div>
            <v-btn right icon class="fadeSelect" @click.stop="hide = !hide">
              <v-icon small v-html="hide ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
            </v-btn>
          </span>
        </v-card-title>
        <v-slide-y-transition>
          <v-card-text v-if="!hide" class="underline-parent px-2 py-0 mt-0">
            <div class="underline-slide">
              <v-row dense>
                <v-col
                  v-for="(a, i) in item.Actions"
                  :key="`${item.Name}_action_${i}`"
                  style="min-width: 40%"
                >
                  <cc-action :action="a" active />
                </v-col>
              </v-row>
              <equipment-header
                :item="item"
                readonly
                :color="color"
                :use-bonus="mech.LimitedBonus"
              />
              <v-alert
                v-if="item.IsCascading"
                dense
                tile
                color="error"
                class="text-center white--text stat-text"
                style="letter-spacing: 3px;"
              >
                / / AI IN CASCADE / /
              </v-alert>
              <div v-if="item && item.Effect">
                <div class="overline mb-n2">
                  <v-icon>cci-system</v-icon>
                  EQUIPMENT EFFECT
                </div>
                <p class="text--text body-text mb-1 mr-3 ml-7" v-html="item.Effect" />
              </div>
            </div>
            <div v-if="item">
              <v-row class="text-left" dense align="end">
                <v-col>
                  <v-row justify="space-around" dense>
                    <v-col v-if="item.Deployables.length" cols="auto">
                      <v-row no-gutters justify="center">
                        <v-col
                          v-for="(d, i) in item.Deployables"
                          :key="`${item.Name}_deployable_${i}`"
                          cols="auto"
                        >
                          <cc-deployable-info
                            :deployable="d"
                            :panel="false"
                            :name-override="item.Name"
                            class="ma-2"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters class="mr-3 mt-n2" align="start">
                <v-col cols="auto">
                  <cc-tags small :tags="item.Tags" :color="color" />
                  <cc-tags v-if="item.Mod" small :tags="item.Mod.AddedTags" color="mod darken-2" />
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                  <cc-bonus-display :item="item" />
                </v-col>
                <v-col cols="auto">
                  <cc-synergy-display :item="item" location="system" :mech="mech" large />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </div>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
      <cc-item-card :item="item" />
      <slot name="detail" />
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentOptions from '../mech_loadout/components/_EquipmentOptions.vue'
import EquipmentHeader from '../mech_loadout/components/_EquipmentHeader.vue'

export default Vue.extend({
  name: 'weapon-slot-card',
  components: {
    EquipmentOptions,
    EquipmentHeader,
  },
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
  },
  data: () => ({
    hide: false,
  }),
  computed: {
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.dark)
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
