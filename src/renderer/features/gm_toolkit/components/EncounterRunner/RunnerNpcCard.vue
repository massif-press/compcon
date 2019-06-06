<template>
    <v-card
        :class="{ [`${roleColor}--text`]: true, outlined: !elevated }"
        class="runner-npc-card d-flex-column"
    >
        <v-card-title
            class="white--text npccardtitle"
            :class="roleColor + ' ' + (isUltra ? 'bigTitle' : '')"
        >
            <v-layout
                :class="isUltra ? roleColor : ''"
                space-between
                align-center
                grow-shrink-0
            >
                <v-flex class="draghandle">
                    <v-icon dark>mdi-drag</v-icon>
                </v-flex>
                <v-flex class="title tierclass">
                    {{ npc.name }}
                </v-flex>
                <v-flex class="ml-auto body-2 text-uppercase tierclass">
                    TIER {{ npcData.tier + 1 }} {{ npcData.npcClass.name }}
                </v-flex>
                <v-flex py-0>
                    <v-btn
                        outline
                        small
                        color="white"
                        class="ma-0 px-2"
                        style="min-width: 0;"
                        title="Mark as Destroyed"
                        @click="npc.destroyed = true"
                    >
                        <v-icon small>mdi-skull-crossbones</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-card-text>
            <v-layout wrap v-if="!npcData._templates.includes('grunt')">
                <v-flex xs6>
                    <PipBar
                        label="hp"
                        v-model="npc.hp"
                        :max="npcData.stats.hp"
                        :rollover="npcData.stats.structure > 1"
                        @rollover="onHpRollover"
                    />
                </v-flex>
                <v-flex xs6>
                    <PipBar
                        label="heat"
                        v-model="npc.heat"
                        :max="npcData.stats.heatcap"
                        :rollover="npcData.stats.stress > 1"
                        rollover-negative
                        @rollover="onHeatRollover"
                    />
                </v-flex>
                <v-flex xs6 v-if="npcData.stats.structure > 1">
                    <PipBar
                        label="structure"
                        v-model="npc.structure"
                        :max="npcData.stats.structure"
                        :class="{ rolledOver: structRolledOver }"
                    />
                </v-flex>
                <v-flex xs6 v-if="npcData.stats.stress > 1">
                    <PipBar
                        label="stress"
                        v-model="npc.stress"
                        :max="npcData.stats.stress"
                        :class="{ rolledOver: stressRolledOver }"
                    />
                </v-flex>
            </v-layout>
            <v-layout column v-else>
                <span class="grey--text  caption">
                    The grunt only has 1 HP, structure and stress maximum. If it
                    takes heat, it shuts down. If it takes damage, it's
                    destroyed.<br />It <b>doesn't</b> take any damage from
                    successful saves.
                </span>
            </v-layout>
        </v-card-text>
        <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon @click="expanded = !expanded">
                <transition name="spin">
                    <v-icon v-if="!expanded" key="closed"
                        >keyboard_arrow_down</v-icon
                    >
                    <v-icon v-else key="open" :color="roleColor"
                        >keyboard_arrow_up</v-icon
                    >
                </transition>
            </v-btn>
        </v-card-actions> -->
        <v-expand-transition>
            <div
                class="d-flex justify-space-evenly"
                style="flex-direction: column; flex-grow: 1;"
            >
                <!-- v-if="expanded"             -->
                <v-divider class="my-2" />
                <v-container fluid pa-0>
                    <v-combobox
                        v-model="npc.statuses"
                        :items="baseStatuses"
                        item-text="name"
                        item-value="name"
                        label="Status effects"
                        :color="roleColor"
                        chips
                        clearable
                        multiple
                        full-width
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                :selected="data.selected"
                                close
                                @input="removeStatus(data.item)"
                                dark
                                color="primary"
                            >
                                <strong>{{
                                    data.item.name || data.item
                                }}</strong>
                            </v-chip>
                        </template>
                    </v-combobox>
                </v-container>
                <v-divider class="mb-2" />
                <v-layout :class="{ column: !isUltra }">
                    <v-container fluid px-3 py-1>
                        <v-layout wrap align-center>
                            <v-flex stat>
                                <v-flex class="caption">ARMOR</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.armor }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">EVADE</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.evade }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">EDEF</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.edef }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">SPEED</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.speed }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">SENSOR</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.sensor }}
                                </v-flex>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider class="my-2" />
                    <v-container fluid px-3 py-1>
                        <v-layout wrap align-center>
                            <v-flex stat>
                                <v-flex class="caption">HULL</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.hull > -1 ? '+' : ''
                                    }}{{ npcData.stats.hull }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">AGI</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.agility > -1 ? '+' : ''
                                    }}{{ npcData.stats.agility }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">SYS</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.systems > -1 ? '+' : ''
                                    }}{{ npcData.stats.systems }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">ENG</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{
                                        npcData.stats.engineering > -1
                                            ? '+'
                                            : ''
                                    }}{{ npcData.stats.engineering }}
                                </v-flex>
                            </v-flex>
                            <v-flex stat>
                                <v-flex class="caption">SAVE</v-flex>
                                <v-flex
                                    class="headline font-weight-bold primary--text"
                                >
                                    {{ npcData.stats.save }}
                                </v-flex>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-layout>
                <template v-if="npcData.features.length">
                    <v-divider class="my-2" />
                    <v-container pt-1 fluid class="primary--text">
                        <h3 class="body-2">
                            Features
                        </h3>
                        <v-dialog
                            max-width="500"
                            v-for="feature in npcData.features"
                            :key="feature.name"
                        >
                            <template v-slot:activator="{ on }">
                                <v-chip
                                    dark
                                    color="primary"
                                    v-on="on"
                                    class="featurechip"
                                    v-ripple
                                >
                                    {{ feature.name }}
                                </v-chip>
                            </template>
                            <v-card class="primary--text">
                                <v-card-title class="title primary white--text">
                                    {{ feature.name }}
                                </v-card-title>
                                <v-card-text>
                                    {{ feature.description }}
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-container>
                </template>
                <v-container fluid px-0 py-0 mt-3 mt-auto>
                    <v-layout wrap>
                        <v-flex
                            :class="
                                isUltra && $vuetify.breakpoint.xlOnly
                                    ? 'xs4 pa-0'
                                    : 'xs12 py-0'
                            "
                            v-for="system in systemsSorted"
                            :key="system.name"
                        >
                            <NpcCardSystem :system="system" :npc="npcData" />
                        </v-flex>
                    </v-layout>
                </v-container>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import { ActiveNPC } from '../../logic/ActiveEncounter';

