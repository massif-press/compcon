<template>
  <v-card flat tile color="transparent" class="mx-4 my-2 mod-border">
    <v-toolbar class="bg-mod heading h3" density="compact" style="height: 26px">
      <v-row dense align="center" style="margin-top: -26px; padding-top: 0px">
        <equipment-options slot="options" :item="mod" />
        {{ mod.Name }}
        <v-spacer />
        <span v-if="mod.SP" class="pr-3">{{ mod.SP }}SP</span>
        <v-btn size="x-small" icon color="error" variant="plain" @click.stop="$emit('remove-mod')">
          <v-icon size="20" icon="mdi-delete" />
        </v-btn>
      </v-row>
    </v-toolbar>
    <div class="mod-border px-2">
      <equipment-header :item="mod" :use-bonus="mech.Pilot.LimitedBonus" />
      <div class="py-1">
        <div class="text-cc-overline text-disabled">
          <v-icon icon="cc:weaponmod" />
          EQUIPMENT EFFECT
        </div>
        <div class="mb-1 mr-3 ml-7" v-html-safe="mod.Effect" />
      </div>
      <v-row class="text-left" density="compact" align="end">
        <v-col>
          <v-row justify="space-around" density="compact">
            <v-col v-if="mod.Actions.length" cols="auto">
              <div class="text-overline ml-n2 text-disabled">
                <v-icon size="small" icon="cc:activate" />
                EQUIPMENT ACTIONS
              </div>
              <v-row no-gutters justify="center">
                <v-col v-for="a in mod.Actions" cols="auto">
                  <cc-action :action="a" panel class="ma-2" />
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="mod.Deployables.length" cols="auto">
              <div class="text-overline ml-n2 text-disabled">
                <v-icon size="small" icon="cc:drone" />
                EQUIPMENT DEPLOYABLES
              </div>
              <v-row no-gutters justify="center">
                <v-col v-for="d in mod.Deployables" cols="auto">
                  <cc-deployable-info
                    :deployable="d"
                    panel
                    :name-override="mod.Name"
                    class="ma-2" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mr-3 mt-n3">
        <v-col cols="auto">
          <cc-tags small :tags="mod.Tags" />
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
</template>

<script lang="ts">
import EquipmentOptions from '../../_EquipmentOptions.vue';
import EquipmentHeader from '../../_EquipmentHeader.vue';

export default {
  name: 'mod-inset',
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
  },
};
</script>

<style scoped>
.mod-border {
  border: 1px solid darkslategray;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}
</style>
