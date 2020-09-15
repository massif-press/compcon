<template>
  <equipment-card-base :item="item">
    <v-col v-if="item.Profiles && item.Profiles.length > 1" cols="12" class="mt-n4 mb-4">
      <div class="overline mb-n2">WEAPON PROFILES</div>
      <v-tabs v-model="tab" grow height="30px">
        <v-tab v-for="p in item.Profiles" :key="p.ID">
          <span class="accent--text font-weight-bold">{{ p.Name }}</span>
        </v-tab>
      </v-tabs>
    </v-col>
    <div v-else slot="other_effects">
      <div v-if="item.ProfileOnAttack" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">ON ATTACK</span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileOnAttack" />
      </div>
      <div v-if="item.ProfileOnHit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">ON HIT</span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileOnHit" />
      </div>
      <div v-if="item.ProfileOnCrit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">ON CRITICAL HIT</span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileOnCrit" />
      </div>
    </div>
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider v-if="item.Range.length && item.Damage.length" vertical class="mx-4 my-2" />
    <v-col cols="auto">
      <cc-damage-element :damage="item.Damage" :type-override="item.DamageTypeOverride" />
    </v-col>
    <v-divider v-if="item.SP" vertical class="mx-4" />
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
      <div class="heading h2">{{ item.Size }} {{ item.WeaponType }}</div>
      <span v-if="item.Source" class="flavor-text subtle--text">// {{ item.LicenseString }}</span>
    </v-col>
    <v-col v-if="item.Profiles && item.Profiles.length > 1 && showProfileBlock" cols="12">
      <div v-if="item.ProfileEffect" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">EQUIPMENT EFFECT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileEffect" />
      </div>
      <div v-if="item.ProfileOnAttack" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">ON ATTACK</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileOnAttack" />
      </div>
      <div v-if="item.ProfileOnHit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">ON HIT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileOnHit" />
      </div>
      <div v-if="item.ProfileOnCrit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">ON CRITICAL HIT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html="item.ProfileOnCrit" />
      </div>
    </v-col>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-mech-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tab: 0,
  }),
  computed: {
    showProfileBlock() {
      return (
        this.item.ProfileEffect ||
        this.item.ProfileOnAttack ||
        this.item.ProfileOnHit ||
        this.item.ProfileOnCrit
      )
    },
  },
  watch: {
    tab(newval: number) {
      this.item.SetProfileSelection(newval, true)
    },
  },
})
</script>
