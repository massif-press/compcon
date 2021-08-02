<template>
  <equipment-card-base :item="item">
    <v-col cols="auto" class="text-center">
      <v-icon size="56px" color="stark" class="mt-n3 mb-n2">cci-weapon-mod</v-icon>
      <div class="overline mb-n1">
        WEAPON
      </div>
      <div class="overline">
        MODIFICATION
      </div>
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col v-if="item.AddedRange && item.AddedRange.length" cols="auto" align-self="center">
      <cc-range-element :range="item.AddedRange" added />
    </v-col>
    <v-divider v-if="item.AddedRange && item.AddedRange.length" vertical class="mx-4" />
    <v-col v-if="item.AddedDamage && item.AddedDamage.length" cols="auto" align-self="center">
      <cc-damage-element :damage="item.AddedDamage" added />
    </v-col>
    <v-divider v-if="item.AddedDamage && item.AddedDamage.length" vertical class="mx-4" />
    <v-col v-if="item.SP" cols="auto" class="text-center">
      <div class="panel clipped">
        <v-icon v-for="n in item.SP" :key="`${item.ID}_sp-${n}`" x-large>cci-system-point</v-icon>
      </div>
      <span class="overline">
        <b>{{ item.SP }}</b>
        SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}
      </span>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <span class="flavor-text subtle--text">// {{ item.LicenseString }}</span>
      <div v-if="item.LcpName" class="flavor-text subtle--text">{{ item.LcpName }}</div>
      <div v-if="item.Restricted">
        <span class="stat-text error--text">
          RESTRICTED: {{ item.Restricted.join('/').toUpperCase() }} MOUNTS
        </span>
      </div>
    </v-col>
    <div slot="statblock">
      <div class="overline mb-n3">CAN BE APPLIED TO</div>
      <v-chip-group>
        <v-chip
          v-for="a in item.PossibleTypes"
          :key="`${item.ID}_allowedtype_${a}`"
          small
          label
          outlined
          class="text-uppercase"
        >
          {{ a }}
        </v-chip>
        <v-chip
          v-for="a in item.PossibleSizes"
          :key="`${item.ID}_allowedsize_${a}`"
          small
          label
          class="text-uppercase"
        >
          {{ a }}
        </v-chip>
      </v-chip-group>
      <div v-if="item.RestrictedTypes.length || item.RestrictedSizes.length">
        <div class="overline mb-n3">RESTRICTED</div>
        <v-chip-group>
          <v-chip
            v-for="a in item.RestrictedTypes"
            :key="`${item.ID}_restrictedtype_${a}`"
            small
            label
            outlined
            color="error"
            class="text-uppercase"
          >
            {{ a }}
          </v-chip>
          <v-chip
            v-for="a in item.RestrictedSizes"
            :key="`${item.ID}_restrictedsize_${a}`"
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import EquipmentCardBase from './_EquipmentCardBase.vue'
import { WeaponMod } from '@/class'

@Component({ components: { EquipmentCardBase } })
export default class WeaponModCard extends Vue {
  @Prop({ type: Object, required: true })
  readonly item: WeaponMod
}
</script>
