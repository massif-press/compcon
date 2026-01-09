<template>
  <div>
    <cc-alert v-if="selectedWeapon.IsDestroyed" color="error" class="my-2">
      <v-icon start icon="mdi-alert" />
      This weapon has been destroyed and must be repaired before it can be activated.
    </cc-alert>
    <cc-alert v-if="selectedWeapon.Used" color="warning" class="my-2">
      <v-icon start icon="mdi-alert" />
      This weapon has already been activated.
      <span v-if="selectedWeapon.Used && selectedWeapon.IsLoading">
        It must be reloaded before it can be used again.
      </span>
    </cc-alert>
    <cc-alert v-if="ordnanceWarning" color="warning" class="my-2">
      <v-icon start icon="mdi-alert" />
      This mech has taken non-Protocol actions this turn. This ordnance weapon cannot be activated.
    </cc-alert>
    <cc-alert
      v-if="selectedWeapon.IsLimited && selectedWeapon.Uses === 0"
      color="warning"
      class="my-2">
      <v-icon start icon="mdi-alert" />
      This weapon is out of uses and cannot be activated this turn.
    </cc-alert>
    <cc-panel v-if="selectedWeapon.Mod" color="mod">
      <div class="text-cc-overline">
        <v-icon icon="cc:weaponmod" class="mt-n1 mr-1" />
        {{ selectedWeapon.Mod.Name }}
      </div>
      <p v-if="selectedWeapon.Mod" v-html-safe="selectedWeapon.Mod.Effect"></p>
    </cc-panel>
    <div v-if="selectedWeapon.Profiles.length > 1">
      <v-btn
        v-for="(profile, index) in selectedWeapon.Profiles"
        size="small"
        flat
        tile
        :color="index === selectedWeapon.ProfileIndex ? 'primary' : 'panel'"
        height="24"
        :style="`width: calc(100%/${selectedWeapon.Profiles.length})`"
        :key="`profile_${index}`"
        @click="selectedWeapon.ProfileIndex = index">
        {{ profile.Name }}
      </v-btn>
    </div>
    <pc-attack-input
      v-for="(d, index) in selectedWeapon.Damage"
      :ref="`damageInput_${index}`"
      :key="index"
      :damage="getDamageEffect(d, index)"
      :owner="controller.Parent"
      :targets="targets"
      :additional-aux="isAdditionalAux"
      @update:results="attackResults = $event" />

    <div v-if="attackResults.length" class="text-cc-overline text-disabled">
      <cc-slashes />
      RESULTS
    </div>

    <cc-panel v-for="item in attackResults" variant="outlined">
      <div class="text-text">
        <v-row dense align="center" justify="space-between">
          <v-col
            cols="auto"
            class="heading"
            :class="`text-${item.hitType === 'MISS' ? 'error' : item.hitType === 'HIT' ? 'success' : 'exotic'}`">
            {{ item.hitType }}
          </v-col>
          <v-col cols="auto" class="heading">{{ item.target.Name }}</v-col>
          <v-col cols="auto" v-if="item.damageCalc.incoming > 0 || selectedWeapon.Reliable">
            <v-chip :color="`damage--${item.type.toLowerCase()}`" flat tile>
              {{ Math.max(item.incoming, item.reliable) }}
              <v-icon
                size="22"
                :color="`damage--${item.type.toLowerCase()}`"
                :icon="`cc:${item.type.toLowerCase()}`" />
              <v-icon
                v-if="selectedWeapon.Reliable && item.incoming <= item.reliable"
                size="18"
                icon="mdi-alpha-r-circle-outline" />
            </v-chip>
          </v-col>

          <v-col cols="auto" v-if="hasCondition(item.damageCalc.condition, 'exposed')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  class="bg-error"
                  size="small"
                  flat
                  prepend-icon="cc:status_exposed">
                  Exposed&nbsp;
                </v-chip>
              </template>
              <span class="text-cc-overline">Damage doubled</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto" v-if="hasCondition(item.damageCalc.resist, 'vulnerability')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="bg-error d-inline-flex mt-1"
                  style="border-bottom-right-radius: 5px">
                  <v-icon v-bind="props" :icon="`cc:${item.type.toLowerCase()}`" />
                  Vulnerable&nbsp;
                </div>
              </template>
              <span class="text-cc-overline">Damage doubled</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto" v-if="item.armorCalc > 0">
            -{{ item.armorCalc }}
            <v-icon icon="mdi-shield-outline" size="25" class="ml-n1" />
          </v-col>

          <v-col cols="auto" v-if="hasCondition(item.damageCalc.condition, 'shredded')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  class="bg-error"
                  size="small"
                  flat
                  prepend-icon="cc:condition_shredded">
                  Shredded&nbsp;
                </v-chip>
              </template>
              <span class="text-cc-overline">Can't benefit from Armor</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto" v-if="hasCondition(item.damageCalc.resist, 'resistance')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="bg-success d-inline-flex mt-1"
                  style="border-bottom-right-radius: 5px">
                  <v-icon v-bind="props" :icon="`cc:${item.type.toLowerCase()}`" />
                  Resistant&nbsp;
                </div>
              </template>
              <span class="text-cc-overline">Damage halved</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto" v-if="hasCondition(item.damageCalc.resist, 'immunity')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="bg-error d-inline-flex mt-1"
                  style="border-bottom-right-radius: 5px">
                  <v-icon v-bind="props" :icon="`cc:${item.type.toLowerCase()}`" />
                  Immune&nbsp;
                </div>
              </template>
              <span class="text-cc-overline">Damage ignored</span>
            </v-tooltip>
          </v-col>
          <v-col cols="auto" class="heading h3">=</v-col>

          <v-col cols="auto" class="heading h3">
            {{ item.damageCalc.total }}
            <v-icon
              :color="`damage--${item.type.toLowerCase()}`"
              :icon="`cc:${item.type.toLowerCase()}`"
              class="mt-n1 ml-n1" />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.hitType === 'MISS' && selectedWeapon.SelectedProfile.OnMiss">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
          On Miss Effect
        </div>
        <menu-input
          :active-effect="selectedWeapon.SelectedProfile.OnMiss"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
      <div v-if="selectedWeapon.SelectedProfile.OnAttack">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
          On Attack Effect
        </div>
        <menu-input
          :active-effect="selectedWeapon.SelectedProfile.OnAttack"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
      <div
        v-if="
          (item.hitType === 'HIT' || item.hitType === 'CRIT') &&
          selectedWeapon.SelectedProfile.OnHit
        ">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
          On Hit Effect
        </div>
        <menu-input
          :active-effect="selectedWeapon.SelectedProfile.OnHit"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
      <div v-if="item.hitType === 'CRIT' && selectedWeapon.SelectedProfile.OnCrit">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
          On Crit Effect
        </div>
        <menu-input
          :active-effect="selectedWeapon.SelectedProfile.OnCrit"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
    </cc-panel>
  </div>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import PcAttackInput from '@/ui/components/chips/_activeeffect/_shared/PcAttackInput.vue';
