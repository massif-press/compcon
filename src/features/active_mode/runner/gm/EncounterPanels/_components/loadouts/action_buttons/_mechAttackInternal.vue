<template>
  <v-card flat
    tile
    class="px-12">

    <cc-synergy-display v-if="selectedWeapon"
      location="attack"
      :mech="controller.Parent"
      alert />

    <div v-if="!presetWeapon"
      class="text-cc-overline text-disabled">
      select weapon
    </div>

    <v-row dense
      align="center"
      class="bg-panel my-1 heading h3">
      <v-col v-if="!presetWeapon">
        <cc-select v-model="selectedWeapon"
          :items="barrageWeapons"
          return-object
          item-title="Name" />

      </v-col>
      <v-col v-else-if="selectedWeapon">
        <v-icon icon="cc:weapon"
          class="ml-4 mt-n1" />
        {{ selectedWeapon.Name }}
      </v-col>
      <v-col v-if="selectedWeapon"
        cols="auto">
        <v-menu :open-on-hover="!mobile"
          :open-on-click="mobile"
          max-width="600px">
          <template #activator="{ props }">
            <v-icon icon="mdi-information-outline"
              v-bind="props" />
          </template>
          <v-card class="pt-2 pb-4 px-4">
            <cc-item-card :item="selectedWeapon" />
          </v-card>
        </v-menu>
      </v-col>
      <v-col v-if="selectedWeapon"
        cols="auto">
        <cc-tags :tags="selectedWeapon.ActiveTags" />
      </v-col>
      <v-col v-if="selectedWeapon && selectedWeapon.Mod"
        cols="auto">
        <cc-tags :tags="selectedWeapon.Mod.AddedTags"
          color="mod" />
      </v-col>
    </v-row>
    <cc-synergy-display v-if="selectedWeapon"
      :key="selectedWeapon.ID"
      :item="selectedWeapon"
      location="weapon"
      :mech="controller.Parent"
      alert />

    <mech-weapon-attack v-if="selectedWeapon"
      ref="mainWeaponAttack"
      :controller="controller"
      :encounter="encounter"
      :targets="getTargetsSorted('enemy')"
      :selected-weapon="selectedWeapon"
      @ready-changed="(isReady) => updateInputReadiness('mainWeaponAttack', undefined, isReady)" />

    <div v-if="selectedMount && selectedWeaponAuxes.length"
      class="mt-4">
      <v-divider class="my-4" />
      <div class="text-cc-overline text-disabled mb-1">
        additional {{ selectedMount.Name }} aux weapons
      </div>
      <div v-for="(aux, aidx) in selectedWeaponAuxes"
        :key="aux.InstanceID">
        <v-row dense
          align="center"
          class="bg-panel mb-1 heading">
          <v-col cols="auto">
            <v-icon icon="cc:weapon"
              class="ml-4"
              start />
          </v-col>
          <v-col>
            {{ aux.Name }}
          </v-col>
          <v-col cols="auto">
            <cc-tags :tags="aux.Tags" />
          </v-col>
          <v-col v-if="aux.Mod"
            cols="auto">
            <cc-tags :tags="aux.Mod.AddedTags"
              color="mod" />
          </v-col>
          <v-col cols="auto">
            <cc-switch v-model="include[aidx]"
              bg-color="background"
              :label="`Include`" />
          </v-col>
        </v-row>
        <v-slide-y-reverse-transition>
          <div v-if="aux && include[aidx]">
            <cc-synergy-display :key="aux.ID"
              :item="aux"
              location="weapon"
              :mech="controller.Parent"
              alert />
            <mech-weapon-attack :ref="`auxWeaponAttack_${aidx}`"
              :controller="controller"
              :encounter="encounter"
              :targets="getTargetsSorted('enemy')"
              :selected-weapon="aux"
              is-additional-aux
              @ready-changed="(isReady) => updateInputReadiness('auxWeaponAttack', aidx, isReady)" />
          </div>
        </v-slide-y-reverse-transition>
      </div>
    </div>
  </v-card>
</template>

<script>
import { WeaponSize } from '@/class';
import MechWeaponAttack from './_mechWeaponAttack.vue';

