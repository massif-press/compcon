<template>
    <v-card class="primary--text">
        <v-tabs dark color="primary" slider-color="secondary">
            <v-tab>
                NPCs
            </v-tab>
            <v-tab>
                Graveyard
            </v-tab>
            <!-- NPCs -->
            <v-tab-item>
                <v-container fluid>
                    <draggable
                        handle=".draghandle"
                        @start="onStartDrag"
                        @end="onChange"
                        :animation="250"
                        ghost-class="dragging-hidden"
                        drag-class="dragging"
                        chosen-class="chosen"
                        easing="cubic-bezier(1, 0, 0, 1)"
                        :force-fallback="true"
                    >
                        <v-slide-y-transition
                            group
                            tag="div"
                            class="layout row wrap justify-start"
                        >
                            <v-flex
                                xs12
                                sm6
                                class="cardflex"
                                :class="calcSize(npc)"
                                v-for="npc in aliveNpcs"
                                :key="npc.id"
                            >
                                <runner-npc-card :npc="npc" />
                            </v-flex>
                        </v-slide-y-transition>
                    </draggable>
                </v-container>
            </v-tab-item>
            <!-- Graveyard -->
            <v-tab-item>
                <v-container fluid>
                    <v-slide-y-transition
                        group
                        tag="div"
                        class="layout row wrap justify-start grow-shrink-0"
                    >
                        <v-flex
                            xs12
                            sm6
                            md3
                            v-for="npc in destroyedNpcs"
                            :key="npc.id"
                        >
                            <v-card color="grey darken-2" class="dead-npc">
                                <v-card-title class="white--text title"
                                    >{{ npc.name }}
                                    <v-btn
                                        dark
                                        icon
                                        class="ma-0 ml-2 px-2"
                                        style="min-width: 0;"
                                        title="Bring Back"
                                        @click="npc.destroyed = false"
                                        ><v-icon dark>mdi-undo</v-icon></v-btn
                                    ></v-card-title
                                >
                            </v-card>
                        </v-flex>
                    </v-slide-y-transition>
                </v-container>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script lang="ts">
import draggable from 'vuedraggable'
import Vue from 'vue';
import _ from 'lodash';
import ActiveEncounter, { ActiveNPC } from '../../logic/ActiveEncounter';
// components
import RunnerNpcCard from '../../components/EncounterRunner/RunnerNpcCard.vue'

export default Vue.extend({
    components: { RunnerNpcCard, draggable },
    props: { 
        preEnc: { type: Object, required: true },
    },
    data: function() {
        return {
            encounter: _.clone(this.preEnc),
            draggedIndex: null as number | null,
        }
    },
    computed: {
        allNpcs() {
            return this.encounter.npcs
        },

        aliveNpcs() {
            return this.allNpcs.filter(n => !n.destroyed)
        },

        destroyedNpcs() {
            return this.allNpcs.filter(n => n.destroyed)
        },
    },
    methods: {
        calcSize({ baseNPC: npc }: ActiveNPC) {
            if (npc._templates.includes('ultra')) return 'md12';
            if (npc._templates.includes('elite')) return 'md6';
            return 'md3';
        },

        onStartDrag({ oldIndex }: { oldIndex: number }) {
            this.draggedIndex = oldIndex;
        },

        onChange({newIndex, oldIndex}: any) {
            this.draggedIndex = null;
            const arr = _.clone(this.encounter.npcs)
            arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
            console.log(arr.map(a => a.baseNPC.name))
            this.encounter.npcs = [...arr];
        }
    },
    watch: {
        encounter: {
            handler: function onEncounterChange(val: ActiveEncounter) {
                this.$store.commit('encounterRunner/edit', val)
            },
            deep: true
        }
    }

})
</script>

<style>
.v-tabs__bar {
    border-radius: 0;
}
.dragging-hidden {
    opacity: 0;
}
.dragging, .dragging * {
    opacity: 1 !important;
    cursor: grabbing !important;
}
</style>
