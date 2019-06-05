<template>
    <v-card :class="`role--${npc.npcClass.role}--text npc-builder`">
        <!-- Header -->
        <v-card-title
            class="white--text d-flex"
            :class="roleColor"
            style="min-height: 70px;"
        >
            <v-container fluid style="padding: 0 16px">
                <v-layout
                    align-center
                    grow-shrink-0
                    wrap
                    :class="{
                        column: $vuetify.breakpoint.xsOnly,
                        'justify-center': $vuetify.breakpoint.xsOnly,
                    }"
                >
                    <v-fade-transition leave-absolute>
                        <v-layout
                            align-center
                            v-if="!editingName"
                            class="name"
                            key="name"
                        >
                            <v-flex headline>
                                {{ npc.name }}
                            </v-flex>
                            <v-flex>
                                <v-btn
                                    flat
                                    dark
                                    class="my-0 mx-1 px-2"
                                    style="min-width: 0;"
                                    @click="editName"
                                >
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-flex v-else key="editname">
                            <v-text-field
                                ref="namefield"
                                required
                                dark
                                color="white"
                                v-model="newName"
                                @blur="submitName"
                                @keyup.enter="$refs.namefield.blur"
                                class="mx-0 my-0"
                            >
                            </v-text-field>
                        </v-flex>
                    </v-fade-transition>
                    <v-flex
                        xs12
                        sm2
                        :class="{
                            'mx-0': $vuetify.breakpoint.xsOnly,
                            'ml-auto': $vuetify.breakpoint.smAndUp,
                            'mr-2': $vuetify.breakpoint.smAndUp,
                        }"
                    >
                        <v-btn-toggle v-model="npc.tier" mandatory>
                            <v-btn flat>
                                <v-icon :color="roleColor"
                                    >mdi-numeric-1-box</v-icon
                                >
                            </v-btn>
                            <v-btn flat>
                                <v-icon :color="roleColor"
                                    >mdi-numeric-2-box</v-icon
                                >
                            </v-btn>
                            <v-btn flat>
                                <v-icon :color="roleColor"
                                    >mdi-numeric-3-box</v-icon
                                >
                            </v-btn>
                        </v-btn-toggle>
                    </v-flex>
                    <v-flex subheading shrink>
                        <div class="text-uppercase">
                            {{ npc.npcClass.name }}
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-title>
        <v-card-text class="px-4">
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
                <v-flex xs6 sm2 lg1>
                    <div class="label">
                        SIZE
                    </div>
                    <div class="headline font-weight-bold primary--text">
                        <v-select
                            v-if="npc.npcClass.size.length > 1"
                            :items="npc.npcClass.size"
                            v-model="npc.size"
                            :color="roleColor"
                        />
                        <div
                            v-else
                            class="headline font-weight-bold primary--text"
                        >
                            {{ npc.size }}
                        </div>
                    </div>
                </v-flex>
            </v-layout>
            <v-divider class="my-3" />
            <!-- HASE -->
            <v-layout wrap justify-center class="statblock">
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
            <v-divider class="my-3" />
            <!-- Notes -->
            <v-text-field
                outline
                label="Notes"
                v-model="npc.notes"
                :color="roleColor"
            >
            </v-text-field>
            <v-divider class="mt-2 mb-3" />
            <!-- Systems header -->
            <v-layout grow-shrink-0>
                <v-flex
                    class="title mb-2 text-xs-left grey--text text--darken-1"
                >
                    Systems
                </v-flex>
                <v-flex ml-auto>
                    <v-checkbox
                        :color="roleColor"
                        v-model="systemsUnlocked"
                        label="Unlock all systems"
                    />
                </v-flex>
            </v-layout>
            <!-- Systems picker -->
            <v-layout wrap>
                <v-flex xs12 sm6>
                    <v-card class="picker-card">
                        <v-container>
                            <v-fade-transition
                                group
                                tag="div"
                                class="layout justify-start grow-shrink-0 wrap"
                            >
                                <system-button
                                    v-for="system in mySystems"
                                    :key="system.name"
                                    :system="system"
                                    :closable="
                                        !system.base ||
                                            // make it also closable if it's a base system from another class
                                            ![
                                                npc.npcClass.name,
                                                'generic',
                                            ].includes(system.class)
                                    "
                                    @close="npc.removeSystem(system)"
                                />
                            </v-fade-transition>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-card class="picker-card">
                        <v-tabs dark color="primary" slider-color="secondary">
                            <v-tab
                                v-for="cat in Object.keys(systemsAvailable)"
                                :key="cat"
                                ripple
                                centered
                                mandatory
                            >
                                {{ cat }}
                            </v-tab>
                            <v-tab-item
                                v-for="cat in Object.keys(systemsAvailable)"
                                :key="cat"
                            >
                                <v-container fluid>
                                    <v-fade-transition
                                        group
                                        tag="div"
                                        class="layout justify-start grow-shrink-0 wrap"
                                    >
                                        <system-button
                                            v-for="system in systemsAvailable[
                                                cat
                                            ]"
                                            :key="system.name"
                                            :system="system"
                                            :addable="true"
                                            @add="npc.pickSystem(system)"
                                        />
                                    </v-fade-transition>
                                </v-container>
                            </v-tab-item>
                        </v-tabs>
                    </v-card>
                </v-flex>
            </v-layout>
            <!-- Templates header -->
            <v-divider class="my-3" />
            <v-layout grow-shrink-0>
                <v-flex
                    class="title mb-2 text-xs-left grey--text text--darken-1"
                >
                    Templates
                </v-flex>
            </v-layout>
            <!-- Templates picker -->
            <v-layout>
                <v-flex xs6>
                    <v-card class="picker-card">
                        <v-container>
                            <v-fade-transition
                                group
                                tag="div"
                                class="layout justify-start grow-shrink-0 wrap"
                            >
                                <template-button
                                    v-for="template in npc.templates"
                                    :key="template.name"
                                    :template="template"
                                    :closable="!template.base"
                                    @close="npc.removeTemplate(template.name)"
                                />
                            </v-fade-transition>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <v-card class="picker-card">
                        <v-container fluid>
                            <v-fade-transition
                                group
                                tag="div"
                                class="layout justify-start grow-shrink-0 wrap"
                            >
                                <template-button
                                    v-for="template in npc.availableTemplates"
                                    :key="template.name"
                                    :template="template"
                                    :addable="true"
                                    @add="npc.addTemplate(template.name)"
                                    :disabled="
                                        npc.templateIsIncompatible(
                                            template.name,
                                        )
                                    "
                                />
                            </v-fade-transition>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-divider class="my-1" />
        <v-card-actions class="mb-1 mr-2">
            <v-btn
                flat
                :color="roleColor"
                class="ml-auto"
                @click="$router.push('/npc-designer/')"
                >Done</v-btn
            >
        </v-card-actions>
        <GoblinChan v-if="npc && tips.length" :tips="tips" key="goblinchan" />
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _ from 'lodash';
// components
import SystemButton from "../../components/NpcDesigner/SystemButton.vue";
import TemplateButton from "../../components/NpcDesigner/TemplateButton.vue";
import GoblinChan from "../../components/NpcDesigner/GoblinChan.vue";
// vuex
import { mapState } from 'vuex';

