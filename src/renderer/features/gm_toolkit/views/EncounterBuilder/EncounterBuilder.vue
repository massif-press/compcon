<template>
    <v-container>
        <h3 class="headline mb-2 grey--text text--darken-1">
            Encounter Builder
        </h3>
        <v-layout column>
            <v-flex>
                <v-text-field
                    label="Name"
                    v-model="encounter.name"
                    style="font-size: 1.4em"
                    color="secondary"
                />
            </v-flex>
            <v-flex>
                <v-textarea
                    label="Notes"
                    outline
                    v-model="encounter.notes"
                    color="secondary"
                />
            </v-flex>
            <v-layout px-1>
                <v-flex xs12 sm6>
                    <h6 class="body-2 text-xs-left grey--text text--darken-1">
                        Encounter NPCs
                    </h6>
                    <v-card class="pickCard">
                        <v-slide-y-transition
                            group
                            tag="div"
                            class="layout column pa-3"
                        >
                            <v-flex
                                v-for="(npc, i) in encounter.npcs"
                                :key="npc.id"
                            >
                                <EncounterNPCObject
                                    :npc="npc"
                                    @deleted="deleteNPC(i)"
                                />
                            </v-flex>
                        </v-slide-y-transition>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm6>
                    <h6 class="body-2 text-xs-left grey--text text--darken-1">
                        Created NPCs
                    </h6>
                    <v-card class="pickCard">
                        <v-layout wrap pa-3>
                            <v-flex xs12 sm6 v-for="npc in npcs" :key="npc.id">
                                <File
                                    icon="mdi-account"
                                    :name="npc.name"
                                    @click.native="addNPC(npc)"
                                >
                                    <template v-slot:extra-icons>
                                        <v-icon>add</v-icon>
                                    </template>
                                </File>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import EncounterBase from '../../logic/EncounterBase';
import _ from 'lodash';
import { State, namespace } from 'vuex-class';
import NPC from '../../logic/NPC';
import File from "../../components/File.vue";
import EncounterNPCObject from "../../components/EncounterBuilder/EncounterNPCObject.vue";

import newId from '../../logic/newId';
import { mapState } from 'vuex';


const npcDesigner = namespace('npcDesigner');

export default Vue.extend({
    name: 'encounter-builder',
    components: { File, EncounterNPCObject },
    props: { 
        preEnc: { type: Object, required: true },
    },
    data: function() {
        return {
            encounter: _.clone(this.preEnc),
        }
    },
    computed: {
        ...mapState(['npcDesigner/npcs']),
        encounterNPCs() {
            return this.encounter.npcs.map(npc => npc.npc)
        }
    },
    methods: {
        addNPC(npc: NPC) {
            const count = this.encounter.npcs.filter(n => n.npc.id === npc.id).length + 1;
            this.encounter.npcs.push({
                id: newId(),
                name: `${npc.name} #${count}`,
                count: 1,
                npc,
            })
        },
        deleteNPC(i: number) {
            this.encounter.npcs.splice(i, 1)
        }
    },
    watch: {
        encounter: {
            handler: function onEditNPC(val: EncounterBase) {
                this.$store.commit('encounterBuilder/edit', val)
            },
            deep: true,
        },
    }
})
</script>

<style>
.pickCard {
    border-color: rgba(0,0,0,0.4) !important;
    background-color: transparent !important;
    height: 100%;
}
</style>
