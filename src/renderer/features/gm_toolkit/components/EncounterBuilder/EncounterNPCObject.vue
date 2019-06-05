<template>
    <v-card :color="roleColor" :class="`${roleColor}--text`">
        <v-layout align-center grow-shrink-0 pl-4 pr-2 py-2 class="white--text">
            <v-flex>
                <v-text-field
                    dark
                    v-model="npc.name"
                    prepend-icon="mdi-account"
                    color="white"
                    class="namefield"
                />
            </v-flex>
            <v-flex ml-auto class="body-2">
                <v-chip label outline dark color="white" disabled>
                    NPC: {{ encounterNPC.npc.name }}
                </v-chip>
            </v-flex>
            <v-btn
                style="margin-left: 0"
                small
                icon
                dark
                @click="$emit('deleted')"
            >
                <v-icon small>delete</v-icon>
            </v-btn>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { EncounterBaseNPC } from '../../logic/EncounterBase';
import _ from 'lodash';

@Component({

})
export default class EncounterNPCObject extends Vue {
    @Prop(Object) npc!: EncounterBaseNPC;
    encounterNPC = _.clone(this.npc);

    get roleColor() {
        return `role--${this.npc.npc.npcClass.role}`
    }

}
</script>

<style>
.namefield {
    font-size: 1em !important;
    margin-top: 0.3em !important;
}
.namefield input {
    padding: 1px !important;
    margin-top: 0.2em;
}
</style>
