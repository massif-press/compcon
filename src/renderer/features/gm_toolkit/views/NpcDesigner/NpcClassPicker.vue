<template>
    <v-card class="grey--text">
        <v-container px-4 class="grey--text text--darken-1" fluid>
            <div class="mt-2 mb-4 headline grey--text">
                Choose a class.
            </div>
            <template v-for="role in Object.keys(classesByRole)">
                <v-flex :key="`${role}--title`">
                    <h2 class="body-2 role-title">{{ role }}</h2>
                    <v-divider class="role-title-line" />
                </v-flex>
                <v-layout row wrap justify-center mb-4 px-3 :key="role">
                    <v-flex
                        xs12
                        sm4
                        md2
                        v-for="cls in classesByRole[role]"
                        :key="cls.name"
                    >
                        <v-btn
                            block
                            outline
                            :color="`role--${role}`"
                            class="cls-button d-flex pa-0"
                            @click="selectClass(cls)"
                        >
                            <div>{{ cls.name }}</div>
                            <v-btn
                                icon
                                small
                                class="ma-0 ml-1"
                                @click.stop="getInfo(cls)"
                            >
                                <v-icon small :color="`role--${role}`">
                                    mdi-help
                                </v-icon>
                            </v-btn>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </template>
        </v-container>
        <v-dialog v-model="infoDialog" max-width="50%">
            <class-info
                v-if="infoClass"
                :cls="infoClass"
                @chosen="
                    infoDialog = false;
                    selectClass(infoClass);
                "
            />
        </v-dialog>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';

import npcClasses from '../../static/classes.json';
import NPC from '../../logic/NPC';
import NPCClass from '../../logic/interfaces/NPCClass';
import { mapMutations } from 'vuex';

import ClassInfo from '../../components/NpcDesigner/ClassInfo.vue'

export default Vue.extend({
    components: { ClassInfo },
    data: () => ({
        infoDialog: false,
        infoClass: null as null | NPCClass,
    }),
    methods: {
        selectClass(cls: NPCClass) {
            const npc = new NPC(cls);
            npc.name = `My ${_.capitalize(cls.name)}`
            this.$store.commit('npcDesigner/add', npc);
            this.$router.replace(`edit/${npc.id}`)
        },
        getInfo(cls: NPCClass) {
            this.infoClass = cls;
            this.infoDialog = true;
        }
    },
    computed: {
        classesByRole(): object {
            return _.groupBy(npcClasses, 'role');
        }
    }
})
</script>

<style scoped>
.role-title-line {
    border-color: currentColor;
    position: relative;
    bottom: 11px;
    margin: 0 auto;
}
.role-title {
    letter-spacing: 0.1em;
    text-transform: uppercase;
    position: relative;
    z-index: 10;
    display: inline-block;
    text-align: center;
    padding: 0 0.75em;
    margin: auto;
    background-color: white;
}
</style>
