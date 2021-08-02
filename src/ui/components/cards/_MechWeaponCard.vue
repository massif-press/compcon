<template>
  <equipment-card-base :item="item" :notes="notes">
    {{ item.OnAttack }}
    <v-col v-if="item.Profiles && item.Profiles.length > 1" cols="12" class="mt-n4 mb-4">
      <div class="overline mb-1">WEAPON PROFILES</div>
      <v-tabs v-model="tab" grow height="30px">
        <v-tab v-for="p in item.Profiles" :key="p.ID">
          <span class="accent--text font-weight-bold">{{ p.Name }}</span>
        </v-tab>
      </v-tabs>
    </v-col>
    <div v-else slot="other_effects">
      <div v-if="item.ProfileOnAttack" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline stark--text">ON ATTACK</span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileOnAttack" />
      </div>
      <div v-if="item.ProfileOnHit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline stark--text">ON HIT</span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileOnHit" />
      </div>
      <div v-if="item.ProfileOnCrit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline stark--text">ON CRITICAL HIT</span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileOnCrit" />
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
      <div v-if="item.LcpName" class="flavor-text subtle--text">{{ item.LcpName }}</div>
    </v-col>
    <v-col v-if="item.Profiles && item.Profiles.length > 1" cols="12">
      <div v-if="item.ProfileEffect" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">EQUIPMENT EFFECT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileEffect" />
      </div>
      <div v-if="item.ProfileOnAttack" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">ON ATTACK</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileOnAttack" />
      </div>
      <div v-if="item.ProfileOnHit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">ON HIT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileOnHit" />
      </div>
      <div v-if="item.ProfileOnCrit" class="panel clipped pa-2">
        <v-icon>cci-weapon</v-icon>
        <span class="overline">
          <span class="stark--text">ON CRITICAL HIT</span>
          ::{{ item.SelectedProfile.Name }}
        </span>
        <p class="text--text body-text mb-1 mx-3" v-html-safe="item.ProfileOnCrit" />
      </div>
    </v-col>

    <div slot="profile">
      <div v-if="item.Profiles.length > 1 && item.ProfileActions.length">
        <div class="overline ml-n2 subtle--text">PROFILE ACTIONS</div>
        <v-row no-gutters justify="center">
          <v-col
            v-for="(a, i) in item.ProfileActions"
            :key="`${item.Name}_action_${i}`"
            cols="auto"
          >
            <cc-action :action="a" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.Profiles.length > 1 && item.ProfileDeployables.length">
        <div class="overline ml-n2 subtle--text">PROFILE DEPLOYABLES</div>
        <v-row no-gutters justify="center">
          <v-col
            v-for="(d, i) in item.ProfileDeployables"
            :key="`${item.Name}_deployable_${i}`"
            cols="auto"
          >
            <cc-deployable-info
              :deployable="d"
              :panel="$vuetify.breakpoint.lgAndUp"
              :name-override="item.Name"
              class="ma-2"
            />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.Profiles.length > 1 && item.ProfileTags && item.ProfileTags.length">
        <div class="overline ml-n2 mb-n1 subtle--text">PROFILE TAGS</div>
        <cc-tags :tags="item.ProfileTags" extended />
      </div>
    </div>
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
    notes: { type: Boolean },
  },
  data: () => ({
    tab: 0,
  }),
  watch: {
    tab(newval: number) {
      this.item.SetProfileSelection(newval, true)
    },
  },
  mounted() {
    this.tab = this.item.ProfileIndex
  },
})
</script>
