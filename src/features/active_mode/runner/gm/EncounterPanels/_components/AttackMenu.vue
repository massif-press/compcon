<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <cc-button
        block
        flat
        tile
        size="x-small"
        color="primary"
        prepend-icon="cc:weapon"
        @click="props.onClick($event)">
        Deal damage
      </cc-button>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40" color="primary" class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="cc:weapon" class="mt-n1 ml-2" start />
            Deal Damage
          </div>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">Damage Origin</div>
          <v-row class="mb-4 mt-1 border-sm px-5 mx-12" align="center">
            <v-col>
              <div class="text-cc-overline">{{ controller.Parent.Name }}</div>
              <span class="heading h2">
                {{ item.Name }}
                <cc-slashes v-if="item.WeaponType" class="mx-2" />
                <span v-if="item.WeaponType" class="text-accent">
                  {{ item.WeaponType }}
                </span>
              </span>
            </v-col>
            <cc-range-element v-if="item.Range" :range="item.Range" />
            <cc-damage-element v-if="item.Damage" :damage="item.Damage(controller.Parent.Tier)" />
          </v-row>

          <div class="text-cc-overline">Target</div>
          <v-row dense>
            <v-col>
              <cc-select
                v-model="target"
                chip-variant="text"
                :items="targets"
                :item-title="(x) => getTargetTitle(x)"
                clearable
                return-object />
            </v-col>
            <v-col cols="auto">
              <cc-switch v-model="allowAllies" label="Allow Allies" />
            </v-col>

            <v-col cols="auto" v-if="damageSource">
              <v-btn
                flat
                tile
                block
                size="small"
                prepend-icon="mdi-calculator"
                color="primary"
                @click="setTarget()">
                Recalculate
              </v-btn>
            </v-col>
          </v-row>
          <damage-panel-internal
            ref="internal"
            :controller="controller"
            :encounter="encounter"
            :disabled="!target" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import DamagePanelInternal from './loadouts/_damagePanelInternal.vue';

export default {
  name: 'DamageMenu',
  components: {
    DamagePanelInternal,
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
  data: () => ({
    target: null,
    allowAllies: false,
  }),
  watch: {
    target(newValue) {
      // when target changes, set internal component
      this.applyItemDamage();
      this.setTarget();
    },
    internal(newValue) {
      if (newValue) this.applyItemDamage();
    },
  },
  computed: {
    side() {
      const p = this.controller.Parent.Parent
        ? this.controller.Parent.Parent
        : this.controller.Parent;
      return this.encounter.Combatants.find((x) => x.actor.ID === p.ID)?.side || 'enemy';
    },
    targets() {
      return this.allowAllies
        ? _.sortBy(this.encounter.Combatants, 'side')
        : _.sortBy(
            this.encounter.Combatants.filter((c) => c.side !== this.side),
            'side'
          );
    },
    internal() {
      return this.$refs.internal;
    },
  },
  methods: {
    getTargetTitle(target) {
      let str = target.actor.Name;
      if (target.actor.Callsign) str += ` (${target.actor.Callsign})`;
      else if (target.number > 0) str += ` (#${target.number})`;
      if (this.allowAllies) str += ` [${target.side}]`;
      return str;
    },
    applyItemDamage() {
      if (!this.$refs.internal) return;
      if (!this.item.Damage) return;
      console.log(this.item.Damage(this.controller.Parent.Tier));
      this.$refs.internal.incomingDamageValue = Number(
        this.item.Damage(this.controller.Parent.Tier)[0].Value
      );
      this.$refs.internal.incomingDamageType = {
        Name: this.item.Damage(this.controller.Parent.Tier)[0].Type,
      };
      console.log(this.$refs.internal.incomingDamageValue);
      // gather item damage data
      // set internal info
    },
    setTarget() {
      // set target
      // ref into internal to set vars
    },
  },
};
</script>
