<template>
    <div class="syswrap" @click="dialog = true">
        <v-layout column mx-0 my-0 class="sys primary--text">
            <v-layout
                justify-space-between
                align-center
                grow-shrink-0
                mx-0
                my-0
            >
                <v-flex
                    body-2
                    text-uppercase
                    :class="`system--${system.type} white--text sysname`"
                >
                    {{ shortName }}
                </v-flex>
                <v-layout align-center mt-0 v-if="system.type === 'weapon'">
                    <v-icon color="primary">mdi-dice-d20</v-icon>
                    <div class="font-weight-bold mr-2">
                        {{ rollString }}
                    </div>
                    <v-icon color="primary">mdi-arrow-expand-horizontal</v-icon>
                    <div
                        class="font-weight-bold mr-2 layout column justify-center"
                    >
                        <v-flex
                            py-0
                            pl-2
                            v-for="(range, i) in rangeStrings"
                            :key="i"
                        >
                            {{ range }}
                        </v-flex>
                    </div>
                    <v-icon color="primary">mdi-flare</v-icon>
                    <div
                        style="margin: 0 !important"
                        class="font-weight-bold mr-2 layout column justify-center"
                    >
                        <v-flex
                            py-0
                            pl-2
                            v-for="(damage, i) in damageStrings"
                            :key="i"
                        >
                            {{ damage }}
                        </v-flex>
                    </div>
                </v-layout>
                <v-flex
                    class="caption syseffectshort ml-3"
                    v-else-if="!isMultiline"
                >
                    {{ system.effect_short || system.effect }}
                </v-flex>
                <v-flex
                    layout
                    align-center
                    my-0
                    v-else-if="system.action || system.recharge"
                >
                    <span class="body-2 mr-1">
                        {{ actionName }}
                    </span>
                    <template v-if="system.tech_roll">
                        <v-icon color="primary">mdi-dice-d20</v-icon>
                        <div class="font-weight-bold mr-2">
                            {{ rollString }}
                        </div>
                    </template>
                    <recharge :value="system.recharge" v-if="system.recharge" />
                </v-flex>
            </v-layout>
            <v-flex
                class="caption"
                v-if="isMultiline"
                style="white-space: nowrap !important"
            >
                {{ system.effect_short || system.effect }}
            </v-flex>
            <v-flex v-if="system.tags" py-0>
                <v-chip
                    disabled
                    v-for="tag in system.tags"
                    :key="tag.id"
                    small
                    dark
                    color="primary"
                    class="white--text caption"
                    py-0
                    >{{ renderTag(tag, npc.tier) }}</v-chip
                >
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" max-width="40%">
            <system-dialog-card :npc="npc" :system="system" />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NPC from '../../logic/NPC';
import { NPCSystem } from '../../logic/interfaces/NPCSystem';
import renderTag from '../../logic/rendertag';

import SystemDialogCard from "../SystemDialogCard.vue"; 
import Recharge from "./Recharge.vue"; 

export default Vue.extend({
    name: 'npc-card-system',
    components: { SystemDialogCard, Recharge },
    props: {
      system: { required: true, type: Object },
      npc: { required: true, type: NPC },
    },
    data: () => ({
      dialog: false,
    }),
    methods: { renderTag },
    computed: {
      isMultiline(): boolean {
          return Boolean((this.system as NPCSystem.NonWeapon).action || (this.system as NPCSystem.NonWeapon).tech_roll || (this.system as NPCSystem.NonWeapon).recharge || this.system.type === 'weapon')
      },
      shortName(): string {
        const maxlength = this.system.type === 'weapon' ? 12 : 20;
        const str = this.system.name;
        if (str.length < maxlength) {
          return str;
        } else {
          return str.replace(/[aeiou]/g, '').replace(/ /gi, '.') + '';
        }
      },
      actionName(): string {
            const action = (this.system as NPCSystem.NonWeapon).action;
            if (!action) return '';
            const map = {
              free: 'Free Action',
              quick: 'Quick Action',
              full: 'Full Action',
              protocol: 'Protocol',
              reaction: 'Reaction',
              quicktech: 'Quick Tech',
              fulltech: 'Full Tech',
            } as any;
            return map[action];
      },
      rollString(): string {
        if (this.system.type !== 'weapon' && !this.system.tech_roll) return '';
        const { flat, accdiff } = (this.system as NPCSystem.Weapon).weapon_roll || (this.system as NPCSystem.NonWeapon).tech_roll;
        const { tier } = this.npc;
        let output = '';
        const flatTotal = flat
          ? flat.pertier
            ? flat.val * (tier + 1)
            : flat.val
          : 0;
        if (flatTotal) {
          if (flatTotal > -1) output += '+';
          output += flatTotal;
        }
        if (accdiff) {
          output += `${accdiff.val > -1 ? '+' : '-'}${Math.abs(accdiff.val) *
            (accdiff.pertier ? tier + 1 : 1)}d6`;
        }
        output += ' vs ';
        output += ((this.system as NPCSystem.Weapon).smart || (this.system as NPCSystem.NonWeapon).tech_roll) ? 'EDEF' : 'EV';
        return output;
      },
      rangeStrings(): string[] {
        if (this.system.type !== 'weapon') return [''];
        const map: { [key: string]: string } = {
          range: 'RNGE',
          threat: 'THRT',
          thrown: 'THWN',
          blast: 'BLST',
          burst: 'BRST',
          cone: 'CONE',
        };
        const { weapon_range: ranges } = this.system;
        return ranges
          .map((range: any) => {
            return `${map[range.type]} ${range.val}`;
          })
      },  
      damageStrings(): string[] {
        if (this.system.type !== 'weapon') return [''];
        const map: { [key: string]: string } = {
          kinetic: 'KIN',
          explosive: 'EXP',
          energy: 'NRG',
          burn: 'BRN',
          heat: 'HEA',
        };
        const { damage: damages } = this.system;
        return damages!
          .map((damage: any) => {
            const damageAmount =
              damage.val[Math.min(this.npc.tier, damage.val.length - 1)];
            return `${damageAmount} ${map[damage.type]}`;
          })
      },
    }
})
</script>

<style>
.syswrap {
  height: 100%;
}
.sys {
    overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
  border-width: 1px 1px 0 0;
  margin: 0;
  padding: 0.8em 1.2em;
  font-size: 0.7em;
  width: 100%;
  height: 100%;
  text-align: left;
  min-height: 43px;
}

.sys:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.d20 {
  font-size: 24px;
}
.sysname {
    border-radius: 4px;
    padding: 4px 6px !important;
}
.syseffectshort {
    white-space: nowrap;
    overflow: hidden;
    font-size: 1.1em !important;
}
</style>
