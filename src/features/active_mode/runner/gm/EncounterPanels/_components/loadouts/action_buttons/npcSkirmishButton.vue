<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter"
    :preset-weapon="presetWeapon">
    <template #default="{ close }">
      <div class="px-3">
        <cc-synergy-display v-if="selectedWeapon"
          location="attack"
          :mech="controller.Parent"
          alert />
      </div>

      <div v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2">
        select skirmish weapon
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

        <npc-weapon-attack v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :owner="owner"
          :encounter="encounter"
          :weapon="<NpcWeapon>event.Weapon" />

      </div>
      <v-slide-y-transition>
        <staged-panel v-if="event && event.BaseEvent.Staged"
          :events=eventArray />

      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">

        <apply-button v-if="event"
          :event="<ActiveEffectEvent>event.BaseEvent"
          :weapon-event="<WeaponAttackEvent>event"
          :encounter="encounter"
          :owner="owner"
          :close="close"
          :action="action"
          :action-id="selectedWeapon ? selectedWeapon.InstanceID : ''"
          activation-override="quick"
          @reset="reset($event)"
          @apply="apply" />
      </div>

    </template>
  </combat-action-button>
</template>

<script lang="ts">
import { CombatantData } from '@/classes/encounter/Encounter';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import StagedPanel from './_stagedPanel.vue';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import NpcWeaponAttack from './_npcWeaponAttack.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import CombatActionButton from './CombatActionButton.vue';

export default {
  name: 'NpcSkirmishButton',
  components: {
    ApplyButton,
    StagedPanel,
    NpcWeaponAttack,
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
    event: null as WeaponAttackEvent | null,
    selectedWeapon: null as NpcWeapon | null,
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    ordnanceWarning() {
      if (!this.selectedWeapon) return false;
      if (this.selectedWeapon.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    skirmishWeapons() {
      const npc = this.controller.ActiveActor;

      let arr = (npc.NpcFeatureController?.Features || []).filter(
        (x) => !x.IsSuperheavy
      );

      if (this.presetWeapon) {
        arr = arr.filter(w => w.InstanceID === this.presetWeapon!.InstanceID);
      }

      return arr;
    },
    eventArray() {
      return [this.event]
    },
    tier() {
      return this.controller.ActiveActor.Tier;
    },

  },
  created() {
    this.reset();
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

      if (this.selectedWeapon)
        this.event = new WeaponAttackEvent(this.selectedWeapon as NpcWeapon, self, this.encounter, 'Skirmish');
    },
    apply() {
      const actor = this.owner.actor.CombatController.ActiveActor.CombatController;
      actor.MarkActionUsed(this.selectedWeapon!.InstanceID);
      if (this.selectedWeapon!.IsLoading) this.selectedWeapon!.Used = true;
      this.reset();
    },
    onWeaponChanged(weapon: NpcWeapon) {
      this.selectedWeapon = weapon;
      this.reset();
    },
  },
};
</script>
