<template>
  <mech-statblock :mech="mech" :pilot="pilot" :color="color">
    <template #prepend>
      <hase-pips
        :mech="mech"
        attr="hull"
        :val="pilot.MechSkillsController.MechSkills.Hull"
        :color="color" />
      <hase-pips
        :mech="mech"
        attr="agility"
        :val="pilot.MechSkillsController.MechSkills.Agi"
        :color="color" />
      <hase-pips
        :mech="mech"
        attr="systems"
        :val="pilot.MechSkillsController.MechSkills.Sys"
        :color="color" />
      <hase-pips
        :mech="mech"
        attr="engineering"
        :val="pilot.MechSkillsController.MechSkills.Eng"
        :color="color" />
      <div>
        <v-divider class="mt-2" />
        <span class="text-overline no-height">System Points</span>
        <v-tooltip>
          <template #activator="{ props }">
            <span v-bind="props" class="heading h3 no-height text-accent">
              &nbsp;{{ mech.MaxSP }}
            </span>
          </template>
          <div class="heading h4" v-text="`${mech.MaxSP} System Points`" />
          <v-divider />
          <p class="py-2" v-html="mech.SPContributors.join('<br />')" />
        </v-tooltip>
      </div>
    </template>
  </mech-statblock>
</template>

<script lang="ts">
import StatblockItem from './StatblockItem.vue';
import HasePips from './HasePips.vue';
import MechStatblock from './MechStatblock.vue';

export default {
  name: 'attributes-block',
  components: { StatblockItem, HasePips, MechStatblock },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
    widescreen(): boolean {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
