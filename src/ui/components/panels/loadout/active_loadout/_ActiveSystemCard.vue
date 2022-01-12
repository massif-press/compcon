<template>
  <v-col cols="12" lg="6" class="pa-2">
    <div style="height: 100%">
      <v-card
        flat
        tile
        :class="hide ? 'panel' : `${$vuetify.breakpoint.mdAndUp ? 'clipped-large' : ''} panel`"
        :style="!hide && !rest ? 'height: 100%; min-height: 100px' : ''"
      >
        <v-card-title
          class="white--text py-0 heading h3 hover-item"
          style="cursor: pointer"
          @click="$refs.detailDialog.show()"
        >
          <v-row no-gutters>
            <v-col v-if="item" cols="auto">
              <equipment-options :item="item" readonly active />
              <span v-if="!item.Destroyed" class="ml-n2" :style="item.Used ? 'opacity: 0.6' : ''">
                <cc-tooltip v-if="item.Used" inline content="Equipment has been marked as 'Used'">
                  <v-icon color="success">mdi-check</v-icon>
                </cc-tooltip>
                <span
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'white--text heading h3'
                      : 'white--text body-text font-weight-bold'
                  "
                >
                  {{ item.Name }}
                </span>
                <span v-if="item.FlavorName" class="caption ml-2 my-n1">//{{ item.TrueName }}</span>
                <span v-show="$vuetify.breakpoint.mdAndUp" class="caption subtle--text ml-1">
                  <b>{{ item.Size }}</b>
                  {{ item.Type }}
                </span>
              </span>
              <span v-else class="py-1 error" style="letter-spacing: 3px">
                &nbsp;//
                <strike>{{ item.Name }}</strike>
                //&nbsp;
              </span>
            </v-col>
            <v-col cols="auto" class="ml-auto heading">
              <v-btn v-if="!rest" right dark icon class="fadeSelect" @click.stop="hide = !hide">
                <v-icon small v-html="hide ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-slide-y-transition>
          <v-card-text v-if="!rest && !hide" class="underline-parent px-2 py-0 mt-0">
            <div class="underline-slide">
              <v-row v-if="item.Actions.length" dense justify="center" class="my-1">
                <v-col
                  v-for="(a, i) in item.Actions"
                  :key="`${item.Name}_action_${i}`"
                  style="min-width: 40%"
                  cols="12"
                  md="auto"
                  class="mb-n1"
                >
                  <cc-action
                    :action="a"
                    active
                    :activations="mech.Pilot.State.Actions"
                    :disabled="actionDisabled(a)"
                    :unusable="a.Activation === 'Protocol' && !mech.Pilot.State.IsProtocolAvailable"
                    @use="item.Use(a.Cost, $event)"
                    @undo="item.Undo(a.Cost)"
                  />
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
                style="letter-spacing: 3px"
              >
                / / AI IN CASCADE / /
              </v-alert>
              <div v-if="item && item.Effect">
                <div class="overline mt-2">
                  <v-icon>cci-system</v-icon>
                  EQUIPMENT EFFECT
                </div>
                <p v-html-safe="item.Effect" class="text--text body-text mb-1 mr-3 ml-7" />
              </div>
            </div>
            <div v-if="item">
              <div v-if="item && item.Ammo && item.Ammo.length">
                <div v-for="(a, i) in item.Ammo" :key="`${item.Name}_ammo_${i}`" class="body-text">
                  <b>{{ a.name }}</b>
                  :
                  <span v-html-safe="a.detail" />
                </div>
              </div>
              <v-row no-gutters class="mr-3 mt-n1" align="start">
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
  name: 'active-system-card',
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
    rest: {
      type: Boolean,
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
  methods: {
    actionDisabled(action) {
      if (!this.item) return true
      if (this.item.MaxUses && this.item.Uses === 0) return true
      if (this.item.Used) return true
      // if (!this.item.MaxUses && action.Deployable) {
      //   return this.mech.Pilot.State.Deployed.map(x => x.Name).includes(action.Deployable.name)
      // }
      return this.item.Destroyed || this.mech.IsStunned
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
