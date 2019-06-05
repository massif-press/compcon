<template>
    <v-container
        fluid
        style="display: flex;"
        align-center
        :style="{ padding: $vuetify.breakpoint.lgAndUp ? '0 20%' : 0 }"
        fill-height
    >
        <v-layout align-center wrap>
            <v-flex xs12 md4>
                <HomeCard
                    title="NPC Designer"
                    icon="mdi-account-edit"
                    text="Build NPCs to use in encounters."
                    to="npc-designer"
                />
            </v-flex>

            <v-flex xs12 md4>
                <HomeCard
                    title="Encounter Builder"
                    icon="mdi-account-multiple-plus"
                    text="Compose encounters using your NPCs."
                    to="encounter-builder"
                />
            </v-flex>

            <v-flex xs12 md4>
                <HomeCard
                    title="Encounter Runner"
                    icon="mdi-account-group"
                    text="Run your encounters digitally with NPC status tracking."
                    to="encounter-runner"
                    :icon-offset="13"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import HomeCard from '../components/Home/HomeCard.vue';


export default Vue.extend({
    name: 'home',
    components: { HomeCard }
})
</script>