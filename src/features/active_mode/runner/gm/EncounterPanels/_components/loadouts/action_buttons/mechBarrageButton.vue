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

      <cc-synergy-display location="attack"
        :mech="controller.Parent"
        alert />

      <div v-for="(selectedWeapon, idx) in selectedWeapons"
        :key="selectedWeapon ? selectedWeapon.InstanceID : `empty-${idx}`">
        <div v-if="!selectedWeapon"
          class="text-cc-overline text-disabled pl-3 py-2">
          select barrage weapon
        </div>
        <v-row dense
          align="center"
          class="bg-panel heading h3 pb-1 px-3">
          <v-divider v-if="presetWeapon"
            class="my-1 " />
          <v-col v-if="!presetWeapon || idx > 0">
            <cc-select v-model="selectedWeapons[idx]"
              :items="barrageWeapons"
              bg-color="background"
              color="primary"
              return-object
              item-title="Name"
              @update:model-value="setSelected(idx, $event)" />

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

        <mech-mount-bonus-card v-if="selectedMount(selectedWeapon)"
          v-for="b in selectedMount(selectedWeapon).Bonuses"
          :key="b.ID"
          expanded
          :bonus="b"
          :mech="owner.actor.CombatController.Parent"
          :encounter="encounter" />

        <div class="px-6">

          <cc-synergy-display v-if="selectedWeapon"
            :item="selectedWeapon"
            location="weapon"
            :mech="controller.Parent"
            alert />

          <mech-weapon-attack v-if="selectedWeapon && events[idx]?.weaponEvent"
            :event="<WeaponAttackEvent>events[idx].weaponEvent"
            :owner="owner"
            :encounter="encounter"
            :profile="<WeaponProfile>events[idx].weaponEvent.Weapon" />

          <div
            v-if="selectedMount(selectedWeapon) && events[idx]?.auxEvents && events[idx]?.auxEvents.length"
            class="mt-4">
            <v-divider class="my-4" />
            <div class="text-cc-overline text-disabled mb-1">
              additional {{ selectedMount(selectedWeapon).Name }} aux weapons
            </div>
            <div v-for="(aux, aidx) in events[idx]?.auxEvents">
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
                  <cc-switch v-model="events[idx].include[aidx]"
                    bg-color="background"
                    :label="`Include`"
                    @update:model-value="setInclude(idx, selectedWeapon as MechWeapon)" />
                </v-col>
              </v-row>
              <v-slide-y-reverse-transition>
                <div v-if="aux && events[idx]?.include[aidx]">
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
      </div>

      <v-slide-y-transition>
        <staged-panel v-if="allEventsStaged"
          :events=eventArray />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">

        <apply-button v-if="events.length"
          :event="<ActiveEffectEvent[]>events.map(e => e.weaponEvent.BaseEvent)"
          :weapon-event="<WeaponAttackEvent[]>events.map(e => e.weaponEvent)"
          :encounter="encounter"
          :owner="owner"
          :close="close"
          :action="action"
          :action-id="selectedWeapons.length ? selectedWeapons.map(w => w.InstanceID) : []"
          activation-override="full"
          @reset="reset($event)"
          @apply="apply" />
      </div>

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
import StagedPanel from './_stagedPanel.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';

export default {
  name: 'MechBarrageButton',
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
    ApplyButton,
    StagedPanel
  },
  data: () => ({
    events: [] as {
      weaponEvent: WeaponAttackEvent,
      auxes: MechWeapon[],
      auxEvents: WeaponAttackEvent[],
      include: boolean[],
    }[],
    selectedWeapons: [] as MechWeapon[],
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
      if (this.presetWeapon) {
        return !this.controller.IsActionUsed(this.presetWeapon.InstanceID);
      }
      return !this.controller.IsActionUsed(this.action.ID);
    },
    barrageWeapons() {
      const mech = this.controller.ActiveActor;
      if (!mech || !mech.MechLoadoutController) return []
      let arr = mech.MechLoadoutController.ActiveLoadout.Weapons.filter(
        (x) => x.Barrage
      );

      arr = arr.filter(w => !this.selectedWeapons.map(x => x.InstanceID).some(y => y === w.InstanceID));

      return arr;
    },
    eventArray() {
      let out = [] as any[];
      for (let i = 0; i < this.selectedWeapons.length; i++) {
        const ev = this.events[i];
        if (ev && ev.weaponEvent) {
          out.push(ev.weaponEvent);
          const enabledAuxes = ev.auxEvents.filter((x, idx) => ev.include[idx]);
          out = out.concat(enabledAuxes);
        }
      }
      return out;
    },
    allEventsStaged() {
      if (!this.eventArray.length) return false;
      return this.eventArray.every((e) => e.BaseEvent.Staged);
    }
  },
  methods: {
    ordnanceWarning(selectedWeapon) {
      if (!selectedWeapon) return false;
      if (selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    selectedMount(selectedWeapon) {
      if (!selectedWeapon) return null;
      const aa = this.owner.actor.CombatController.RootActor;
      if (!aa.ActiveMech) return null;

      return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find((m) => m.Weapons.includes(selectedWeapon));
    },
    setSelected(index: number, weapon: MechWeapon) {
      if (!weapon) return;

      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounter');
      }

      this.selectedWeapons[index] = weapon;
      const auxes = this.selectedMount(weapon).Weapons.filter(
        (x) =>
          x.InstanceID !== weapon.InstanceID && x.Size.toLowerCase() === 'auxiliary'
      );

      const auxEvents = auxes.map(x => new WeaponAttackEvent(x.SelectedProfile as WeaponProfile, this.owner as CombatantData, this.encounter, 'Additional Aux Attack'))

      this.events[index] = {
        weaponEvent: new WeaponAttackEvent(weapon.SelectedProfile as WeaponProfile, self, this.encounter, 'Barrage'),
        auxes,
        auxEvents,
        include: auxEvents.map(() => true),
      };

      if (weapon.Size.toLowerCase() === 'superheavy') {
        this.selectedWeapons = [weapon];
        this.events = [this.events[index]];
      } else if (this.selectedWeapons.length === 1) {
        this.selectedWeapons.push(undefined as any);
        this.events.push(undefined as any);
      }
    },
    setInclude(index: number, selectedWeapon: MechWeapon) {
      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounter');
      }

      const auxes = this.selectedMount(selectedWeapon).Weapons.filter(
        (x) =>
          x.InstanceID !== selectedWeapon.InstanceID && x.Size.toLowerCase() === 'auxiliary'
      );

      this.events[index].auxEvents = []

      for (let i = 0; i < this.events[index].include.length; i++) {
        this.events[index].auxEvents.push(
          new WeaponAttackEvent(auxes[i].SelectedProfile as WeaponProfile, this.owner as CombatantData, this.encounter, 'Additional Aux Attack')
        );
      }
    },
    reset(clearAction = false) {
      if (clearAction) this.owner.CombatController.ClearActionUsed(this.action.ID);

      this.selectedWeapons = new Array(2);
      this.events = new Array(2);

      if (!this.selectedWeapons[0] && this.presetWeapon) {
        this.setSelected(0, this.presetWeapon);
      }
    },
    apply() {
      const actor = this.owner.actor.CombatController.ActiveActor.CombatController;
      this.selectedWeapons.forEach((w) => {
        actor.MarkActionUsed(w.InstanceID);
      });
      if (actor.CanActivate('full')) {
        actor.toggleCombatAction('full');
      }
      this.reset();
    },
  },
};
</script>