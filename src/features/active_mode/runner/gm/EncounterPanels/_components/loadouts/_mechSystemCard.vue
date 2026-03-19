<template>
  <v-card
    flat
    tile>
    <v-card-text
      class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <equipment-destroyed-overlay :destroyed="item.Destroyed" />

      <equipment-flavor-description :description="item.FlavorDescription" />

      <cc-alert
        v-if="integrated"
        class="mt-2"
        icon="mdi-link">
        <div class="text-cc-overline">
          Integrated Equipment
          <cc-slashes />
          <v-icon
            :icon="item.IntegratedOrigin.Icon"
            class="pb-1" />
          {{ item.IntegratedOrigin.Name }}
        </div>
      </cc-alert>

      <v-table
        v-if="item && item.Ammo && item.Ammo.length"
        class="mt-2"
        hover
        density="compact">
        <tbody>
          <tr
            v-for="(a, index) in item.Ammo"
            :key="`ammo-${index}`">
            <td
              v-if="!portrait"
              style="min-width: 120px"
              class="text-accent">
              <v-icon
                icon="cc:ammo"
                size="small"
                class="mt-n1 mr-1" />
              <b>{{ a.name }}</b>
            </td>
            <td>
              <div
                v-if="portrait"
                class="text-accent">
                <v-icon
                  icon="cc:ammo"
                  size="small"
                  start />
                <b>{{ a.name }}</b>
              </div>
              <span v-html-safe="a.detail" />
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="item">
        <div v-if="item.Effect">
          <p
            v-html-safe="item.Effect"
            class="mb-1 px-2" />
        </div>

        <equipment-actions-deployables
          :item="item"
          :actor="mech"
          :owner="owner"
          :encounter="encounter"
          action-icon="cc:system"
          @deploy="$emit('deploy', $event)" />

        <v-row
          dense
          align="center">
          <v-col cols="auto">
            <cc-tags
              v-if="item.Tags"
              :tags="item.Tags"
              color="pilot"
              :bonus="mech.LimitedBonus"
              combat />
          </v-col>
          <v-col
            cols="auto"
            class="ml-auto mr-4">
            <cc-bonus
              v-for="(b, index) in item.Bonuses"
              :key="`bonus-${index}`"
              :bonus="b"
              chip />
            <cc-synergy-display
              :item="item"
              :location="synergyLocation"
              :mech="mech"
              large />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <equip-command-panel
      :owner="owner"
      :controller="mech.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script lang="ts">
import { ItemType } from '@/class'
import DeployButton from './_deployButton.vue'
import EquipCommandPanel from './_equipCommandPanel.vue'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useMobile } from '@/mixins/useMobile'

export default {
  name: 'MechSystemCombatCard',
  components: {
    DeployButton,
    EquipCommandPanel,
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
    integrated: {
      type: Boolean,
      default: false,
    },
    mech: {
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
  computed: {
    synergyLocation() {
      if (!this.item) return 'none'
      return this.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system'
    },
  },
}
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
