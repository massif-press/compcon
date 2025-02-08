<template>
  <equipment-card-base :item="item">
    <v-row align="center">
      <v-col cols="auto" class="text-center">
        <v-icon size="36" color="stark" icon="cc:weaponmod" />
        <div class="text-cc-overline mt-1">
          WEAPON
          <br />
          MODIFICATION
        </div>
      </v-col>
      <v-col v-if="item.AddedRange && item.AddedRange.length" cols="auto" align-self="center">
        <cc-range-element :range="item.AddedRange" added />
      </v-col>
      <v-divider v-if="item.AddedRange && item.AddedRange.length" vertical class="mx-4" />
      <v-col v-if="item.AddedDamage && item.AddedDamage.length" cols="auto" align-self="center">
        <cc-damage-element :damage="item.AddedDamage" added />
      </v-col>
      <v-divider v-if="item.AddedDamage && item.AddedDamage.length" vertical class="mx-4" />
      <v-col v-if="item.SP" cols="auto" class="text-center">
        <div class="heading" style="font-size: 24pt">
          {{ item.SP }}
          <v-icon size="32" class="mt-n1 ml-n1" icon="cc:system_point" />
        </div>
        <span class="text-overline">SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}</span>
      </v-col>
      <v-col cols="auto" class="ml-auto text-right">
        <span class="flavor-text text-disabled">// {{ item.LicenseString }}</span>
        <div v-if="item.InLcp" class="flavor-text text-disabled">
          {{ item.LcpName }}
        </div>
        <div v-if="item.Restricted">
          <span class="stat-text text-error">
            RESTRICTED: {{ item.Restricted.join('/').toUpperCase() }} MOUNTS
          </span>
        </div>
      </v-col>
    </v-row>

    <template #statblock>
      <div class="text-overline mb-n3">CAN BE APPLIED TO</div>
      <v-chip-group column>
        <v-chip
          v-for="a in item.PossibleTypes"
          size="small"
          tile
          variant="outlined"
          class="text-uppercase">
          {{ a }}
        </v-chip>
        <v-chip v-for="a in item.PossibleSizes" size="small" tile class="text-uppercase">
          {{ a }}
        </v-chip>
      </v-chip-group>
      <div v-if="item.RestrictedTypes.length || item.RestrictedSizes.length">
        <div class="text-overline mb-n3">RESTRICTED</div>
        <v-chip-group column>
          <v-chip
            v-for="a in item.RestrictedTypes"
            size="small"
            tile
            variant="outlined"
            color="error"
            class="text-uppercase">
            {{ a }}
          </v-chip>
          <v-chip
            v-for="a in item.RestrictedSizes"
            size="small"
            tile
            color="error"
            class="text-uppercase">
            {{ a }}
          </v-chip>
        </v-chip-group>
      </div>
    </template>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'WeaponModCard',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
