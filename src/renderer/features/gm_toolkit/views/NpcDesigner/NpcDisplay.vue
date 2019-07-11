<template>
    <v-card :class="`role--${npc.npcClass.role}--text`">
        <!-- Header -->
        <v-card-title
            class="white--text d-flex"
            :class="`role--${npc.npcClass.role}`"
        >
            <v-container fluid style="padding: 0 16px">
                <v-layout
                    align-center
                    grow-shrink-0
                    :class="{
                        column: $vuetify.breakpoint.xsOnly,
                        'justify-center': $vuetify.breakpoint.xsOnly,
                    }"
                >
                    <v-flex headline>
                        {{ npc.name }}
                    </v-flex>
                    <v-flex
                        shrink
                        class="d-flex align-center justify-start grow-shrink-0"
                        :class="{
                            'ml-auto': !$vuetify.breakpoint.xsOnly,
                        }"
                    >
                        <v-icon dark size="36" class="mr-1">
                            mdi-numeric-{{ npc.tier + 1 }}-box
                        </v-icon>
                        <div class="subheading text-uppercase">
                            {{ npc.npcClass.name }}
                        </div>
                        <div
                            class="subheading text-uppercase"
                            v-if="npc._templates.length"
                        >
                            &nbsp;—&nbsp;{{ npc._templates.join(' ') }}
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-title>
        <v-container fluid>
            <!-- Stats -->
            <v-layout wrap justify-space-around class="statblock">
                <v-flex
                    xs6
                    sm2
                    lg1
                    v-for="stat in Object.keys(stats)"
                    :key="stat"
                >
                    <div class="label">{{ stat }}</div>
                    <div class="headline font-weight-bold primary--text">
                        {{ stats[stat] }}
                    </div>
                </v-flex>
            </v-layout>
            <v-divider class="my-3" />
            <!-- HASE -->
            <v-layout wrap justify-space-around class="statblock">
                <v-flex
                    xs6
                    sm2
                    lg1
                    v-for="hase in [
                        'hull',
                        'agility',
                        'systems',
                        'engineering',
                    ]"
                    :key="hase"
                >
                    <div class="label text-uppercase">{{ hase }}</div>
                    <div class="headline font-weight-bold primary--text">
                        {{ npc.stats[hase] > -1 ? '+' : ''
                        }}{{ npc.stats[hase] }}
                    </div>
                </v-flex>
            </v-layout>
            <!-- Features -->
            <template v-if="npc.features.length">
                <v-divider class="my-3" />
                <div class="hidden-xs-only">
                    <h6 class="title text-xs-left grey--text text--darken-1">
                        Features
                    </h6>
                    <h6
                        class="caption text-xs-left grey--text text--darken-1 mb-1"
                    >
                        {{ npc.features.length }} items
                    </h6>
                </div>
                <!-- Feature cards -->
                <v-layout wrap justify-center>
                    <v-flex
                        xs12
                        sm6
                        lg3
                        v-for="feature in npc.features"
                        :key="feature.name"
                    >
                        <feature-card :feature="feature" />
                    </v-flex>
                </v-layout>
            </template>
            <v-divider class="my-3" />
            <!-- Systems header -->
            <div class="hidden-xs-only">
                <h6 class="title text-xs-left grey--text text--darken-1">
                    Systems
                </h6>
                <h6 class="caption text-xs-left grey--text text--darken-1 mb-1">
                    {{ npc.systems.length }} items
                </h6>
            </div>
            <!-- System cards -->
            <v-layout wrap justify-center>
                <v-flex
                    xs12
                    sm6
                    lg3
                    v-for="system in npc.systems"
                    :key="system.name"
                >
                    <system-card :npc="npc" :system="system" />
                </v-flex>
            </v-layout>
        </v-container>
        <v-divider class="my-1" />
        <!-- Actions -->
        <v-card-actions class="mb-1">
            <v-btn
                flat
                :color="`role--${npc.npcClass.role}`"
                class="ml-auto"
                @click="$router.replace(`/npc-designer/edit/${npc.id}`)"
                >Edit</v-btn
            >
            <!-- Delete dialog -->
            <v-dialog v-model="deleteDialog" persistent max-width="290">
                <template v-slot:activator="{ on }">
                    <v-btn
                        flat
                        :color="`role--${npc.npcClass.role}`"
                        class="mr-3"
                        v-on="on"
                        >Delete</v-btn
                    >
                </template>
                <v-card>
                    <v-card-title class="headline"
                        >Delete {{ npc.name }}?</v-card-title
                    >
                    <v-card-text>This cannot be undone.</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :color="`role--${npc.npcClass.role}`"
                            flat
                            @click="deleteSelf"
                            >OK</v-btn
                        >
                        <v-btn
                            :color="`role--${npc.npcClass.role}`"
                            flat
                            @click="deleteDialog = false"
                            >Cancel</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import NPC from '../../logic/NPC';
import _ from 'lodash';
import { Dictionary } from 'vue-router/types/router';

import SystemCard from '../../components/Cards/SystemCard.vue'
import FeatureCard from '../../components/Cards/FeatureCard.vue'


export default Vue.extend({
    name: 'npc-display',
    components: { SystemCard, FeatureCard },
    props: {
        npc: { type: NPC, required: true },
    },
    data: () => ({
        deleteDialog: false,
    }),
    computed: {
        stats(): Dictionary<number> {
            const npcst = this.npc.stats
            let obj: {[key: string]: number | null} = {
                'HP': npcst.hp,
                'HEAT': npcst.heatcap,
                'STRUCTURE': npcst.structure > 1 ? npcst.structure : null,
                'STRESS': npcst.stress > 1 ? npcst.stress : null,
                'ARMOR': npcst.armor,
                'SPEED': npcst.speed,
                'EVADE': npcst.evade,
                'EDEF': npcst.edef,
                'SENSE': npcst.sensor,
                'SAVE': npcst.save,
                'SIZE': this.npc.size,
            }
            return _.pickBy(obj, o => o !== null) as Dictionary<number>;
        },
    },
    methods: {
        deleteSelf() {
            this.deleteDialog = false;
            this.$store.commit('npcDesigner/delete', this.npc.id)
            this.$router.replace('/npc-designer')
        },
    },
})
</script>

<style scoped>
.v-card__title {
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
}
.v-card__title .subheading {
    font-size: 1.1em !important;
}
.v-card__title > * {
    flex-grow: 0 !important;
    line-height: initial;
}
.statblock .headline {
    font-size: 28px !important;
}
.label {
    font-size: 1em;
    font-weight: bold;
}
</style>
