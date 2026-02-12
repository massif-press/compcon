<template>
  <v-row no-gutters
    class="bg-panel"
    align="center">
    <v-col v-if="canDealDamage && item.ItemType === 'PilotWeapon'">
      <pilot-fight-button :owner="owner"
        :action="fightAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="canDealDamage && isFeature && !item.IsSuperheavy">
      <npc-skirmish-button :owner="owner"
        :action="skirmishAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="canDealDamage && isFeature">
      <npc-barrage-button :owner="owner"
        :action="barrageAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="!isFeature && canDealDamage && item.Skirmish"
      cols="auto">
      <mech-skirmish-button v-if="item.Skirmish"
        :owner="owner"
        :action="skirmishAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="!isFeature && canDealDamage && item.Barrage"
      cols="auto"
      class="ml-1">
      <mech-barrage-button v-if="item.Barrage"
        :owner="owner"
        :action="barrageAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="item.IsAI"
      cols="auto">
      <v-btn v-if="!controller.AIControl"
        :color="controller.CanActivate('protocol') ? 'protocol' : 'panel'"
        size="small"
        flat
        tile
        height="25"
        @click="enableAI">
        <v-tooltip v-if="!controller.CanActivate('protocol')"
          location="top">
          <template #activator="{ props }">
            <v-avatar v-bind="props"
              size="x-small"
              class="mr-2">
              <v-icon icon="mdi-exclamation-thick"
                color="error" />
            </v-avatar>
          </template>
          <div class="text-center text-cc-overline">Cannot activate</div>
          <v-divider class="my-1" />
          <div>
            Insufficient
            <v-chip color="protocol"
              size="small"
              variant="elevated"
              prepend-icon="cc:protocol">
              Protocol
            </v-chip>
            actions remaining this turn.
          </div>
        </v-tooltip>
        <v-tooltip location="top"
          max-width="300"
          text="Cede control of your mech to the NHP as a Protocol Action.">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-icon icon="cc:protocol"
                class="mr-1"
                size="19" />
              Cede Control
            </span>
          </template>
        </v-tooltip>
      </v-btn>

      <v-btn v-if="controller.AIControl"
        :color="controller.CanActivate('protocol') ? 'protocol' : 'panel'"
        size="small"
        flat
        tile
        height="25"
        @click="disableAI">
        <v-tooltip v-if="!controller.CanActivate('protocol')"
          location="top">
          <template #activator="{ props }">
            <v-avatar v-bind="props"
              size="x-small"
              class="mr-2">
              <v-icon icon="mdi-exclamation-thick"
                color="error" />
            </v-avatar>
          </template>
          <div class="text-center text-cc-overline">Cannot activate</div>
          <v-divider class="my-1" />
          <div>
            Insufficient
            <v-chip color="protocol"
              size="small"
              variant="elevated"
              prepend-icon="cc:protocol">
              Protocol
            </v-chip>
            actions remaining this turn.
          </div>
        </v-tooltip>
        <v-tooltip location="top"
          max-width="300"
          text="Reclaim control of your mech from the NHP as a Protocol Action.">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-icon icon="cc:protocol"
                class="mr-1"
                size="19" />
              Reclaim Control
            </span>
          </template>
        </v-tooltip>
      </v-btn>

      <v-tooltip location="top"
        max-width="300"
        text="Mark your mech as IN CASCADE">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="error"
            size="x-small"
            icon
            flat
            tile
            class="fade-select"
            height="25"
            @click="cascade">
            <v-icon icon="cc:monist"
              size="29"
              style="margin-top: -2px" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
    <v-spacer />


    <v-col cols="auto">

      <v-menu open-on-hover
        :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            height="26"
            tile
            :class="item.Used ? 'bg-success' : 'bg-primary'"
            @click="onUseToggle">
            <v-icon size="x-large"
              :icon="item.Used ? 'mdi-checkbox-marked-circle-outline' : item.IsLoading ? 'cc:ammo' : 'cc:reticle'" />
          </v-btn>
        </template>
        <v-card class="text-center text-text text-cc-overline pa-2"
          width="300"
          border>
          <div v-if="item.IsLoading"><span v-if="!item.Used">Click to mark as <b>used</b>. Weapons
              with
              the LOADING tag must be reloaded before they can be loaded again</span>
            <span v-else>Click to <b>reload</b> this weapon.</span>
          </div>
          <div v-else>Click to mark {{ item.Used ? 'Unused' : 'Used' }}</div>
          <div v-if="item.HeatCost > 0">
            <v-divider class="my-1" />
            <span v-if="item.Used">Marking this equipment as unused will refund</span>
            <span v-else>
              Using this equipment will cost
            </span>
            <v-icon icon="cc:heat"
              color="damage--heat"
              size="20"
              class="mr-1" /><b class="text-damage--heat">{{ item.HeatCost }}</b> (self)
          </div>

        </v-card>
      </v-menu>

    </v-col>


    <v-col v-if="item.MaxUses"
      class="px-2 ml-1"
      cols="auto">
      <v-icon v-for="n in totalUses"
        :key="n"
        :icon="n > item.Uses ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
        :disabled="item.Destroyed"
        @click="setUses(n)"
        class="mr-1" />
    </v-col>

    <v-col v-if="item.MaxUses"
      cols="auto"
      class="ml-1">
      <v-tooltip location="top"
        text="Reset Uses">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="item.Destroyed"
            @click="item.Uses = 0">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="!isFeature"
      cols="auto"
      class="ml-1"
      style="z-index: 4">
      <v-tooltip location="top"
        text="Toggle Destroyed">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :class="item.Destroyed ? 'bg-success' : 'bg-primary'"
            :disabled="item.IsIndestructible"
            @click="item.Destroyed = !item.Destroyed">
            <v-icon size="x-large"
              :icon="item.Destroyed ? 'mdi-wrench' : 'mdi-cube-off'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="item.Recharge"
      cols="auto"
      class="ml-1">
      <v-tooltip location="top"
        :text="`Force Recharge (Recharges on: ${item.Recharge}+)`">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="!item.Used"
            :class="item.Used ? 'bg-primary' : ''"
            @click="item.Used = !item.Used">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import { EffectStatus } from '@/classes/components/feature/active_effects/effect_subtype/EffectStatus';
