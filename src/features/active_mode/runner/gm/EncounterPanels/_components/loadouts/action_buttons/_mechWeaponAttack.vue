<template>
  <div>
    <cc-alert v-if="selectedWeapon.IsDestroyed"
      color="error"
      class="my-2">
      <v-icon start
        icon="mdi-alert" />
      This weapon has been destroyed and must be repaired before it can be activated.
    </cc-alert>
    <cc-alert v-if="selectedWeapon.Used"
      color="warning"
      class="my-2">
      <v-icon start
        icon="mdi-alert" />
      This weapon has already been activated.
      <span v-if="selectedWeapon.Used && selectedWeapon.IsLoading">
        It must be reloaded before it can be used again.
      </span>
    </cc-alert>
    <cc-alert v-if="ordnanceWarning"
      color="warning"
      class="my-2">
      <v-icon start
        icon="mdi-alert" />
      This mech has taken non-Protocol actions this turn. This ordnance weapon cannot be activated.
    </cc-alert>
    <cc-alert v-if="selectedWeapon.IsLimited && selectedWeapon.Uses === 0"
      color="warning"
      class="my-2">
      <v-icon start
        icon="mdi-alert" />
      This weapon is out of uses and cannot be activated this turn.
    </cc-alert>
    <cc-panel v-if="selectedWeapon.Mod"
      color="mod"
      variant="outlined"
      class="mb-2">
      <div class="text-cc-overline">
        <v-icon icon="cc:weaponmod"
          class="mt-n1 mr-1" />
        {{ selectedWeapon.Mod.Name }}
      </div>
      <p v-html-safe="selectedWeapon.Mod.Effect"
        class=text-text />

      <!-- <menu-input v-for="(a, index) in selectedWeapon.Mod.Actions"
        :key="`mod_action_${index}`"
        :ref="`modAction_${index}`"
        :active-effect="a"
        :encounter="encounter"
        :owner="controller.Parent"
        :close="close"
        embedded
        color="transparent" /> -->
    </cc-panel>
    <div v-if="selectedWeapon.Profiles.length > 1">
      <v-btn v-for="(profile, index) in selectedWeapon.Profiles"
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
    <pc-attack-input v-for="(d, index) in selectedWeapon.Damage"
      :ref="`damageInput_${index}`"
      :key="index"
      :damage="getDamageEffect(d, index)"
      :owner="controller.Parent"
      :targets="targets"
      :additional-aux="isAdditionalAux"
      @update:results="attackResults = $event"
      @update:heatself="heatSelf = $event"
      @ready-changed="(isReady) => updateInputReadiness('damageInput', index, isReady)" />

    <div v-if="attackResults.length"
      class="text-cc-overline text-disabled">
      <cc-slashes />
      RESULTS
    </div>

    <cc-panel v-for="item in attackResults"
      variant="outlined">
      <div class="text-text">
        <v-row dense
          align="center"
          justify="space-between">
          <v-col cols="auto"
            class="heading"
            :class="`text-${item.hitType === 'MISS' ? 'error' : item.hitType === 'HIT' ? 'success' : 'exotic'}`">
            {{ item.hitType }}
          </v-col>
          <v-col cols="auto"
            class="heading">{{ item.target.Name }}</v-col>
          <v-col cols="auto"
            v-if="item.damageCalc.incoming > 0 || selectedWeapon.Reliable">
            <v-chip :color="`damage--${item.type.toLowerCase()}`"
              flat
              tile>
              {{ Math.max(item.incoming, item.reliable) }}
              <v-icon size="22"
                :color="`damage--${item.type.toLowerCase()}`"
                :icon="`cc:${item.type.toLowerCase()}`" />
              <v-icon v-if="selectedWeapon.Reliable && item.incoming <= item.reliable"
                size="18"
                icon="mdi-alpha-r-circle-outline" />
            </v-chip>
          </v-col>

          <v-col cols="auto"
            v-if="hasCondition(item.damageCalc.condition, 'exposed')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-chip v-bind="props"
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

          <v-col cols="auto"
            v-if="hasCondition(item.damageCalc.resist, 'vulnerability')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div v-bind="props"
                  class="bg-error d-inline-flex mt-1"
                  style="border-bottom-right-radius: 5px">
                  <v-icon v-bind="props"
                    :icon="`cc:${item.type.toLowerCase()}`" />
                  Vulnerable&nbsp;
                </div>
              </template>
              <span class="text-cc-overline">Damage doubled</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto"
            v-if="item.armorCalc > 0">
            -{{ item.armorCalc }}
            <v-icon icon="mdi-shield-outline"
              size="25"
              class="ml-n1" />
          </v-col>

          <v-col cols="auto"
            v-if="hasCondition(item.damageCalc.condition, 'shredded')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-chip v-bind="props"
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

          <v-col cols="auto"
            v-if="hasCondition(item.damageCalc.resist, 'resistance')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div v-bind="props"
                  class="bg-success d-inline-flex mt-1"
                  style="border-bottom-right-radius: 5px">
                  <v-icon v-bind="props"
                    :icon="`cc:${item.type.toLowerCase()}`" />
                  Resistant&nbsp;
                </div>
              </template>
              <span class="text-cc-overline">Damage halved</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto"
            v-if="hasCondition(item.damageCalc.resist, 'immunity')">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div v-bind="props"
                  class="bg-error d-inline-flex mt-1"
                  style="border-bottom-right-radius: 5px">
                  <v-icon v-bind="props"
                    :icon="`cc:${item.type.toLowerCase()}`" />
                  Immune&nbsp;
                </div>
              </template>
              <span class="text-cc-overline">Damage ignored</span>
            </v-tooltip>
          </v-col>
          <v-col cols="auto"
            class="heading h3">=</v-col>

          <v-col cols="auto"
            class="heading h3">
            <v-text-field type="number"
              v-model="item.damageCalc.total"
              :min="0"
              density="compact"
              hide-spin-buttons
              hide-details
              flat
              tile
              class="mr-n2"
              max-width="100">
              <template #append>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn icon
                      flat
                      tile
                      size="x-small"
                      variant="text"
                      v-bind="props">
                      <v-icon :color="`damage--${item.type.toLowerCase()}`"
                        :icon="`cc:${item.type.toLowerCase()}`"
                        size="30" />
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="d in damageTypes"
                      :class="d === item.type.toLowerCase() ? 'bg-panel' : ''"
                      @click="item.type = d">
                      <template #prepend>
                        <v-icon :color="`damage--${d}`"
                          :icon="`cc:${d}`"
                          size="30" />
                      </template>
                      {{ d.charAt(0).toUpperCase() + d.slice(1) }}
                    </v-list-item>
                  </v-list>
                </v-menu>

              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </div>

      <div v-if="item.hitType === 'MISS' && selectedWeapon.SelectedProfile.OnMiss">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon"
            class="mt-n1 ml-1"></v-icon>
          On Miss Effect
        </div>
        <menu-input :active-effect="selectedWeapon.SelectedProfile.OnMiss"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          ref="onMissMenuInput"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
      <div v-if="selectedWeapon.SelectedProfile.OnAttack">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon"
            class="mt-n1 ml-1"></v-icon>
          On Attack Effect
        </div>
        <menu-input :active-effect="selectedWeapon.SelectedProfile.OnAttack"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          ref="onAttackMenuInput"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
      <div v-if="
        (item.hitType === 'HIT' || item.hitType === 'CRIT') &&
        selectedWeapon.SelectedProfile.OnHit
      ">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon"
            class="mt-n1 ml-1"></v-icon>
          On Hit Effect
        </div>
        <menu-input :active-effect="selectedWeapon.SelectedProfile.OnHit"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          ref="onHitMenuInput"
          embedded
          @apply="apply"
          @reset="reset" />
      </div>
      <div v-if="item.hitType === 'CRIT' && selectedWeapon.SelectedProfile.OnCrit">
        <div class="text-cc-overline text-text mt-2">
          <v-icon icon="cc:weapon"
            class="mt-n1 ml-1"></v-icon>
          On Crit Effect
        </div>
        <menu-input :active-effect="selectedWeapon.SelectedProfile.OnCrit"
          :encounter="encounter"
          :owner="controller.Parent"
          :close="close"
          ref="onCritMenuInput"
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
    encounter: { type: Object, required: true },
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
    inputsReady: {},
    damageTypes: [
      'kinetic',
      'energy',
      'explosive',
      'heat',
      'burn'
    ],
    heatSelf: 0,
  }),
  watch: {
    selectedWeapon: {
      immediate: true,
      handler() {
        // Weapon changed - component will automatically re-evaluate readiness
      },
    },
    hasMandatoryInputs: {
      immediate: true,
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      }
    }
  },
  emits: ['ready-changed'],
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
    hasMandatoryInputs() {
      // Check if we have any damage inputs that need to be ready
      const damageCount = this.selectedWeapon?.Damage?.length || 0;
      if (damageCount === 0) {
        return true; // No inputs to check
      }

      // Check all damage input components are ready
      let allReady = true;
      for (let i = 0; i < damageCount; i++) {
        const inputReady = this.inputsReady[`damageInput_${i}`] === true;
        allReady = allReady && inputReady;
      }

      // Also check that all attack results have valid damage totals
      if (this.attackResults && this.attackResults.length > 0) {
        const allDamageTotalsValid = this.attackResults.every(result =>
          result.damageCalc &&
          result.damageCalc.total != null &&
          result.damageCalc.total !== '' &&
          result.damageCalc.total !== undefined
        );
        allReady = allReady && allDamageTotalsValid;
      }

      return allReady;
    },
  },
  methods: {
    updateInputReadiness(inputType, index, isReady) {
      const key = `${inputType}_${index}`;
      this.inputsReady[key] = isReady;
    },
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
