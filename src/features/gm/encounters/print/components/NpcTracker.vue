<template>
  <v-card class="pa-2 text-caption mx-1 mb-1" variant="outlined" style="border-color: lightgray">
    <div class="text-right">
      <span v-if="combatant.playerCount > 1" cols="auto">
        <v-icon icon="mdi-account-group" color="accent" class="mr-1 mt-n1" size="small" />
        At
        <b>{{ combatant.playerCount }}</b>
        or more PCs
      </span>
      <span v-if="combatant.reinforcement" cols="auto">
        <v-icon icon="mdi-refresh" color="accent" class="mr-1" />
        REINFORCEMENT
      </span>
      <span v-if="combatant.reinforcement && combatant.reinforcementTurn > 0" cols="auto">
        <cc-slashes />
        Reinforces on Turn {{ combatant.reinforcementTurn }}
      </span>
    </div>

    <v-row dense class="text-center" justify="space-between">
      <v-col cols="auto">
        <div class="heading">{{ npc.Name }}</div>
      </v-col>
      <!-- <v-col cols="auto">
        <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
        {{ npc.StatController.getStat('Activations') }}
      </v-col>
      <v-col cols="auto">
        <v-icon v-for="n in npc.StatController.getStat('Activations')" icon="cc:activate" />
      </v-col> -->
      <v-col cols="auto">
        <v-icon icon="mdi-checkbox-blank-outline" />
        <v-icon icon="mdi-skull" />
      </v-col>
    </v-row>

    <v-row dense class="text-center mt-n3" justify="space-around">
      <v-col v-for="s in npc.StatController.TrackableStats" cols="auto">
        <div class="text-caption mb-n1 text-uppercase">{{ s.key }}</div>
        <blank-line :height="20" :width="60" class="d-inline-block mb-n1" />
        <b class="flavor-text pt-3 text-black" v-text="`/${getBonusVal(s.key)}`" />
      </v-col>
    </v-row>

    <div class="text-center mt-1">
      <v-chip
        v-for="s in statuses"
        prepend-icon="mdi-checkbox-blank-outline"
        size="small"
        variant="outlined"
        color="grey-darken-4"
        style="border-color: lightgrey"
        class="mx-2">
        <v-icon :icon="s.Icon" size="large" class="mt-n1" />
      </v-chip>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Bonus } from '@/classes/components';
import BlankLine from './blank/line.vue';
import { CompendiumStore } from '@/stores';

export default {
  name: 'print-action',
  components: { BlankLine },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
  },
  computed: {
    npc() {
      return this.combatant.npc;
    },
    statuses() {
      return CompendiumStore().Statuses;
    },
  },
  methods: {
    getBonusVal(key: string) {
      const baseVal = this.npc.StatController.getStat(key);
      const bonuses = (this.npc.FeatureController.Bonuses as Bonus[]).filter((x) =>
        x.ID.includes(key)
      );
      if (bonuses.some((b) => b.Overwrite)) return bonuses.find((b) => b.Overwrite)!.Value;
      let bonusVal = 0;
      bonuses.forEach((b) => {
        if (Array.isArray(b.Value)) {
          bonusVal += Number(b.Value[this.npc.tier]);
        } else {
          bonusVal += Number(b.Value);
        }
      });
      return (baseVal || 0) + bonusVal;
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
