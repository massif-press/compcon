<template>
  <div v-if="item">
    <div v-if="item.Effect">
      <p v-html-safe="item.Effect"
        class="my-1 px-2" />
    </div>

    <div v-if="item.Actions?.length"
      class="mb-2 mt-1">
      <div class="text-cc-overline text-disabled mb-1">
        <v-icon size="small"
          icon="cc:activate"
          class="mt-n1" />
        EQUIPMENT ACTIONS
      </div>
      <cc-action v-for="(a, index) in item.Actions"
        :key="`action-${index}`"
        :action="a"
        :panel="!mobile"
        class="mb-1" />
    </div>

    <div v-if="item.Deployables?.length"
      class="mb-2">
      <div class="text-cc-overline text-disabled mb-1">
        <v-icon size="small"
          icon="cc:drone"
          class="mt-n1" />
        EQUIPMENT DEPLOYABLES
      </div>
      <cc-deployable-info v-for="(d, index) in item.Deployables"
        :key="`deployable-${index}`"
        :deployable="d"
        :panel="!mobile"
        :owner="mech"
        class="mb-1"
        :name-override="item.Name" />
    </div>

    <v-row dense
      align="center">
      <v-col cols="auto">
        <cc-tags v-if="item.Tags"
          :tags="item.Tags"
          :color="color"
          :bonus="mech.LimitedBonus" />
      </v-col>

      <v-col v-for="(p, index) in item.Profiles"
        :key="`profile-${index}`"
        v-show="item.Profiles.length > 1"
        class="mr-4"
        cols="auto">
        <div v-if="p.Tags.length">
          <div class="text-cc-overline"
            v-text="p.Name" />
          <cc-tags v-if="p.Tags"
            :tags="p.Tags"
            :color="color"
            :bonus="mech.LimitedBonus" />
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-tags v-if="item.Mod"
          :tags="item.Mod.AddedTags"
          color="mod"
          :bonus="mech.LimitedBonus" />
      </v-col>

      <v-col cols="auto">
        <cc-bonus v-for="(b, index) in item.Bonuses"
          :key="`bonus-${index}`"
          :bonus="b"
          chip />
      </v-col>

      <v-col cols="auto"
        class="ml-auto">
        <cc-bonus v-for="(b, index) in externalItemBonuses"
          :key="`ext-bonus-${index}`"
          :bonus="b" />
      </v-col>
      <v-col cols="auto"
        class="mr-4">

        <cc-synergy-display :item="item"
          :location="synergyLocation"
          :mech="mech"
          large />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile'

// Bonus IDs that are meaningful at the equipment level (not mech-wide stats like hp/armor/speed)
const ITEM_BONUS_IDS = new Set([
  'range', 'damage', 'limited_bonus', 'knockback', 'threat',
  'attack', 'melee', 'accuracy', 'min_range', 'min_damage', 'no_mods',
  'deployable_hp', 'deployable_size', 'deployable_charges', 'deployable_armor',
  'deployable_evasion', 'deployable_edef', 'deployable_heatcap', 'deployable_repcap',
  'deployable_sensor_range', 'deployable_tech_attack', 'deployable_save', 'deployable_speed',
  'deployable_resist',
  'drone_hp', 'drone_size', 'drone_charges', 'drone_armor',
  'drone_evasion', 'drone_edef', 'drone_heatcap', 'drone_repcap',
  'drone_sensor_range', 'drone_tech_attack', 'drone_save', 'drone_speed',
  'drone_resist',
])

export default {
  name: 'EquipmentDetails',
  mixins: [useMobile],
  props: {
    item: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    synergyLocation: {
      type: String,
      required: true,
    },
  },
  computed: {
    externalItemBonuses() {
      if (!this.mech?.FeatureController) return []

      const itemBonuses = new Set(this.item.Bonuses)
      const hasWeaponTypes = Array.isArray(this.item.WeaponTypes) && this.item.WeaponTypes.length > 0

      const deployables: any[] = this.item.Deployables ?? []
      const hasDrones = deployables.some(d => d.Type?.toLowerCase() === 'drone')
      const hasDeployables = deployables.some(d => d.Type?.toLowerCase() !== 'drone')

      return this.mech.FeatureController.Bonuses.filter(b => {
        if (itemBonuses.has(b)) return false
        if (!ITEM_BONUS_IDS.has(b.ID)) return false
        if (b.ID.startsWith('drone_') && !hasDrones) return false
        if (b.ID.startsWith('deployable_') && !hasDeployables) return false
        if (b.WeaponTypes.length && (!hasWeaponTypes || !b.WeaponTypes.some(wt => this.item.WeaponTypes.includes(wt)))) return false
        if (b.WeaponSizes.length && (!this.item.Size || !b.WeaponSizes.some(ws => this.item.Size === ws))) return false
        return true
      })
    },
  },
}
</script>
