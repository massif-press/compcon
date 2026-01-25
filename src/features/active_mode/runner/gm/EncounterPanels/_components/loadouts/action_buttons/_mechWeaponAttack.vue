<template>
  <div>
    <div>
      <cc-alert v-if="weapon.Destroyed"
        color="error"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon has been destroyed and must be repaired before it can be activated.
      </cc-alert>
      <cc-alert v-if="weapon.Used"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon has already been activated.
        <span v-if="weapon.Used && weapon.IsLoading">
          It must be reloaded before it can be used again.
        </span>
      </cc-alert>
      <cc-alert v-if="ordnanceWarning"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This mech has taken non-Protocol actions this turn. This ordnance weapon cannot be
        activated.
      </cc-alert>
      <cc-alert v-if="weapon.IsLimited && weapon.Uses === 0"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon is out of uses and cannot be activated this turn.
      </cc-alert>
    </div>

    <cc-panel v-if="weapon.Mod"
      color="mod"
      variant="outlined"
      class="mb-2">
      <div class="text-cc-overline">
        <v-icon icon="cc:weaponmod"
          class="mt-n1 mr-1" />
        {{ weapon.Mod.Name }}
      </div>
      <p v-html-safe="weapon.Mod.Effect"
        class=text-text />
    </cc-panel>

    <div v-if="weapon.Profiles.length > 1">
      <v-btn v-for="(profile, index) in weapon.Profiles"
        size="small"
        flat
        tile
        :color="index === weapon.ProfileIndex ? 'primary' : 'panel'"
        height="24"
        :style="`width: calc(100%/${weapon.Profiles.length})`"
        :key="`profile_${index}`"
        @click="weapon.ProfileIndex = index">
        {{ profile.Name }}
      </v-btn>
    </div>


    <effect-applicator :event="event.BaseEvent" />

    <cc-panel v-for="e in event.TargetEvents"
      :title="e.Effect.Name"
      density="compact"
      variant="tonal"
      class="mt-n2">
      <div class="text-text">
        {{ e.Effect.Detail }}
        <effect-applicator :event="e" />
      </div>
    </cc-panel>




    <!-- <div v-if="attackResults.length"
      class="text-cc-overline text-disabled">
      <cc-slashes />
      RESULTS
    </div> -->

    <!-- <cc-panel v-for="item in attackResults"
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
            v-if="item.damageCalc.incoming > 0 || weapon.Reliable">
            <v-chip :color="`damage--${item.type.toLowerCase()}`"
              flat
              tile>
              {{ Math.max(item.incoming, item.reliable) }}
              <v-icon size="22"
                :color="`damage--${item.type.toLowerCase()}`"
                :icon="`cc:${item.type.toLowerCase()}`" />
              <v-icon v-if="weapon.Reliable && item.incoming <= item.reliable"
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

<v-col cols="auto" v-if="hasCondition(item.damageCalc.resist, 'vulnerability')">
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

<v-col cols="auto" v-if="item.armorCalc > 0">
  -{{ item.armorCalc }}
  <v-icon icon="mdi-shield-outline" size="25" class="ml-n1" />
</v-col>

<v-col cols="auto" v-if="hasCondition(item.damageCalc.condition, 'shredded')">
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

<v-col cols="auto" v-if="hasCondition(item.damageCalc.resist, 'resistance')">
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

<v-col cols="auto" v-if="hasCondition(item.damageCalc.resist, 'immunity')">
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
<v-col cols="auto" class="heading h3">=</v-col>

<v-col cols="auto" class="heading h3">
  <v-text-field type="number" v-model="item.damageCalc.total" :min="0" density="compact"
    hide-spin-buttons hide-details flat tile class="mr-n2" max-width="100">
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
      <v-list-item v-for="d in damageTypes" :class="d === item.type.toLowerCase() ? 'bg-panel' : ''"
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

<div v-if="item.hitType === 'MISS' && weapon.SelectedProfile.OnMiss">
  <div class="text-cc-overline text-text mt-2">
    <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
    On Miss Effect
  </div>
  <menu-input :active-effect="weapon.SelectedProfile.OnMiss" :encounter="encounter"
    :owner="controller.Parent" :close="close" :initial-targets="selectedTargets"
    ref="onMissMenuInput" embedded @apply="apply" @reset="reset" />
</div>
<div v-if="weapon.SelectedProfile.OnAttack">
  <div class="text-cc-overline text-text mt-2">
    <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
    On Attack Effect
  </div>
  <menu-input :active-effect="weapon.SelectedProfile.OnAttack" :encounter="encounter"
    :owner="controller.Parent" :close="close" :initial-targets="selectedTargets"
    ref="onAttackMenuInput" embedded @apply="apply" @reset="reset" />
</div>
<div v-if="
        (item.hitType === 'HIT' || item.hitType === 'CRIT') &&
        weapon.SelectedProfile.OnHit
      ">
  <div class="text-cc-overline text-text mt-2">
    <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
    On Hit Effect
  </div>
  <menu-input :active-effect="weapon.SelectedProfile.OnHit" :encounter="encounter"
    :owner="controller.Parent" :close="close" :initial-targets="selectedTargets"
    ref="onHitMenuInput" embedded @apply="apply" @reset="reset" />
</div>
<div v-if="item.hitType === 'CRIT' && weapon.SelectedProfile.OnCrit">
  <div class="text-cc-overline text-text mt-2">
    <v-icon icon="cc:weapon" class="mt-n1 ml-1"></v-icon>
    On Crit Effect
  </div>
  <menu-input :active-effect="weapon.SelectedProfile.OnCrit" :encounter="encounter"
    :owner="controller.Parent" :close="close" :initial-targets="selectedTargets"
    ref="onCritMenuInput" embedded @apply="apply" @reset="reset" />
</div>
</cc-panel> -->
  </div>
</template>

<script lang="ts">
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

export default {
  name: 'MechWeaponAttack',
  props: {
    event: { type: WeaponAttackEvent, required: true },
    profile: { type: WeaponProfile, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
    isAdditionalAux: { type: Boolean, default: false },
  },
  components: {
    EffectApplicator,
  },
  mounted() {
    console.log(this.event)
  },
  computed: {
    ordnanceWarning() {
      if (!this.profile) return false;
      if (this.profile.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    canUse() {
      if (!this.profile) return false;
      return !this.profile.Used && !this.profile.Parent.Destroyed &&
        (!this.profile.Parent.IsLimited || this.profile.Uses > 0);
    },
    weapon() {
      return this.profile.Parent;
    }
  },
};
</script>
