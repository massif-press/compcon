<template>
  <cc-panel flat tile :title="mod.Name" title-color="mod" icon="cc:weaponmod" class="mb-1">
    <template #toolbar-items>
      <v-btn size="x-small" icon variant="plain" @click.stop="$emit('remove-mod')">
        <v-icon size="20" class="pt-1" icon="mdi-delete" />
      </v-btn>
    </template>
    <v-card-text class="pa-0 pb-1">
      <equipment-header :item="mod" :use-bonus="mech.Pilot.LimitedBonus" />

      <div class="text-cc-overline text-disabled">
        <v-icon icon="cc:weaponmod" />
        EQUIPMENT EFFECT
      </div>
      <div class="mb-1" :class="!mobile && 'px-4'" v-html-safe="mod.Effect" />

      <div v-if="mod.Actions.length">
        <div class="text-cc-overline text-disabled">
          <v-icon size="small" icon="cc:activate" />
          EQUIPMENT ACTIONS
        </div>
        <cc-action v-for="a in mod.Actions" :action="a" :panel="!mobile" class="ma-1" />
      </div>

      <div v-if="mod.Deployables.length">
        <div class="text-cc-overline text-disabled">
          <v-icon size="small" icon="cc:drone" />
          EQUIPMENT DEPLOYABLES
        </div>
        <cc-deployable-info
          v-for="d in mod.Deployables"
          :deployable="d"
          :panel="!mobile"
          :name-override="mod.Name"
          class="ma-1" />
      </div>

      <v-row no-gutters>
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

      <cc-solo-modal v-model="detailDialog" :title="mod.Name" icon="cc:weaponmod" shrink>
        <cc-item-card :item="mod" />
      </cc-solo-modal>
    </v-card-text>
  </cc-panel>
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
  data: () => ({
    detailDialog: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
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
