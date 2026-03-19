<template>
  <v-card flat
    tile>
    <equipment-destroyed-overlay :destroyed="item.Destroyed" />
    <v-row align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div class="mt-n2 pl-1">
          {{ item.Name }}
          <span class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            Pilot Weapon
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-range-element v-if="item.Range"
          small
          :range="item.Range" />
        <cc-slashes v-if="item.Range && item.Damage"
          class="pr-1" />
        <cc-damage-element v-if="item.Damage"
          small
          :damage="item.Damage"
          :type-override="item.DamageTypeOverride" />
      </v-col>
    </v-row>

    <div class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <equipment-flavor-description :description="item.FlavorDescription" />

        <div v-if="item"
          class="pt-1">
          <on-element v-for="action in ['hit', 'crit', 'attack']"
            :profile="item"
            :action="action" />
        </div>

        <div v-if="item">
          <div v-if="item.Effect">
            <p v-html-safe="item.Effect"
              class="mb-1 px-2" />
          </div>

          <equipment-actions-deployables :item="item"
            :actor="pilot"
            :owner="owner"
            :encounter="encounter"
            action-icon="cc:weapon"
            @deploy="$emit('deploy', $event)" />

          <v-row dense
            align="center">
            <v-col cols="auto">
              <cc-tags v-if="item.Tags"
                combat
                :tags="item.Tags"
                color="pilot"
                :bonus="pilot.LimitedBonus" />
            </v-col>
            <v-col cols="auto"
              class="ml-auto mr-4">
              <cc-bonus v-for="b in item.Bonuses"
                :bonus="b"
                chip />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </div>
    <equip-command-panel :owner="owner"
      :controller="pilot.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script lang="ts">
import EquipCommandPanel from './_equipCommandPanel.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useMobile } from '@/mixins/useMobile'

export default {
  name: 'PilotWeaponCombatCard',
  components: {
    EquipCommandPanel,
    OnElement,
    EquipmentDestroyedOverlay: DestroyedOverlay,
    EquipmentFlavorDescription: FlavorDescription,
    EquipmentActionsDeployables: ActionsDeployables,
  },
  mixins: [useMobile],
  props: {
    item: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
}
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
