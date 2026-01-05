<template>
  <v-row no-gutters class="bg-panel" align="center">
    <v-col v-if="canDealDamage && isFeature">
      <attack-menu :item="item" :controller="controller" :encounter="encounter" />
    </v-col>
    <v-col v-if="item.IsAI" cols="auto">
      <v-btn
        v-if="!controller.AIControl"
        :color="controller.CanActivate('protocol') ? 'protocol' : 'panel'"
        size="small"
        flat
        tile
        height="25"
        @click="enableAI">
        <v-tooltip v-if="!controller.CanActivate('protocol')" location="top">
          <template #activator="{ props }">
            <v-avatar v-bind="props" size="x-small" class="mr-2">
              <v-icon icon="mdi-exclamation-thick" color="error" />
            </v-avatar>
          </template>
          <div class="text-center text-cc-overline">Cannot activate</div>
          <v-divider class="my-1" />
          <div>
            Insufficient
            <v-chip color="protocol" size="small" variant="elevated" prepend-icon="cc:protocol">
              Protocol
            </v-chip>
            actions remaining this turn.
          </div>
        </v-tooltip>
        <v-tooltip
          location="top"
          max-width="300"
          text="Cede control of your mech to the NHP as a Protocol Action.">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-icon icon="cc:protocol" class="mr-1" size="19" />
              Cede Control
            </span>
          </template>
        </v-tooltip>
      </v-btn>

      <v-btn
        v-if="controller.AIControl"
        :color="controller.CanActivate('protocol') ? 'protocol' : 'panel'"
        size="small"
        flat
        tile
        height="25"
        @click="disableAI">
        <v-tooltip v-if="!controller.CanActivate('protocol')" location="top">
          <template #activator="{ props }">
            <v-avatar v-bind="props" size="x-small" class="mr-2">
              <v-icon icon="mdi-exclamation-thick" color="error" />
            </v-avatar>
          </template>
          <div class="text-center text-cc-overline">Cannot activate</div>
          <v-divider class="my-1" />
          <div>
            Insufficient
            <v-chip color="protocol" size="small" variant="elevated" prepend-icon="cc:protocol">
              Protocol
            </v-chip>
            actions remaining this turn.
          </div>
        </v-tooltip>
        <v-tooltip
          location="top"
          max-width="300"
          text="Reclaim control of your mech from the NHP as a Protocol Action.">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-icon icon="cc:protocol" class="mr-1" size="19" />
              Reclaim Control
            </span>
          </template>
        </v-tooltip>
      </v-btn>

      <v-tooltip location="top" max-width="300" text="Mark your mech as IN CASCADE">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="error"
            size="x-small"
            icon
            flat
            tile
            class="fade-select"
            height="25"
            @click="cascade">
            <v-icon icon="cc:monist" size="29" style="margin-top: -2px" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
    <v-spacer />

    <v-col v-if="item.IsLoading" cols="auto">
      <v-tooltip v-if="!item.Used" location="top" text="Toggle Used">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            height="26"
            tile
            variant="text"
            class="bg-primary"
            @click="use()">
            <v-icon size="x-large" icon="cc:reticle" />
          </v-btn>
        </template>
      </v-tooltip>
      <v-btn
        v-else
        v-bind="props"
        size="small"
        height="26"
        tile
        variant="text"
        class="bg-primary"
        @click="use()">
        <v-icon size="x-large" icon="cc:ammo" start />
        reload
      </v-btn>
    </v-col>

    <v-col v-else cols="auto">
      <v-tooltip location="top" text="Toggle Used">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            height="26"
            tile
            variant="text"
            :class="item.Used ? 'bg-success' : 'bg-primary'"
            @click="use()">
            <v-icon
              size="x-large"
              :icon="item.Used ? 'mdi-checkbox-marked-circle-outline' : 'mdi-circle-double'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="item.MaxUses" class="px-2 ml-1" cols="auto">
      <v-icon
        v-for="n in item.MaxUses"
        :key="n"
        :icon="n > item.Uses ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
        :disabled="item.Destroyed"
        @click="setUses(n)"
        class="mr-1" />
    </v-col>

    <v-col v-if="item.MaxUses" cols="auto" class="ml-1">
      <v-tooltip location="top" text="Reset Uses">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
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

    <v-col v-if="!isFeature" cols="auto" class="ml-1" style="z-index: 4">
      <v-tooltip location="top" text="Toggle Destroyed">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :class="item.Destroyed ? 'bg-success' : 'bg-primary'"
            :disabled="item.IsIndestructible"
            @click="item.Destroyed = !item.Destroyed">
            <v-icon size="x-large" :icon="item.Destroyed ? 'mdi-wrench' : 'mdi-cube-off'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="item.Recharge" cols="auto" class="ml-1">
      <v-tooltip location="top" :text="`Force Recharge (Recharges on: ${item.Recharge}+)`">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
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
import { EffectStatus } from '@/classes/components/feature/active_effects/EffectStatus';
import AttackMenu from '../AttackMenu.vue';
import { EffectSpecial } from '@/classes/components/feature/active_effects/EffectSpecial';

export default {
  name: 'EquipCommandPanel',
  components: {
    AttackMenu,
  },
  props: {
    item: {
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
  },
  methods: {
    setUses(n) {
      if (this.item.Uses === 1 && n === 1) {
        this.item.Uses = 0;
      } else if (this.item.MaxUses && n <= this.item.MaxUses) {
        this.item.Uses = n;
      }
    },
    use() {
      if (!this.item.Used && this.item.Uses < this.item.MaxUses) {
        this.item.Uses++;
      } else if (this.item.Used && this.item.Uses > 0) {
        this.item.Uses--;
      }
      this.item.Used = !this.item.Used;
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
  },
};
</script>
