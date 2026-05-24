<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter"
    :preset-weapon="presetWeapon">
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
            <cc-npc-attack-bonus :attack-bonus="selectedWeapon.AttackBonus(tier)" />
          </v-col>
          <v-col v-if="selectedWeapon"
            cols="auto">
            <cc-npc-accuracy-element :accuracy="selectedWeapon.Accuracy(tier)" />
          </v-col>
          <v-divider v-if="selectedWeapon"
            class="ml-2"
            inset
            vertical />
          <v-col v-if="selectedWeapon"
            cols="auto">
            <cc-tags :tags="selectedWeapon.Tags" />
          </v-col>
          <v-divider v-if="selectedWeapon && selectedWeapon.Tags.length > 0"
            class="mx-1"
            inset
            vertical />
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

          <npc-weapon-attack v-if="selectedWeapon && events[idx]?.weaponEvent"
            :event="<WeaponAttackEvent>events[idx].weaponEvent"
            :owner="owner"
            :encounter="encounter"
            :weapon="<NpcWeapon>events[idx].weaponEvent.Weapon" />

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
  </combat-action-button>
</template>

<script lang="ts">
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import { CombatantData } from '@/classes/encounter/Encounter';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import NpcWeaponAttack from './_npcWeaponAttack.vue';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import StagedPanel from './_stagedPanel.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import { NpcFeatureType } from '@/classes/npc/feature/NpcFeature';
import CombatActionButton from './CombatActionButton.vue';

export default {
  name: 'MechBarrageButton',
  components: {
    MenuInput,
    NpcWeaponAttack,
    ApplyButton,
    StagedPanel,
    CombatActionButton,
  },
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
      type: Object,
      required: true,
    },
    presetWeapon: {
      type: NpcWeapon,
      required: false,
    },
  },
  data: () => ({
    events: [] as {
      weaponEvent: WeaponAttackEvent,
    }[],
    selectedWeapons: [] as NpcWeapon[],
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    barrageWeapons() {
      const npc = this.controller.ActiveActor;

      let arr = (npc.NpcFeatureController?.Features || []).filter(x => x.FeatureType === NpcFeatureType.Weapon)

      if (this.presetWeapon) {
        arr = arr.filter(w => w.InstanceID !== this.presetWeapon!.InstanceID);
      }

      return arr;
    },
    eventArray() {
      const out = [] as any[];
      for (let i = 0; i < this.selectedWeapons.length; i++) {
        const ev = this.events[i];
        if (ev && ev.weaponEvent) {
          out.push(ev.weaponEvent);
        }
      }
      return out;
    },
    allEventsStaged() {
      if (!this.eventArray.length) return false;
      return this.eventArray.every((e) => e.BaseEvent.Staged);
    },
    tier() {
      return this.owner.actor.CombatController.Tier;
    }
  },
  created() {
    this.reset();
  },
  methods: {
    ordnanceWarning(selectedWeapon) {
      if (!selectedWeapon) return false;
      if (selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    setSelected(index: number, weapon: NpcWeapon) {
      if (!weapon) return;

      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounter');
      }

      this.selectedWeapons[index] = weapon;

      this.events[index] = {
        weaponEvent: new WeaponAttackEvent(weapon, self, this.encounter, 'Barrage'),
      };

      if (weapon.IsSuperheavy) {
        this.selectedWeapons = [weapon];
        this.events = [this.events[index]];
      } else if (this.selectedWeapons.length === 1) {
        this.selectedWeapons.push(undefined as any);
        this.events.push(undefined as any);
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
        if (w.IsLoading) w.Used = true;
      });
      this.reset();
    },
  },
};
</script>