import DamageInput from '@/ui/components/chips/_activeeffect/ae_damage_input.vue';

export default {
  name: 'MechWeaponAttack',
  props: {
    selectedWeapon: { type: Object, required: true },
    controller: { type: Object, required: true },
    targets: { type: Array, default: () => [] },
    isAdditionalAux: { type: Boolean, default: false },
  },
  components: {
    DamageInput,
    MenuInput,
    PcAttackInput,
  },
  data: () => ({
    damageResults: [],
    attackResults: [],
    selectedTargets: [],
  }),
  watch: {
    selectedWeapon: {
      immediate: true,
      handler() {
        console.log(this.selectedWeapon);
      },
    },
  },
  computed: {
    ordnanceWarning() {
      if (!this.selectedWeapon) return false;
      if (this.selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.controller.CanActivate('ordnance') === false;
      }
      return false;
    },
    canUse() {
      // TODO: return action available and selected weapons used
      return true;
      // return !this.controller.IsActionUsed(this.actionId);
    },
    available() {
      return this.canActivate && this.canUse;
    },
  },
  methods: {
    hasCondition(conditions, condition) {
      return conditions.includes(condition);
    },
    getDamageEffect(damage, index) {
      damage.Owner = this.controller.Parent;
      damage.Attack = this.selectedWeapon.GetAttack(index);
      damage.Reliable = this.selectedWeapon.Reliable;
      damage.Accuracy = this.selectedWeapon.Accuracy;
      damage.Overkill = this.selectedWeapon.Overkill;
      return damage;
    },
  },
};
</script>