import { EffectSpecial } from '@/classes/components/feature/active_effects/effect_subtype/EffectSpecial';
import MechSkirmishButton from './action_buttons/mechSkirmishButton.vue';
import { CompendiumStore } from '@/stores';
import MechBarrageButton from './action_buttons/mechBarrageButton.vue';
import NpcSkirmishButton from './action_buttons/npcSkirmishButton.vue';
import NpcBarrageButton from './action_buttons/npcBarrageButton.vue';
import PilotFightButton from './action_buttons/pilotFightButton.vue';

export default {
  name: 'EquipCommandPanel',
  components: {
    MechSkirmishButton,
    MechBarrageButton,
    NpcSkirmishButton,
    NpcBarrageButton,
    PilotFightButton,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isFeature() {
      if (!this.item?.ItemType) return false;
      return this.item.ItemType.toLowerCase().includes('npc');
    },
    canDealDamage() {
      return !!this.item.Damage;
    },
    skirmishAction() {
      return CompendiumStore().Actions.find(x => x.ID === 'act_skirmish')
    },
    barrageAction() {
      return CompendiumStore().Actions.find(x => x.ID === 'act_barrage')
    },
    fightAction() {
      return CompendiumStore().Actions.find(x => x.ID === 'act_fight')
    },
    totalUses() {
      return Number(this.item.MaxUses || 0) + Number(this.controller.LimitedBonus || 0);
    },
  },
  methods: {
    setUses(n) {
      if (this.item.Uses === 1 && n === 1) {
        this.item.Uses = 0;
      } else if (this.totalUses && n <= this.totalUses) {
        this.item.Uses = n;
      }
    },
    enableAI() {
      this.controller.CombatActions.Protocol = false;
      this.controller.AIControl = true;
    },
    disableAI() {
      this.controller.CombatActions.Protocol = false;
      this.controller.AIControl = false;
    },
    cascade() {
      this.controller.AIControl = true;
      this.controller.ApplyCustomStatus(
        new EffectSpecial({
          attribute: 'In Cascade',
          detail:
            'An installed NHP has entered CASCADE and has taken full control of the mech. The mech is in control of the GM until the Pilot reclaims control by choosing to Shut Down the mech.',
        }),
        '',
        this.controller,
        this.controller,
        this.encounter
      );
    },
    onUseToggle() {
      if (this.item.HeatCost && this.item.HeatCost > 0) {
        if (!this.item.Used)
          this.controller.ApplyHeat(this.item.HeatCost);
        else this.controller.ApplyHeat(-this.item.HeatCost);
      }
      this.item.Use();
    },
  },
};
</script>