import PipBar from './PipBar.vue'
import NpcCardSystem from './NpcCardSystem.vue'
import { NPCSystem } from '../../logic/interfaces/NPCSystem';

export default Vue.extend({
    name: 'runner-npc-card',
    components: { PipBar, NpcCardSystem },
    props: {
        elevated: {type: Boolean, default: false},
        npc: {type: Object, required: true},
    },
    data: function() {
        return {
        npcData: this.npc.baseNPC,
        baseStatuses: ActiveNPC.baseStatuses,
        expanded: false,
        structRolledOver: false,
        stressRolledOver: false,
    }
    },
    computed: {
        roleColor(): string {
            return `role--${this.npcData.npcClass.role}`
        },
        systemsSorted(): NPCSystem.Any[] {
            const systems: NPCSystem.Any[] = this.npc.baseNPC.systems;
            return _.sortBy(
              systems.filter(s => !s.hide_on_card),
              'type',
            ).reverse();
        },
        isUltra(): boolean {
            return this.npcData._templates.includes('ultra')
        },
    },
    methods: {
        onHpRollover() {
            if (this.npc.structure <= 1) {
                this.$nextTick(() => {this.npc.hp = 0})
            }
            this.npc.structure = this.npc.structure - 1;
            if (this.npc.structure < 0) this.npc.structure = 0;
            else {
                this.structRolledOver = true;
                setTimeout(() => {
                    this.structRolledOver = false;            
                }, 500);
            }
        },
        onHeatRollover() {
            const max = this.npcData.stats.stress
            if (this.npc.stress >= this.npcData.stats.stress - 1) {
                this.$nextTick(() => {this.npc.heat = this.npcData.stats.heatcap})
            }
            this.npc.stress = this.npc.stress + 1;
            if (this.npc.stress > max) this.npc.stress = max;
            else {
                this.stressRolledOver = true;
                setTimeout(() => {
                    this.stressRolledOver = false;            
                }, 500);
            }
        },
        removeStatus(statusName: string) {
            this.npc.statuses = _.without(this.npc.statuses, statusName)
        }
    }

});
</script>

<style>
.v-card {
    overflow: hidden;
}
.v-card .v-card__title {
    border-radius: 0 !important;
    display: block;
}

.tierclass {
    flex-shrink: 1 !important;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.stat .caption {
    font-size: 0.8em !important;
    font-weight: bold !important;
}
.stat * {
    padding: 0 !important;
}
.featurechip * {
    cursor: pointer !important
}

.bigTitle {
    background-image: linear-gradient(135deg, #ffffff 25%, transparent 25%, transparent 50%, #ffffff 50%, #ffffff 75%, transparent 75%, transparent 100%);
    background-size: 56.57px 56.57px;
    background-repeat: repeat;
    border-bottom: 1px solid currentColor;
}
.bigTitle .layout {
    padding: 4px;
    border-radius: 4px;
}
.draghandle, .draghandle * {
    cursor: grab !important;
}
.rolledOver * {
    animation-name: rollover;
    animation-duration: 500ms;
    animation-timing-function: ease-out;
}
@keyframes rollover {
    0% {
        color: red;
    }
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
    100% {
        color: inherit;
    }
}
</style>
