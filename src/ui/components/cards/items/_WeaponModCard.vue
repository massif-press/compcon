<template>
  <equipment-card-base :item="item">
    <v-col cols="auto" class="text-center">
      <v-icon size="56px" color="stark" class="mt-n3 mb-n2"
        >cc:weapon-mod</v-icon
      >
      <div class="text-overline mb-n1">WEAPON</div>
      <div class="overline">MODIFICATION</div>
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col
      v-if="item.AddedRange && item.AddedRange.length"
      cols="auto"
      align-self="center"
    >
      <cc-range-element :range="item.AddedRange" added />
    </v-col>
    <v-divider
      v-if="item.AddedRange && item.AddedRange.length"
      vertical
      class="mx-4"
    />
    <v-col
      v-if="item.AddedDamage && item.AddedDamage.length"
      cols="auto"
      align-self="center"
    >
      <cc-damage-element :damage="item.AddedDamage" added />
    </v-col>
    <v-divider
      v-if="item.AddedDamage && item.AddedDamage.length"
      vertical
      class="mx-4"
    />
    <v-col v-if="item.SP" cols="auto" class="text-center">
      <div class="panel clipped">
        <v-icon v-for="n in item.SP" x-large>cc:system-point</v-icon>
      </div>
      <span class="overline">
        <b>{{ item.SP }}</b>
        SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}
      </span>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <span class="flavor-text text-subtle">// {{ item.LicenseString }}</span>
      <div v-if="item.InLcp" class="flavor-text text-subtle">
        {{ item.LcpName }}
      </div>
      <div v-if="item.Restricted">
        <span class="stat-text text-error">
          RESTRICTED: {{ item.Restricted.join('/').toUpperCase() }} MOUNTS
        </span>
      </div>
    </v-col>
    <div slot="statblock">
      <div class="text-overline mb-n3">CAN BE APPLIED TO</div>
      <v-chip-group>
        <v-chip
          v-for="a in item.PossibleTypes"
          small
          label
          variant="outlined"
          class="text-uppercase"
        >
          {{ a }}
        </v-chip>
        <v-chip
          v-for="a in item.PossibleSizes"
          small
          label
          class="text-uppercase"
        >
          {{ a }}
        </v-chip>
      </v-chip-group>
      <div v-if="item.RestrictedTypes.length || item.RestrictedSizes.length">
        <div class="text-overline mb-n3">RESTRICTED</div>
        <v-chip-group>
          <v-chip
            v-for="a in item.RestrictedTypes"
            small
            label
            variant="outlined"
            color="error"
            class="text-uppercase"
          >
            {{ a }}
          </v-chip>
          <v-chip
            v-for="a in item.RestrictedSizes"
            small
            label
            color="error"
            class="text-uppercase"
          >
            {{ a }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>
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
