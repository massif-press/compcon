<template>
  <v-col>
    <v-card flat tile color="transparent" class="mx-4 my-2 mod-border">
      <v-card-title
        class="mod darken-3 py-0 pt-n1 heading h3 white--text"
        style="height: 24px!important"
      >
        <v-row class="mt-n1" no-gutters>
          <equipment-options v-if="!action" slot="options" :item="mod" />
          <span v-if="mod.Destroyed" class="error" style="text-decoration: line-through">
            DESTROYED
          </span>
          <span v-else>
            {{ mod.Name }}
          </span>
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
        <div>
          <div class="overline">
            <v-icon>cci-system</v-icon>
            EQUIPMENT EFFECT
          </div>
          <p v-html-safe="mod.Effect" class="text--text body-text mb-1 mr-3 ml-7" />
        </div>
        <v-row v-if="!action" class="text-left" dense align="end">
          <v-col>
            <v-row justify="space-around" dense>
              <v-col v-if="mod.Actions.length" cols="auto">
                <div class="overline ml-n2 ">EQUIPMENT ACTIONS</div>
                <v-row no-gutters justify="center">
                  <v-col v-for="(a, i) in mod.Actions" :key="`${mod.Name}_action_${i}`" cols="auto">
                    <cc-action :action="a" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="mod.Deployables.length" cols="auto">
                <div class="overline ml-n2 ">EQUIPMENT DEPLOYABLES</div>
                <v-row no-gutters justify="center">
                  <v-col
                    v-for="(d, i) in mod.Deployables"
                    :key="`${mod.Name}_deployable_${i}`"
                    cols="auto"
                  >
                    <cc-deployable-info
                      :deployable="d"
                      :panel="$vuetify.breakpoint.lgAndUp"
                      :name-override="mod.Name"
                      class="ma-2"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="mr-3 mt-n2">
          <v-col v-if="!action" cols="auto">
            <cc-tags small :tags="mod.Tags" :color="color" />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <cc-bonus-display :item="mod" />
          </v-col>
          <v-col cols="auto">
            <cc-synergy-display :item="mod" location="mod" :mech="mech" large />
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
import EquipmentOptions from '../../mech_loadout/components/_EquipmentOptions.vue'
import EquipmentHeader from '../../mech_loadout/components/_EquipmentHeader.vue'

export default Vue.extend({
  name: 'active-mod-inset',
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
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    action: { type: Boolean },
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