import NPC from '../../logic/NPC';
import { Dictionary } from 'vue-router/types/router';
import { NPCSystem } from '../../logic/interfaces/NPCSystem';
import { NPCTips } from '../../logic/Tips';


@Component({
    components: { SystemButton, TemplateButton, GoblinChan }
})
export default class NpcBuilder extends Vue {
    @Prop(Object) readonly preNpc!: NPC

    editingName = false;
    newName = '';
    npc = _.clone(this.preNpc);
    systemsUnlocked = false;

    get tips(): object[] {
      return NPCTips(this.npc);
    }
    
    get stats() {
        const npcst = (this.npc as NPC).stats
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
        }
        return _.pickBy(obj, o => o !== null);
    }

    get systemsAvailable(): { [key: string]: NPCSystem.Any[]} {
      const { npc } = this;
      const preSort = NPC.allSystems.filter((system) => {
          return !npc.systems.includes(system)
          && (this.systemsUnlocked ||
            npc._templates.concat([npc.npcClass.name, 'generic']).includes(system.class)
          )
      });
      const sortedAndGrouped = _.groupBy(_.orderBy(
        preSort,
        ['base', 'type', 'name'],
        ['desc', 'desc', 'asc'],
      ), 'class');
      // forcibly sort the object to have the class's systems first, then generic, then everything else
      return {
          [npc.npcClass.name]: sortedAndGrouped[npc.npcClass.name],
          'generic': sortedAndGrouped['generic'],
          // pick sorted object removing classname and generic
          ..._.pickBy(sortedAndGrouped,
            (value, key) => ![npc.npcClass.name, 'generic'].includes(key)
          )
      }
    }

    get mySystems(): NPCSystem.Any[] {
        return _.orderBy(
          this.npc.systems,
          ['base', 'type', 'name'],
          ['desc', 'desc', 'asc'],
        )
    }

    get roleColor(): string {
        return `role--${this.npc.npcClass.role}`
    }

    editName() {
        this.editingName = true;
        this.newName = (this.npc as NPC)._name || '';
        this.$nextTick(() => {
            (this.$refs.namefield as any).focus()
        })
    }

    submitName() {
        if (this.newName) {
            (this.npc as NPC)._name = this.newName;
        }
        this.editingName = false;
    }

    @Watch('npc', {deep: true})
    onEditNPC(val: NPC) {
        this.$store.commit('npcDesigner/edit', val)
    }

}
</script>

<style>
.npc-builder {
    width: 80%;
    margin: 0 auto;
}
/* fixing some weird positioning glitches with the name-edit transition */
.name.fade-transition-enter-active {
    position: relative;
    top: -2px;
}
.name.fade-transition-leave-active {
    position: relative;
    bottom: 1px;
}
.v-input {
    padding: 0 !important;
    margin: 0 !important;
}
.v-input__slot {
    margin-bottom: 0 !important;
}
.v-input .v-messages {
    display: none;
}
.label {
    font-size: 1em;
    font-weight: bold;
}
/* .v-select__selection {
    font-size: 24px;
    margin-left: 60%;
} */
.picker-card {
    border-color: rgba(0, 0, 0, 0.125) !important;
    background-color: #f8f9fa !important;
    height: 250px;
    overflow-y: auto !important;
}

.picker-card .v-tabs__bar {
    border-radius: 0;
}
</style>
