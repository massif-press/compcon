<template>
  <cc-panel flat
    tile
    :title="mod.Name"
    title-color="mod"
    icon="cc:weaponmod"
    class="mb-1">
    <v-card-text class="pa-0">
      <div class="mb-n1"
        :class="!mobile && 'px-2'"
        v-html-safe="mod.Effect" />

      <cc-combat-action-chip v-for="a in mod.Actions"
        :action="a"
        :owner="mech"
        class="mt-1"
        @activate="handleActivation($event)"
        @reset="handleRefund($event)"
        :encounter="encounter">
        <template #icon>
          <v-tooltip location="top"
            text="Equipment Action">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="cc:system" />
            </template>
          </v-tooltip>
        </template>
      </cc-combat-action-chip>

      <deploy-button v-for="d in mod.Deployables"
        :deployable="d"
        :actor="mech"
        @deploy="$emit('deploy', d)" />

      <v-row dense>
        <v-col cols="auto">
          <cc-tags small
            :tags="mod.Tags"
            color="mod"
            combat
            :bonus="mech.LimitedBonus" />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <cc-synergy-display :item="mod"
            location="mod"
            :mech="mech"
            large />
        </v-col>
      </v-row>
    </v-card-text>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'mech-mod-card',
  components: {},
  props: {
    mod: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    handleActivation(cost) {
      if (cost && this.mod.MaxUses) {
        this.mod.Uses = (this.mod.Uses || 0) + cost;
      }
    },
    handleRefund(cost) {
      if (cost && this.mod.MaxUses) {
        this.mod.Uses = (this.mod.Uses || 0) - cost;
      }
      if (this.mod.Uses < 0) this.mod.Uses = 0;
    },
  }
};
</script>
