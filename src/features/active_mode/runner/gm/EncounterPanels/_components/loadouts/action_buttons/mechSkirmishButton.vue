<template>
  <cc-dialog :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw"
    no-gutters>
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        size="small"
        :color="available ? action.Color : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon :icon="action.Icon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              <div v-if="!canUse">This action has already been used this turn.</div>
              <div v-else>
                Insufficient
                <v-chip :color="action.Color"
                  size="small"
                  variant="elevated"
                  :prepend-icon="action.Icon || ''">
                  {{ action.Activation }}
                </v-chip>
                actions remaining this turn.
              </div>
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="action.Color"
              :prepend-icon="action.Icon"
              variant="elevated"
              elevation="0">
              {{ action.Activation }} Action
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #default="{ close }">
      <mech-mount-bonus-card v-if="selectedMount"
        v-for="b in selectedMount.Bonuses"
        :key="b.ID"
        expanded
        :bonus="b"
        :mech="owner.actor.CombatController.Parent"
        :encounter="encounter" />

      <v-card flat
        tile>

        <cc-synergy-display v-if="selectedWeapon"
          location="attack"
          :mech="controller.Parent"
          alert />

        <div v-if="!presetWeapon"
          class="text-cc-overline text-disabled pl-3 py-2">
          select weapon
        </div>
        <v-row dense
          align="center"
          class="bg-panel heading h3 pb-1 px-3">
          <v-divider v-if="presetWeapon"
            class="my-1 " />
          <v-col v-if="!presetWeapon">
            <cc-select v-model="selectedWeapon"
              :items="skirmishWeapons"
              bg-color="background"
              color="primary"
              return-object
              item-title="Name"
              @update:model-value="reset()" />

          </v-col>
          <v-col v-else-if="selectedWeapon">
            <v-icon icon="cc:weapon"
              class="ml-4 mt-n1" />
            {{ selectedWeapon.Name }}
          </v-col>
          <v-col v-if="selectedWeapon"
            cols="auto">
            <cc-tags :tags="selectedWeapon.Tags" />
          </v-col>
          <v-col v-if="selectedWeapon?.Mod"
            cols="auto">
            <cc-tags :tags="selectedWeapon.Mod!.AddedTags"
              color="mod" />
          </v-col>
          <v-col v-if="selectedWeapon"
            cols="auto">
            <v-menu open-on-hover
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
        </v-row>

        <div class="px-6">

          <cc-synergy-display v-if="selectedWeapon"
            :item="selectedWeapon"
            location="weapon"
            :mech="controller.Parent"
            alert />

          <mech-weapon-attack v-if="selectedWeapon && event"
            :event="<WeaponAttackEvent>event"
            :owner="owner"
            :encounter="encounter"
            :profile="<WeaponProfile>event.Weapon"
            @weapon-changed="onWeaponChanged" />

          <div v-if="auxEvents && auxEvents.length"
            class="mt-4">
            <v-divider class="my-4" />
            <div class="text-cc-overline text-disabled mb-1">
              additional {{ selectedMount.Name }} aux weapons
            </div>
            <div v-for="(aux, aidx) in auxEvents">
              <v-row dense
                align="center"
                class="bg-panel mb-1 heading">
                <v-col cols="auto">
                  <v-icon icon="cc:weapon"
                    class="ml-4"
                    start />
                </v-col>
                <v-col>
                  {{ aux.Weapon.Name }}
                </v-col>
                <v-col cols="auto">
                  <cc-tags :tags="aux.Weapon.Tags" />
                </v-col>
                <v-col v-if="(aux.Weapon as WeaponProfile).Parent.Mod"
                  cols="auto">
                  <cc-tags :tags="(aux.Weapon as WeaponProfile).Parent.Mod!.AddedTags"
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
                  <cc-synergy-display :key="aux.Weapon.ID"
                    :item="(aux.Weapon as WeaponProfile).Parent"
                    location="weapon"
                    :mech="controller.Parent"
                    alert />

                  <mech-weapon-attack v-if="selectedWeapon"
                    :event="<WeaponAttackEvent>aux"
                    :owner="owner"
                    :encounter="encounter"
                    :profile="<WeaponProfile>aux.Weapon" />

                </div>
              </v-slide-y-reverse-transition>
            </div>
          </div>

        </div>

        <v-divider />
        <div class="pa-4">

          <apply-button v-if="event"
            :event="<ActiveEffectEvent>event.BaseEvent"
            :encounter="encounter"
            :owner="owner"
            :close="close"
            @reset="reset($event)" />
        </div>
      </v-card>

    </template>
  </cc-dialog>