export default {
  name: 'MechAttackInternal',
  components: {
    MechWeaponAttack,
  },
  props: {
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    presetWeapon: {
      type: Object,
      required: false,
    },
    isBarrageAdditional: {
      type: Boolean,
    },
    preventSelect: {
      type: Object,
    },
  },
  emits: ['weapon-changed', 'damage-staged', 'ready-changed'],
  data: () => ({
    selectedWeapon: null,
    include: [],
    finalDamageArray: [],
    inputsReady: {},
  }),
  mounted() {
    if (!this.presetWeapon) return;
    this.selectedWeapon = this.presetWeapon;
  },
  watch: {
    presetWeapon: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectedWeapon = newVal;
        }
      },
    },
    selectedWeapon: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.include = new Array(
            this.selectedWeaponAuxes ? this.selectedWeaponAuxes.length : 0
          ).fill(true);
        } else {
          this.include = [];
        }
        this.$emit('weapon-changed', newVal);
      },
    },
  },
  computed: {
    barrageWeapons() {
      let arr = this.controller.Parent.MechLoadoutController.ActiveLoadout.Weapons.filter(
        (x) => x.Barrage
      );
      if (this.isBarrageAdditional) {
        arr = arr.filter(w => w.WeaponSize !== WeaponSize.Superheavy)
      } if (this.preventSelect) {
        arr = arr.filter(w => w.InstanceID !== this.preventSelect.InstanceID);
      }
      return arr;
    },
    selectedMount() {
      if (!this.selectedWeapon) return null;
      return this.controller.Parent.MechLoadoutController.getMount(this.selectedWeapon);
    },
    selectedWeaponAuxes() {
      if (!this.selectedMount) return [];
      return this.selectedMount.Weapons.filter(
        (x) =>
          x.InstanceID !== this.selectedWeapon.InstanceID && x.Size.toLowerCase() === 'auxiliary'
      );
    },
    hasMandatoryInputs() {
      // If no weapon is selected, not ready
      if (!this.selectedWeapon) {
        return false;
      }

      // Check if main weapon attack is ready
      const mainWeaponReady = this.inputsReady['mainWeaponAttack'] ?? false;

      // Check if all enabled auxiliary weapons are ready
      let auxWeaponsReady = true;
      if (this.selectedWeaponAuxes && this.selectedWeaponAuxes.length) {
        this.selectedWeaponAuxes.forEach((aux, index) => {
          if (this.include[index]) {
            const auxReady = this.inputsReady[`auxWeaponAttack_${index}`] ?? false;
            if (!auxReady) {
              auxWeaponsReady = false;
            }
          }
        });
      }

      return mainWeaponReady && auxWeaponsReady;
    },
  },
  watch: {
    hasMandatoryInputs: {
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      },
      immediate: true,
    },
  },
  methods: {
    updateInputReadiness(componentType, index, isReady) {
      const key = index !== undefined ? `${componentType}_${index}` : componentType;
      this.inputsReady[key] = isReady;
    },
    getTargetsSorted(target) {
      let out = [];
      const self = this.encounter.Combatants.find(
        (c) => c.actor.CombatController.ActiveActor.ID === this.controller.ActiveActor.ID
      );

      if (!self) return out;

      if (self.side === 'enemy' && target === 'enemy') target = 'ally';
      else if (self.side === 'enemy' && target === 'ally') target = 'enemy';

      out = [...this.encounter.Combatants].filter((c) => !c.actor.CombatController.IsDestroyed && !c.reinforcement).sort((a, b) => {
        if (target === 'self') {
          if (a.actor.CombatController.ActiveActor.ID === this.controller.ActiveActor.ID) return -1;
          if (b.actor.CombatController.ActiveActor.ID === this.controller.ActiveActor.ID) return 1;
        }
        if (a.side === target && b.side !== target) {
          return -1;
        } else if (a.side !== target && b.side === target) {
          return 1;
        } else {
          return a.actor.CombatController.Name.localeCompare(b.actor.CombatController.Name);
        }
      });
      return out;
    },
    getDamageEffect(damage, index) {
      damage.Owner = this.controller.Parent;
      damage.Attack = this.selectedWeapon.GetAttack(index);
      damage.Reliable = this.selectedWeapon.Reliable;
      damage.Accuracy = this.selectedWeapon.Accuracy;
      return damage;
    },
    clearableConditions(target) {
      if (!target) return [];
      return target.CombatController.Statuses.filter(
        (s) => s.status.StatusType.toLowerCase() === 'condition'
      );
    },
    stage() {
      const damageArray = [];
      let overkillHeat = 0;
      let heatSelf = 0;

      // Get damage from main weapon
      if (this.$refs.mainWeaponAttack && this.selectedWeapon) {
        const mainWeaponRef = this.$refs.mainWeaponAttack;
        const weaponName = this.selectedWeapon.Name;

        overkillHeat += this.$refs.mainWeaponAttack.heatSelf || 0;

        heatSelf += mainWeaponRef.heatSelf || 0;

        // Get main weapon damage
        if (mainWeaponRef.attackResults && mainWeaponRef.attackResults.length) {
          mainWeaponRef.attackResults.forEach(result => {
            const targetId = result.target.ID || result.target.id;
            const damageValue = result.damageCalc ? result.damageCalc.total : (result.incoming || 0);


            if (damageValue > 0) {
              damageArray.push({
                targetId: targetId,
                actionName: weaponName,
                hitType: result.hitType || null,
                damageType: result.type || 'unknown',
                damageValue: damageValue
              });
            }
          });
        } else {
          // Fallback: get from damage inputs
          this.selectedWeapon.Damage.forEach((damage, index) => {
            const damageInputRef = mainWeaponRef.$refs ? mainWeaponRef.$refs[`damageInput_${index}`] : null;
            if (damageInputRef && damageInputRef.length > 0) {
              const damageInput = damageInputRef[0];
              if (damageInput.selectedTargets) {
                damageInput.selectedTargets.forEach(target => {
                  const targetId = target.ID || target.id;

                  damageArray.push({
                    targetId: targetId,
                    actionName: weaponName,
                    hitType: null,
                    damageType: damage.Type || 'unknown',
                    damageValue: damage.Value || 0
                  });
                });
              }
            }
          });
        }
      }

      // Get damage from auxiliary weapons
      if (this.selectedWeaponAuxes && this.selectedWeaponAuxes.length) {
        this.selectedWeaponAuxes.forEach((aux, auxIndex) => {
          if (this.include[auxIndex]) {
            const auxRef = this.$refs[`auxWeaponAttack_${auxIndex}`];
            if (auxRef && auxRef.length > 0) {
              const auxWeaponRef = auxRef[0];
              const auxWeaponName = aux.Name;

              overkillHeat += auxRef.heatSelf || 0;
              heatSelf += auxWeaponRef.heatSelf || 0;

              // Get aux weapon damage
              if (auxWeaponRef.attackResults && auxWeaponRef.attackResults.length) {
                auxWeaponRef.attackResults.forEach(result => {
                  const targetId = result.target.ID || result.target.id;
                  const damageValue = result.damageCalc ? result.damageCalc.total : (result.incoming || 0);

                  damageArray.push({
                    targetId: targetId,
                    actionName: auxWeaponName,
                    hitType: result.hitType || null,
                    damageType: result.type || 'unknown',
                    damageValue: damageValue
                  });
                });
              } else {
                // Fallback: get from damage inputs
                aux.Damage.forEach((damage, index) => {
                  const damageInputRef = auxWeaponRef.$refs ? auxWeaponRef.$refs[`damageInput_${index}`] : null;
                  if (damageInputRef && damageInputRef.length > 0) {
                    const damageInput = damageInputRef[0];
                    if (damageInput.selectedTargets) {
                      damageInput.selectedTargets.forEach(target => {
                        const targetId = target.ID || target.id;

                        damageArray.push({
                          targetId: targetId,
                          actionName: auxWeaponName,
                          hitType: null,
                          damageType: damage.Type || 'unknown',
                          damageValue: damage.Value || 0
                        });
                      });
                    }
                  }
                });
              }
            }
          }
        });
      }

      this.finalDamageArray = damageArray;
      this.$emit('damage-staged', damageArray);
      this.$emit('heat-staged', { overkillHeat, heatSelf });
    },
    getSelectedWeapon() {
      return this.selectedWeapon;
    },
    getDamageArray() {
      return this.finalDamageArray;
    },
  },
};
</script>