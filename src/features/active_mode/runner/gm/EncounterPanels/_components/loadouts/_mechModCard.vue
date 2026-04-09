<template>
  <cc-panel flat
    tile
    :title="mod.Name"
    title-color="mod"
    icon="cc:weaponmod"
    class="mb-1">
    <v-card-text class="pa-0">
      <div v-html-safe="mod.Effect"
        class="mb-n1"
        :class="!mobile && 'px-2'" />

      <cc-combat-action-chip v-for="a in mod.Actions"
        :key="a.ID"
        :action="a"
        :owner="owner"
        class="mt-1"
        :encounter="encounter"
        @activate="handleActivation($event)"
        @reset="handleRefund($event)">
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
        :key="d.ID"
        :deployable="d"
        :actor="mech"
        @deploy="$emit('deploy', d)" />

      <v-row dense
        class="mt-1 mb-n1"
        justify="end">
        <v-col v-if="mod.MaxUses"
          class="px-2 ml-1"
          cols="auto">
          <v-icon v-for="n in totalUses"
            :key="n"
            :icon="n > mod.Uses ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
            :disabled="mod.Destroyed"
            class="mr-1"
            @click="setUses(n)" />
        </v-col>
      </v-row>

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
import DeployButton from './_deployButton.vue'
import { useMobile } from '@/mixins/useMobile'

export default {
  name: 'MechModCard',
  components: { DeployButton },
  mixins: [useMobile],
  props: {
    mod: {
      type: Object,
      required: true,
    },
    owner: {
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
    totalUses() {
      return Number(this.mod.MaxUses || 0) + Number(this.owner.actor.CombatController.LimitedBonus || 0)
    },
  },
  methods: {
    setUses(n) {
      if (this.mod.Uses === 1 && n === 1) {
        this.mod.Uses = 0
      } else if (this.totalUses && n <= this.totalUses) {
        this.mod.Uses = n
      }
    },
    handleActivation(cost: number) {
      if (cost && this.mod.MaxUses) {
        this.mod.Uses = (this.mod.Uses || 0) + cost
      }
    },
    handleRefund(cost: number) {
      if (cost && this.mod.MaxUses) {
        this.mod.Uses = (this.mod.Uses || 0) - cost
      }
      if (this.mod.Uses < 0) this.mod.Uses = 0
    },
  },
}
</script>