</template>

<script lang="ts">
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import MechMountBonusCard from '../_mechMountBonusCard.vue';
import { MechWeapon } from '@/class';
import { CombatantData } from '@/classes/encounter/Encounter';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon';
import MechWeaponAttack from './_mechWeaponAttack.vue';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';

export default {
  name: 'MechSkirmishButton',
  props: {
    action: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: EncounterInstance,
      required: true,
    },
    presetWeapon: {
      type: MechWeapon,
      required: false,
    },
  },
  components: {
    MenuInput,
    MechMountBonusCard,
    MechWeaponAttack,
    ApplyButton
  },
  data: () => ({
    event: null as WeaponAttackEvent | null,
    auxEvents: [] as WeaponAttackEvent[],
    selectedWeapon: null as MechWeapon | null,
    include: [],
  }),
  created() {
    this.reset();
  },
  computed: {
    available() {
      return this.canActivate && this.canUse;
    },
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      return !this.controller.IsActionUsed(this.action.ID);
    },
    selectedMount() {
      if (!this.selectedWeapon) return null;
      const aa = this.owner.actor.CombatController.RootActor;
      if (!aa.ActiveMech) return null;

      return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find((m) => m.Weapons.includes(this.selectedWeapon));
    },
    ordnanceWarning() {
      if (!this.selectedWeapon) return false;
      if (this.selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    skirmishWeapons() {
      const mech = this.controller.ActiveActor;
      if (!mech || !mech.MechLoadoutController) return []
      let arr = mech.MechLoadoutController.ActiveLoadout.Weapons.filter(
        (x) => x.Skirmish
      );
      if (this.presetWeapon) {
        arr = arr.filter(w => w.InstanceID === this.presetWeapon!.InstanceID);
      }
      return arr;
    },
    barrageWeapons() {
      return []
      // let arr = this.controller.Parent.MechLoadoutController.ActiveLoadout.Weapons.filter(
      //   (x) => x.Barrage
      // );
      // if (this.isBarrageAdditional) {
      //   arr = arr.filter(w => w.WeaponSize !== WeaponSize.Superheavy)
      // } if (this.preventSelect) {
      //   arr = arr.filter(w => w.InstanceID !== this.preventSelect!.InstanceID);
      // }
      // return arr;
    },
  },
  methods: {
    reset(clearAction = false) {
      if (clearAction) this.owner.CombatController.ClearActionUsed(this.action.ID);
      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounter');
      }
      if (!this.selectedWeapon && this.presetWeapon) {
        this.selectedWeapon = this.presetWeapon;
      }

      if (!this.selectedWeapon)
        return;

      this.event = new WeaponAttackEvent(this.selectedWeapon?.SelectedProfile as WeaponProfile, self, this.encounter);
      const auxes = this.selectedMount.Weapons.filter(
        (x) =>
          x.InstanceID !== this.selectedWeapon!.InstanceID && x.Size.toLowerCase() === 'auxiliary'
      );

      this.auxEvents = auxes.map(x => new WeaponAttackEvent(x.SelectedProfile as WeaponProfile, this.owner as CombatantData, this.encounter));
    },
    stage() {
      this.$emit('activate', this.event);
    },
    apply(close: Function) {
      this.$emit('activate', this.event);
      close();
    },
    onWeaponChanged(weapon: MechWeapon) {
      this.selectedWeapon = weapon;
      this.reset();
    },
  },
};
</script>